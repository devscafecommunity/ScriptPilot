import { type NextRequest, NextResponse } from "next/server"
import { executionQueries } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get("task_id")

    let executions
    if (taskId) {
      executions = await executionQueries.getByTaskId(taskId)
    } else {
      executions = await executionQueries.getAll()
    }

    return NextResponse.json(executions)
  } catch (error) {
    console.error("Failed to fetch executions:", error)
    return NextResponse.json({ error: "Failed to fetch executions" }, { status: 500 })
  }
}
