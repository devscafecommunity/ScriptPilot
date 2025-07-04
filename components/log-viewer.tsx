"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, XCircle, Info, AlertTriangle, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface Execution {
  id: string
  task_id: string
  task_name: string
  agent_id: string
  agent_hostname: string
  status: string
  output: string
  error_message: string
  started_at: string
  finished_at: string
  duration: number
}

export function LogViewer() {
  const [executions, setExecutions] = useState<Execution[]>([])
  const [loading, setLoading] = useState(true)

  const fetchExecutions = async () => {
    try {
      const response = await fetch("/api/executions")
      if (response.ok) {
        const data = await response.json()
        setExecutions(data)
      }
    } catch (error) {
      console.error("Failed to fetch executions:", error)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "running":
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "success":
        return "default"
      case "failed":
        return "destructive"
      case "running":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatDuration = (duration: number) => {
    if (!duration) return "N/A"
    if (duration < 1000) return `${duration}ms`
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`
    return `${(duration / 60000).toFixed(1)}m`
  }

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp).toLocaleString()
  }

  useEffect(() => {
    fetchExecutions()
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchExecutions, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading execution logs...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Showing {executions.length} recent executions</p>
        <Button variant="outline" size="sm" onClick={fetchExecutions}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-3">
          {executions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No execution logs found. Run some tasks to see logs here.
            </div>
          ) : (
            executions.map((execution) => (
              <div key={execution.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getIcon(execution.status)}
                    <span className="text-sm font-mono text-muted-foreground">
                      {formatTimestamp(execution.started_at)}
                    </span>
                    <Badge variant="outline">{execution.agent_hostname}</Badge>
                    <Badge variant={getBadgeVariant(execution.status)}>{execution.status}</Badge>
                    {execution.duration && (
                      <span className="text-xs text-muted-foreground">{formatDuration(execution.duration)}</span>
                    )}
                  </div>
                </div>
                <div className="ml-6">
                  <p className="font-medium">{execution.task_name}</p>
                  {execution.output && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-1">Output:</p>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap">
                        {execution.output}
                      </pre>
                    </div>
                  )}
                  {execution.error_message && (
                    <div className="mt-2">
                      <p className="text-sm text-red-600 mb-1">Error:</p>
                      <pre className="text-xs bg-red-50 text-red-800 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                        {execution.error_message}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
