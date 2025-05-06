@echo off
echo Starting development environment...

REM Start the server in a new window with visible output
start "Server" cmd /k "cd server && node index.js"

REM Wait for the server to start
timeout /t 3

REM Start the client in a new window with visible output
start "Client" cmd /k "cd client && npm run dev"

echo Development environment started!
echo Server: http://localhost:3001
echo Client: Check the client window for the URL (usually http://localhost:5173)
