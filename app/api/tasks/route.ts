import { type NextRequest, NextResponse } from "next/server"
import { taskQueries, agentQueries } from "@/lib/database"
import { randomUUID } from "crypto"

export async function GET() {
  try {
    const tasks = await taskQueries.getAll()
    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Failed to fetch tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      agent_id,
      script_name,
      script_content,
      parameters,
      schedule,
      active = true,
    } = await request.json()

    if (!name || !agent_id || !script_name) {
      return NextResponse.json({ error: "Name, agent_id, and script_name are required" }, { status: 400 })
    }

    // Verify agent exists
    const agent = await agentQueries.getById(agent_id)
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Create new task
    const taskId = randomUUID()
    await taskQueries.create(
      taskId,
      name,
      description || "",
      agent_id,
      script_name,
      script_content || "",
      parameters ? JSON.stringify(parameters) : "",
      schedule || "",
      active,
    )

    const newTask = await taskQueries.getById(taskId)
    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error("Failed to create task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
