"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"

interface Agent {
  id: string
  hostname: string
  ip: string
  status: string
  last_seen: string
  os: string
}

export function AgentStatusCard() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/agents")
      if (response.ok) {
        const data = await response.json()
        setAgents(data)
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error)
    } finally {
      setLoading(false)
    }
  }

  const pingAgent = async (agentId: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/ping`, {
        method: "POST",
      })
      if (response.ok) {
        fetchAgents() // Refresh agents list
      }
    } catch (error) {
      console.error("Failed to ping agent:", error)
    }
  }

  useEffect(() => {
    fetchAgents()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAgents, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="text-center py-4">Loading agents...</div>
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">No agents connected. Add an agent to get started.</div>
    )
  }

  return (
    <div className="space-y-3">
      {agents.slice(0, 3).map((agent) => (
        <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-3">
            {agent.status === "online" ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <div>
              <p className="font-medium">{agent.hostname}</p>
              <p className="text-sm text-muted-foreground">{agent.ip}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={agent.status === "online" ? "default" : "destructive"}>{agent.status}</Badge>
            <Button variant="ghost" size="sm" onClick={() => pingAgent(agent.id)}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
