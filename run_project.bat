@echo off
title LuxCar Intelligence 360 - Launcher
echo =======================================================
echo    LUXCAR INTELLIGENCE 360 - LAUNCHER
echo    AI-Powered Future Vehicle Match & Ownership Simulator
echo =======================================================
echo.

echo [1/2] Starting Python FastAPI Backend on port 8000...
start "LuxCar Backend (FastAPI)" cmd /k "cd /d %~dp0backend && .\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Next.js Luxury Frontend on port 3000...
start "LuxCar Frontend (Next.js)" cmd /k "cd /d %~dp0frontend && npm run dev -- -p 3000"

timeout /t 4 /nobreak >nul

echo Opening browser at http://localhost:3000 ...
start http://localhost:3000

echo.
echo =======================================================
echo System is Online!
echo Frontend: http://localhost:3000
echo Backend API Docs: http://127.0.0.1:8000/docs
echo =======================================================
pause
