"use client"

import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface Execution {
  id: string
  task_name: string
  agent_hostname: string
  status: string
  started_at: string
  duration: number
}

export function RecentTasks() {
  const [executions, setExecutions] = useState<Execution[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRecentExecutions = async () => {
    try {
      const response = await fetch("/api/executions")
      if (response.ok) {
        const data = await response.json()
        // Get last 3 executions
        setExecutions(data.slice(0, 3))
      }
    } catch (error) {
      console.error("Failed to fetch recent executions:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    if (!timestamp) return "Unknown"
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
    return `${Math.floor(diffMins / 1440)} days ago`
  }

  const formatDuration = (duration: number) => {
    if (!duration) return "N/A"
    if (duration < 1000) return `${duration}ms`
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`
    return `${(duration / 60000).toFixed(1)}m`
  }

  useEffect(() => {
    fetchRecentExecutions()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRecentExecutions, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="text-center py-4">Loading recent tasks...</div>
  }

  if (executions.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No recent executions found.</div>
  }

  return (
    <div className="space-y-3">
      {executions.map((execution) => (
        <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-3">
            {execution.status === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : execution.status === "running" ? (
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <div>
              <p className="font-medium">{execution.task_name}</p>
              <p className="text-sm text-muted-foreground">{execution.agent_hostname}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm">{formatTimeAgo(execution.started_at)}</p>
            <p className="text-xs text-muted-foreground">{formatDuration(execution.duration)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
