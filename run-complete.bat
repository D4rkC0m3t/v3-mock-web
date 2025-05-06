@echo off
echo Starting the complete application...

REM Start the server in a new window
start "VDEX Server" cmd /k "cd server && node index.js"

REM Wait for the server to start
timeout /t 3

REM Start the client in a new window
start "VDEX Client" cmd /k "cd client && npm run dev"

echo Application started!
echo Server: http://localhost:3001
echo Client: Check the client window for the URL (usually http://localhost:5173)
echo.
echo Press any key to open the client in your browser...
pause > nul
start http://localhost:5173
