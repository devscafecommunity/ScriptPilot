const sqlite3 = require("sqlite3").verbose()
const path = require("path")
const fs = require("fs")

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, "scheduler.db")
const db = new sqlite3.Database(dbPath)

console.log("Initializing database...")

db.serialize(() => {
  // Enable foreign keys
  db.run("PRAGMA foreign_keys = ON")

  // Agents table
  db.run(`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      hostname TEXT NOT NULL,
      ip TEXT NOT NULL UNIQUE,
      port INTEGER DEFAULT 5000,
      status TEXT DEFAULT 'offline',
      os TEXT,
      arch TEXT,
      cpu TEXT,
      ram TEXT,
      last_seen DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Tasks table
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      agent_id TEXT NOT NULL,
      script_name TEXT NOT NULL,
      script_content TEXT,
      parameters TEXT,
      schedule TEXT,
      active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (agent_id) REFERENCES agents (id) ON DELETE CASCADE
    )
  `)

  // Task executions/logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS task_executions (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      status TEXT NOT NULL,
      output TEXT,
      error_message TEXT,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      finished_at DATETIME,
      duration INTEGER,
      FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
      FOREIGN KEY (agent_id) REFERENCES agents (id) ON DELETE CASCADE
    )
  `)

  // Scripts table
  db.run(`
    CREATE TABLE IF NOT EXISTS scripts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      content TEXT NOT NULL,
      type TEXT NOT NULL,
      parameters TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log("Database initialized successfully!")
})

db.close()
