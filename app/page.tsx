"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Server, Clock, AlertTriangle } from "lucide-react"
import { AgentStatusCard } from "@/components/agent-status-card"
import { RecentTasks } from "@/components/recent-tasks"
import { UpcomingTasks } from "@/components/upcoming-tasks"
import { useEffect, useState } from "react"

interface Stats {
  totalAgents: number
  onlineAgents: number
  activeTasks: number
  failedTasks: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalAgents: 0,
    onlineAgents: 0,
    activeTasks: 0,
    failedTasks: 0,
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      // Fetch agents
      const agentsResponse = await fetch("/api/agents")
      const agents = agentsResponse.ok ? await agentsResponse.json() : []

      // Fetch tasks
      const tasksResponse = await fetch("/api/tasks")
      const tasks = tasksResponse.ok ? await tasksResponse.json() : []

      // Fetch recent executions to count failures
      const executionsResponse = await fetch("/api/executions")
      const executions = executionsResponse.ok ? await executionsResponse.json() : []

      // Calculate stats
      const totalAgents = agents.length
      const onlineAgents = agents.filter((agent: any) => agent.status === "online").length
      const activeTasks = tasks.filter((task: any) => task.active).length

      // Count failed tasks in last 24 hours
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const failedTasks = executions.filter(
        (exec: any) => exec.status === "failed" && new Date(exec.started_at) > yesterday,
      ).length

      setStats({
        totalAgents,
        onlineAgents,
        activeTasks,
        failedTasks,
      })
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your task scheduler and connected agents</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgents}</div>
            <p className="text-xs text-muted-foreground">{stats.onlineAgents} online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Agents</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.onlineAgents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalAgents > 0 ? ((stats.onlineAgents / stats.totalAgents) * 100).toFixed(0) : 0}% uptime
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.activeTasks}</div>
            <p className="text-xs text-muted-foreground">Scheduled tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failedTasks}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Agent Status</CardTitle>
            <CardDescription>Current status of connected agents</CardDescription>
          </CardHeader>
          <CardContent>
            <AgentStatusCard />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Executions</CardTitle>
            <CardDescription>Latest task executions</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTasks />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
          <CardDescription>Next scheduled executions</CardDescription>
        </CardHeader>
        <CardContent>
          <UpcomingTasks />
        </CardContent>
      </Card>
    </div>
  )
}
