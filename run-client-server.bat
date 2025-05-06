@echo off
echo Starting VDEX Client and Server...

:: Start the server in a new window
start cmd /k "cd server && node index.js"

:: Wait a moment for the server to start
timeout /t 2 /nobreak > nul

:: Start the client in a new window
start cmd /k "cd client && npm run dev"

echo Both client and server are now running.
echo Server API is available at http://localhost:3001/api
echo Client is available at http://localhost:5173
