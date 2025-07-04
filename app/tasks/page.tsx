import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskTable } from "@/components/task-table"
import { CreateTaskDialog } from "@/components/create-task-dialog"

export default function TasksPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Create and manage scheduled tasks</p>
        </div>
        <div className="flex gap-2">
          <CreateTaskDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Tasks</CardTitle>
          <CardDescription>All configured tasks and their schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskTable />
        </CardContent>
      </Card>
    </div>
  )
}
