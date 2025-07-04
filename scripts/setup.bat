@echo off
echo Setting up Task Scheduler...

REM Create data directory for SQLite database
if not exist "data" mkdir data

REM Install Node.js dependencies
echo Installing Node.js dependencies...
npm install

REM Initialize database
echo Initializing database...
npm run db:init

echo.
echo Setup complete!
echo.
echo To start the interface:
echo   npm run dev
echo.
echo To set up an agent:
echo   cd agent
echo   python agent.py
echo.
echo Then add the agent via the web interface at http://localhost:3000/agents
