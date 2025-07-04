import { type NextRequest, NextResponse } from "next/server"
import { scriptQueries } from "@/lib/database"
import { randomUUID } from "crypto"

export async function GET() {
  try {
    const scripts = await scriptQueries.getAll()
    return NextResponse.json(scripts)
  } catch (error) {
    console.error("Failed to fetch scripts:", error)
    return NextResponse.json({ error: "Failed to fetch scripts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, content, type, parameters } = await request.json()

    if (!name || !content || !type) {
      return NextResponse.json({ error: "Name, content, and type are required" }, { status: 400 })
    }

    // Check if script with same name exists
    const existingScript = await scriptQueries.getByName(name)
    if (existingScript) {
      return NextResponse.json({ error: "Script with this name already exists" }, { status: 409 })
    }

    // Create new script
    const scriptId = randomUUID()
    await scriptQueries.create(
      scriptId,
      name,
      description || "",
      content,
      type,
      parameters ? JSON.stringify(parameters) : "",
    )

    const newScript = await scriptQueries.getById(scriptId)
    return NextResponse.json(newScript, { status: 201 })
  } catch (error) {
    console.error("Failed to create script:", error)
    return NextResponse.json({ error: "Failed to create script" }, { status: 500 })
  }
}
