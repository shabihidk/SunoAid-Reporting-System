@echo off
echo.
echo ================================================================
echo                   🏛️ SunoAid Platform Launcher
echo                  Civic Reporting System
echo ================================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

echo 🚀 Starting SunoAid Platform...
echo.

REM Run the Python launcher
python run_sunoaid.py

echo.
echo Press any key to exit...
pause >nul
