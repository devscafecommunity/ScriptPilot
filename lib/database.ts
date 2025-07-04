import sqlite3 from "sqlite3"
import path from "path"

const dbPath = path.join(process.cwd(), "data", "scheduler.db")

// Create a connection pool
class DatabasePool {
  private static instance: DatabasePool
  private db: sqlite3.Database

  private constructor() {
    this.db = new sqlite3.Database(dbPath)
    this.db.run("PRAGMA foreign_keys = ON")
  }

  public static getInstance(): DatabasePool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool()
    }
    return DatabasePool.instance
  }

  public getDatabase(): sqlite3.Database {
    return this.db
  }

  // Promisify database methods
  public all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })
  }

  public get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })
  }

  public run(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err)
        else resolve({ lastID: this.lastID, changes: this.changes })
      })
    })
  }
}

const db = DatabasePool.getInstance()

// Agent operations
export const agentQueries = {
  async getAll() {
    return await db.all("SELECT * FROM agents ORDER BY hostname")
  },

  async getById(id: string) {
    return await db.get("SELECT * FROM agents WHERE id = ?", [id])
  },

  async getByIp(ip: string) {
    return await db.get("SELECT * FROM agents WHERE ip = ?", [ip])
  },

  async create(
    id: string,
    hostname: string,
    ip: string,
    port: number,
    os: string,
    arch: string,
    cpu: string,
    ram: string,
    status: string,
  ) {
    return await db.run(
      `
      INSERT INTO agents (id, hostname, ip, port, os, arch, cpu, ram, status, last_seen)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `,
      [id, hostname, ip, port, os, arch, cpu, ram, status],
    )
  },

  async updateStatus(status: string, id: string) {
    return await db.run(
      `
      UPDATE agents 
      SET status = ?, last_seen = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [status, id],
    )
  },

  async delete(id: string) {
    return await db.run("DELETE FROM agents WHERE id = ?", [id])
  },
}

// Task operations
export const taskQueries = {
  async getAll() {
    return await db.all(`
      SELECT t.*, a.hostname as agent_hostname, a.ip as agent_ip 
      FROM tasks t 
      JOIN agents a ON t.agent_id = a.id 
      ORDER BY t.created_at DESC
    `)
  },

  async getById(id: string) {
    return await db.get("SELECT * FROM tasks WHERE id = ?", [id])
  },

  async create(
    id: string,
    name: string,
    description: string,
    agent_id: string,
    script_name: string,
    script_content: string,
    parameters: string,
    schedule: string,
    active: boolean,
  ) {
    return await db.run(
      `
      INSERT INTO tasks (id, name, description, agent_id, script_name, script_content, parameters, schedule, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [id, name, description, agent_id, script_name, script_content, parameters, schedule, active],
    )
  },

  async delete(id: string) {
    return await db.run("DELETE FROM tasks WHERE id = ?", [id])
  },
}

// Execution operations
export const executionQueries = {
  async getAll() {
    return await db.all(`
      SELECT e.*, t.name as task_name, a.hostname as agent_hostname 
      FROM task_executions e 
      JOIN tasks t ON e.task_id = t.id 
      JOIN agents a ON e.agent_id = a.id 
      ORDER BY e.started_at DESC 
      LIMIT 100
    `)
  },

  async getByTaskId(taskId: string) {
    return await db.all(`
      SELECT e.*, t.name as task_name, a.hostname as agent_hostname 
      FROM task_executions e 
      JOIN tasks t ON e.task_id = t.id 
      JOIN agents a ON e.agent_id = a.id 
      WHERE e.task_id = ?
      ORDER BY e.started_at DESC
    `, [taskId])
  },

  async create(id: string, task_id: string, agent_id: string, status: string) {
    return await db.run(
      `
      INSERT INTO task_executions (id, task_id, agent_id, status, started_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `,
      [id, task_id, agent_id, status],
    )
  },

  async updateFinished(status: string, output: string, error_message: string, duration: number, id: string) {
    return await db.run(
      `
      UPDATE task_executions 
      SET status = ?, output = ?, error_message = ?, finished_at = CURRENT_TIMESTAMP, duration = ?
      WHERE id = ?
    `,
      [status, output, error_message, duration, id],
    )
  },
}

// Script operations
export const scriptQueries = {
  async getAll() {
    return await db.all("SELECT * FROM scripts ORDER BY name")
  },

  async getById(id: string) {
    return await db.get("SELECT * FROM scripts WHERE id = ?", [id])
  },

  async getByName(name: string) {
    return await db.get("SELECT * FROM scripts WHERE name = ?", [name])
  },

  async create(id: string, name: string, description: string, content: string, type: string, parameters: string) {
    return await db.run(
      `
      INSERT INTO scripts (id, name, description, content, type, parameters)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [id, name, description, content, type, parameters],
    )
  },
}

export default db
