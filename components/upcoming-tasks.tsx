"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Clock, Play } from "lucide-react"

interface Task {
  id: string
  name: string
  description: string
  agent_hostname: string
  schedule: string
  active: boolean
}

interface UpcomingTask {
  id: string
  name: string
  agent: string
  nextRun: string
  timeUntil: string
  schedule: string
}

export function UpcomingTasks() {
  const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([])
  const [loading, setLoading] = useState(true)

  const parseNextRun = (schedule: string): Date | null => {
    if (!schedule) return null
    
    // Implementação básica para interpretar cron expressions
    // Para uma implementação completa, seria recomendado usar uma biblioteca como node-cron
    const now = new Date()
    
    // Exemplos de schedules simples que podemos interpretar
    if (schedule.includes("daily") || schedule === "0 0 * * *") {
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      return tomorrow
    }
    
    if (schedule.includes("weekly") || schedule === "0 0 * * 0") {
      const nextSunday = new Date(now)
      const daysUntilSunday = (7 - now.getDay()) % 7 || 7
      nextSunday.setDate(now.getDate() + daysUntilSunday)
      nextSunday.setHours(0, 0, 0, 0)
      return nextSunday
    }
    
    // Para schedules mais complexos, retorna uma data estimada
    const nextHour = new Date(now)
    nextHour.setHours(nextHour.getHours() + 1)
    return nextHour
  }

  const formatNextRun = (date: Date): string => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else {
      const dayName = date.toLocaleDateString([], { weekday: 'long' })
      const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      return `${dayName} at ${time}`
    }
  }

  const formatTimeUntil = (date: Date): string => {
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60))
      return `in ${diffMins} minutes`
    } else if (diffHours < 24) {
      return `in ${diffHours} hours`
    } else {
      return `in ${diffDays} days`
    }
  }

  const fetchUpcomingTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      if (response.ok) {
        const tasks: Task[] = await response.json()
        
        // Filtrar apenas tarefas ativas com schedule
        const activeTasks = tasks.filter(task => task.active && task.schedule)
        
        // Processar e ordenar por próxima execução
        const processed = activeTasks
          .map(task => {
            const nextRunDate = parseNextRun(task.schedule)
            if (!nextRunDate) return null
            
            return {
              id: task.id,
              name: task.name,
              agent: task.agent_hostname,
              nextRun: formatNextRun(nextRunDate),
              timeUntil: formatTimeUntil(nextRunDate),
              schedule: task.schedule,
              nextRunDate
            }
          })
          .filter(Boolean)
          .sort((a, b) => a!.nextRunDate.getTime() - b!.nextRunDate.getTime())
          .slice(0, 5) // Mostrar apenas as próximas 5 tarefas
          .map(({ nextRunDate, ...task }) => task) as UpcomingTask[]
        
        setUpcomingTasks(processed)
      }
    } catch (error) {
      console.error("Failed to fetch upcoming tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const executeTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/execute`, {
        method: "POST",
      })
      
      if (response.ok) {
        // Opcional: mostrar feedback de sucesso
        console.log("Task executed successfully")
      } else {
        console.error("Failed to execute task")
      }
    } catch (error) {
      console.error("Failed to execute task:", error)
    }
  }

  useEffect(() => {
    fetchUpcomingTasks()
    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchUpcomingTasks, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="text-center py-4">Loading upcoming tasks...</div>
  }

  if (upcomingTasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No upcoming scheduled tasks</p>
        <p className="text-sm">Create tasks with schedules to see them here</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {upcomingTasks.map((task) => (
        <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock className="h-4 w-4 text-blue-600" />
            <div>
              <p className="font-medium">{task.name}</p>
              <p className="text-sm text-muted-foreground">on {task.agent}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium">{task.nextRun}</p>
              <p className="text-xs text-muted-foreground">{task.timeUntil}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => executeTask(task.id)}
              title="Execute now"
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
