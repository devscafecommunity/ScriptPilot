import { type NextRequest, NextResponse } from "next/server"
import { taskQueries } from "@/lib/database"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const task = await taskQueries.getById(params.id)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    await taskQueries.delete(params.id)
    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Failed to delete task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
