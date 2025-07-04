interface AgentInfo {
  hostname: string
  ip: string
  os: string
  arch: string
  cpu: string
  ram: string
  status: string
}

interface ExecutionRequest {
  script_name: string
  script_content: string
  parameters: Record<string, any>
  execution_id: string
}

interface ExecutionResponse {
  execution_id: string
  status: "success" | "error"
  output?: string
  error?: string
  duration: number
}

export class AgentClient {
  private baseUrl: string

  constructor(ip: string, port = 5000) {
    this.baseUrl = `http://${ip}:${port}`
  }

  async ping(): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${this.baseUrl}/ping`, {
        method: "GET",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return response.ok
    } catch (error) {
      return false
    }
  }

  async getInfo(): Promise<AgentInfo | null> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(`${this.baseUrl}/info`, {
        method: "GET",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to get agent info from ${this.baseUrl}:`, error)
      return null
    }
  }

  async executeScript(request: ExecutionRequest): Promise<ExecutionResponse | null> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 300000) // 5 minutes

      const response = await fetch(`${this.baseUrl}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to execute script on ${this.baseUrl}:`, error)
      return null
    }
  }

  async getScripts(): Promise<string[]> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(`${this.baseUrl}/scripts`, {
        method: "GET",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to get scripts from ${this.baseUrl}:`, error)
      return []
    }
  }
}
