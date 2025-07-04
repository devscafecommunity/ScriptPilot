import { type NextRequest, NextResponse } from "next/server"
import { agentQueries } from "@/lib/database"
import { AgentClient } from "@/lib/agent-client"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const agent = agentQueries.getById.get(params.id)

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    const client = new AgentClient(agent.ip, agent.port)
    const isOnline = await client.ping()

    // Update agent status
    agentQueries.updateStatus.run(isOnline ? "online" : "offline", agent.id)

    return NextResponse.json({
      online: isOnline,
      status: isOnline ? "online" : "offline",
    })
  } catch (error) {
    console.error("Failed to ping agent:", error)
    return NextResponse.json({ error: "Failed to ping agent" }, { status: 500 })
  }
}
