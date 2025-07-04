"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, RefreshCw, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Agent {
  id: string
  hostname: string
  ip: string
  port: number
  status: string
  last_seen: string
  os: string
  arch: string
  cpu: string
  ram: string
  created_at: string
}

export function AgentTable() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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

  const deleteAgent = async (agentId: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return

    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchAgents() // Refresh agents list
      }
    } catch (error) {
      console.error("Failed to delete agent:", error)
    }
  }

  const formatLastSeen = (dateString: string) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
    return `${Math.floor(diffMins / 1440)} days ago`
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading agents...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Agent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>System Info</TableHead>
          <TableHead>Hardware</TableHead>
          <TableHead>Last Seen</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {agents.map((agent) => (
          <TableRow key={agent.id}>
            <TableCell>
              <div className="flex items-center space-x-2">
                {agent.status === "online" ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-600" />
                )}
                <div>
                  <p className="font-medium">{agent.hostname}</p>
                  <p className="text-sm text-muted-foreground">
                    {agent.ip}:{agent.port}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={agent.status === "online" ? "default" : "destructive"}>{agent.status}</Badge>
            </TableCell>
            <TableCell>
              <div>
                <p className="text-sm">{agent.os || "Unknown"}</p>
                <p className="text-xs text-muted-foreground">{agent.arch || "Unknown"}</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="text-sm">{agent.cpu || "Unknown"}</p>
                <p className="text-xs text-muted-foreground">{agent.ram || "Unknown"} RAM</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="text-sm">{formatLastSeen(agent.last_seen)}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={() => pingAgent(agent.id)} title="Ping Agent">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteAgent(agent.id)} title="Delete Agent">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
