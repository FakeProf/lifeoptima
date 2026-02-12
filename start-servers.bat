@echo off
echo Starting LifeOptima servers...

echo Starting Backend Server on port 4000...
start "Backend Server" cmd /k "cd backend && node server.js"

echo Starting Frontend Server on port 3000...
start "Frontend Server" cmd /k "python -m http.server 3000"

echo.
echo Servers starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:4000
echo.
echo Press any key to exit...
pause

