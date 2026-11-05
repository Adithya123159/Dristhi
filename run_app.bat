@echo off
echo ========================================================
echo Starting AvianAI - Bird Species Classification System
echo ========================================================

echo Starting FastAPI Backend (Port 8000)...
start "AvianAI Backend (Port 8000)" cmd /k "cd /d %~dp0 && .\.venv\Scripts\python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo Starting React Vite Frontend (Port 5173)...
start "AvianAI Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev -- --host 0.0.0.0 --port 5173"

echo.
echo ========================================================
echo Both services are starting!
echo Access the application at either:
echo   1. Main Web App (Vite):    http://localhost:5173
echo   2. Production App (FastAPI): http://localhost:8000
echo ========================================================
pause

