"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AgentTable } from "@/components/agent-table"
import { AddAgentDialog } from "@/components/add-agent-dialog"
import { RefreshCw } from "lucide-react"

export default function AgentsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          <p className="text-muted-foreground">Manage and monitor your connected agents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <AddAgentDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Agents</CardTitle>
          <CardDescription>All agents registered in your network</CardDescription>
        </CardHeader>
        <CardContent>
          <AgentTable />
        </CardContent>
      </Card>
    </div>
  )
}
