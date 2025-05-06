@echo off
echo Starting the application...

REM Start the server
cd server
start cmd /k "echo Starting server on port 3001 && node index.js"

REM Wait for the server to start
timeout /t 3

REM Start the client
cd ..\client
start cmd /k "echo Building client for production... && npm run build"

echo Application started!
echo Server: http://localhost:3001
echo Client: http://localhost:3001
