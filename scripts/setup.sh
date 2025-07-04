#!/bin/bash

echo "Setting up Task Scheduler..."

# Create data directory for SQLite database
mkdir -p data

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Initialize database
echo "Initializing database..."
npm run db:init

echo ""
echo "Setup complete!"
echo ""
echo "To start the interface:"
echo "  npm run dev"
echo ""
echo "To set up an agent:"
echo "  cd agent"
echo "  bash install.sh"
echo "  python3 agent.py"
echo ""
echo "Then add the agent via the web interface at http://localhost:3000/agents"
