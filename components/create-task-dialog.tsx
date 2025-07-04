"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"

interface Agent {
  id: string
  hostname: string
  ip: string
  status: string
}

interface Script {
  id: string
  name: string
  description: string
  content: string
  type: string
}

interface CreateTaskDialogProps {
  onTaskCreated?: () => void
}

export function CreateTaskDialog({ onTaskCreated }: CreateTaskDialogProps = {}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])
  const [scripts, setScripts] = useState<Script[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    agent_id: "",
    script_name: "",
    script_content: "",
    schedule: "",
    parameters: "{}",
    active: true,
  })

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/agents")
      if (response.ok) {
        const data = await response.json()
        setAgents(data.filter((agent: Agent) => agent.status === "online"))
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error)
    }
  }

  const fetchScripts = async () => {
    try {
      const response = await fetch("/api/scripts")
      if (response.ok) {
        const data = await response.json()
        setScripts(data)
      }
    } catch (error) {
      console.error("Failed to fetch scripts:", error)
    }
  }

  const handleScriptSelect = (scriptId: string) => {
    const script = scripts.find((s) => s.id === scriptId)
    if (script) {
      setFormData({
        ...formData,
        script_name: script.name,
        script_content: script.content,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let parameters = {}
      if (formData.parameters.trim()) {
        try {
          parameters = JSON.parse(formData.parameters)
        } catch {
          alert("Invalid JSON in parameters field")
          setLoading(false)
          return
        }
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          agent_id: formData.agent_id,
          script_name: formData.script_name,
          script_content: formData.script_content,
          schedule: formData.schedule || null,
          parameters,
          active: formData.active,
        }),
      })

      if (response.ok) {
        setOpen(false)
        setFormData({
          name: "",
          description: "",
          agent_id: "",
          script_name: "",
          script_content: "",
          schedule: "",
          parameters: "{}",
          active: true,
        })
        if (onTaskCreated) {
          onTaskCreated()
        } else {
          router.refresh()
        }
      } else {
        const error = await response.json()
        alert(`Failed to create task: ${error.error}`)
      }
    } catch (error) {
      alert("Failed to create task. Please check your input.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchAgents()
      fetchScripts()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Create a new scheduled task to run on your agents.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Task Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Daily Backup"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Backup user data daily"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="agent" className="text-right">
                Agent
              </Label>
              <Select
                value={formData.agent_id}
                onValueChange={(value) => setFormData({ ...formData, agent_id: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.hostname} ({agent.ip})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="script" className="text-right">
                Script
              </Label>
              <Select onValueChange={handleScriptSelect}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a script (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {scripts.map((script) => (
                    <SelectItem key={script.id} value={script.id}>
                      {script.name} ({script.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="script_name" className="text-right">
                Script Name
              </Label>
              <Input
                id="script_name"
                value={formData.script_name}
                onChange={(e) => setFormData({ ...formData, script_name: e.target.value })}
                placeholder="backup.py"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="script_content" className="text-right pt-2">
                Script Content
              </Label>
              <Textarea
                id="script_content"
                value={formData.script_content}
                onChange={(e) => setFormData({ ...formData, script_content: e.target.value })}
                placeholder="#!/usr/bin/env python3&#10;print('Hello World')"
                className="col-span-3 min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schedule" className="text-right">
                Schedule (Cron)
              </Label>
              <Input
                id="schedule"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="0 2 * * * (daily at 2 AM)"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="parameters" className="text-right pt-2">
                Parameters (JSON)
              </Label>
              <Textarea
                id="parameters"
                value={formData.parameters}
                onChange={(e) => setFormData({ ...formData, parameters: e.target.value })}
                placeholder='{"source": "/home/user", "destination": "/backup"}'
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
