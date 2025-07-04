import { type NextRequest, NextResponse } from "next/server"
import { agentQueries } from "@/lib/database"
import { AgentClient } from "@/lib/agent-client"
import { randomUUID } from "crypto"

export async function GET() {
  try {
    const agents = await agentQueries.getAll()
    return NextResponse.json(agents)
  } catch (error) {
    console.error("Failed to fetch agents:", error)
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ip, port = 5000 } = await request.json()

    if (!ip) {
      return NextResponse.json({ error: "IP address is required" }, { status: 400 })
    }

    // Check if agent already exists
    const existingAgent = await agentQueries.getByIp(ip)
    if (existingAgent) {
      return NextResponse.json({ error: "Agent with this IP already exists" }, { status: 409 })
    }

    // Try to connect to the agent and get info
    const client = new AgentClient(ip, port)
    const agentInfo = await client.getInfo()

    if (!agentInfo) {
      return NextResponse.json({ error: "Failed to connect to agent" }, { status: 400 })
    }

    // Create new agent
    const agentId = randomUUID()
    await agentQueries.create(
      agentId,
      agentInfo.hostname,
      ip,
      port,
      agentInfo.os,
      agentInfo.arch,
      agentInfo.cpu,
      agentInfo.ram,
      "online",
    )

    const newAgent = await agentQueries.getById(agentId)
    return NextResponse.json(newAgent, { status: 201 })
  } catch (error) {
    console.error("Failed to create agent:", error)
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 })
  }
}
