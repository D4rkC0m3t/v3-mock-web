@echo off
echo Starting the fixed application...

REM Start the server in a new window
start "VDEX Server" cmd /k "cd server && node index.js"

REM Wait for the server to start
timeout /t 3

echo Application started!
echo Server: http://localhost:3001
echo.
echo Press any key to open the application in your browser...
pause > nul
start http://localhost:3001
