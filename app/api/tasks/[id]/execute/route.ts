import { type NextRequest, NextResponse } from "next/server"
import { taskQueries, agentQueries, executionQueries } from "@/lib/database"
import { AgentClient } from "@/lib/agent-client"
import { randomUUID } from "crypto"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const task = await taskQueries.getById(params.id)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const agent = await agentQueries.getById(task.agent_id)
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Create execution record
    const executionId = randomUUID()
    await executionQueries.create(executionId, task.id, agent.id, "running")

    // Execute task on agent
    const client = new AgentClient(agent.ip, agent.port)
    const startTime = Date.now()

    const result = await client.executeScript({
      script_name: task.script_name,
      script_content: task.script_content || "",
      parameters: task.parameters ? JSON.parse(task.parameters) : {},
      execution_id: executionId,
    })

    const duration = Date.now() - startTime

    if (result) {
      // Update execution with result
      await executionQueries.updateFinished(
        result.status,
        result.output || "",
        result.error || "",
        duration,
        executionId,
      )

      return NextResponse.json({
        execution_id: executionId,
        status: result.status,
        output: result.output,
        error: result.error,
        duration,
      })
    } else {
      // Update execution as failed
      await executionQueries.updateFinished("failed", "", "Failed to communicate with agent", duration, executionId)

      return NextResponse.json(
        {
          execution_id: executionId,
          status: "failed",
          error: "Failed to communicate with agent",
          duration,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Failed to execute task:", error)
    return NextResponse.json({ error: "Failed to execute task" }, { status: 500 })
  }
}
