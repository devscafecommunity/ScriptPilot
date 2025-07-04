"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Trash2, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface Task {
  id: string
  name: string
  description: string
  agent_id: string
  agent_hostname: string
  agent_ip: string
  script_name: string
  schedule: string
  active: boolean
  created_at: string
}

export function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [executingTasks, setExecutingTasks] = useState<Set<string>>(new Set())

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const executeTask = async (taskId: string) => {
    setExecutingTasks((prev) => new Set(prev).add(taskId))

    try {
      const response = await fetch(`/api/tasks/${taskId}/execute`, {
        method: "POST",
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Task executed ${result.status === "success" ? "successfully" : "with errors"}`)
      } else {
        alert("Failed to execute task")
      }
    } catch (error) {
      console.error("Failed to execute task:", error)
      alert("Failed to execute task")
    } finally {
      setExecutingTasks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchTasks() // Refresh tasks list
      }
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const formatSchedule = (schedule: string) => {
    if (!schedule) return "Manual only"

    // Basic cron to human readable conversion
    const parts = schedule.split(" ")
    if (parts.length === 5) {
      const [min, hour, day, month, weekday] = parts

      if (min === "0" && hour !== "*" && day === "*" && month === "*" && weekday === "*") {
        return `Daily at ${hour}:00`
      }
      if (min === "0" && hour !== "*" && day === "*" && month === "*" && weekday !== "*") {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        return `${days[Number.parseInt(weekday)]} at ${hour}:00`
      }
    }

    return schedule
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Schedule</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>
              <div>
                <p className="font-medium">{task.name}</p>
                <p className="text-sm text-muted-foreground">{task.script_name}</p>
                {task.description && <p className="text-xs text-muted-foreground mt-1">{task.description}</p>}
              </div>
            </TableCell>
            <TableCell>
              <div>
                <Badge variant="outline">{task.agent_hostname}</Badge>
                <p className="text-xs text-muted-foreground mt-1">{task.agent_ip}</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="text-sm">{formatSchedule(task.schedule)}</p>
                {task.schedule && <p className="text-xs text-muted-foreground font-mono">{task.schedule}</p>}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={task.active ? "default" : "secondary"}>{task.active ? "Active" : "Inactive"}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => executeTask(task.id)}
                  disabled={executingTasks.has(task.id)}
                  title="Execute Now"
                >
                  {executingTasks.has(task.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)} title="Delete Task">
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
