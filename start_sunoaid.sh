#!/bin/bash

echo ""
echo "================================================================"
echo "                   🏛️ SunoAid Platform Launcher"
echo "                  Civic Reporting System"
echo "================================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

echo "🚀 Starting SunoAid Platform..."
echo ""

# Run the Python launcher
python3 run_sunoaid.py

echo ""
echo "Press Enter to exit..."
read
