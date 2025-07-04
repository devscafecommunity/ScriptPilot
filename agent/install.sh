#!/bin/bash

echo "Installing Task Scheduler Agent..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "Error: pip3 is required but not installed."
    exit 1
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip3 install -r requirements.txt

# Make the agent executable
chmod +x agent.py

# Create systemd service file (optional)
if command -v systemctl &> /dev/null; then
    echo "Creating systemd service file..."
    
    cat > task-scheduler-agent.service << EOF
[Unit]
Description=Task Scheduler Agent
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=$(which python3) $(pwd)/agent.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    echo "To install as a system service, run:"
    echo "  sudo cp task-scheduler-agent.service /etc/systemd/system/"
    echo "  sudo systemctl enable task-scheduler-agent"
    echo "  sudo systemctl start task-scheduler-agent"
fi

echo ""
echo "Installation complete!"
echo "To start the agent manually, run:"
echo "  python3 agent.py"
echo ""
echo "The agent will be available at http://localhost:5000"
