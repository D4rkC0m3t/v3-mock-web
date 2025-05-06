@echo off
echo Starting the application...

REM Start the server in a new window
start cmd /k "cd server && echo Starting server on port 3001 && node index.js"

REM Wait for the server to start
timeout /t 3

REM Start the client in a new window
start cmd /k "cd client && echo Starting client development server && npm run dev"

echo Application started!
echo Server: http://localhost:3001
echo Client: Check the client window for the URL (usually http://localhost:5173)
