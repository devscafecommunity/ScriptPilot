import { Button } from "@/components/ui/button"
import { Clock, Play } from "lucide-react"

const upcomingTasks = [
  {
    id: "1",
    name: "Weekly Backup",
    agent: "server-main",
    nextRun: "Tomorrow at 6:00 PM",
    timeUntil: "in 22 hours",
  },
  {
    id: "2",
    name: "System Update",
    agent: "backup-server",
    nextRun: "Monday at 2:00 AM",
    timeUntil: "in 3 days",
  },
  {
    id: "3",
    name: "Database Backup",
    agent: "server-main",
    nextRun: "Sunday at 11:00 PM",
    timeUntil: "in 2 days",
  },
]

export function UpcomingTasks() {
  return (
    <div className="space-y-3">
      {upcomingTasks.map((task) => (
        <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock className="h-4 w-4 text-blue-600" />
            <div>
              <p className="font-medium">{task.name}</p>
              <p className="text-sm text-muted-foreground">{task.agent}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm">{task.nextRun}</p>
              <p className="text-xs text-muted-foreground">{task.timeUntil}</p>
            </div>
            <Button variant="ghost" size="sm">
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
