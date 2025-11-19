#!/bin/bash

# Script to run the backend server with proper virtual environment

cd "$(dirname "$0")"

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "❌ Virtual environment not found. Please run: python3 -m venv venv"
    exit 1
fi

# Check if openai is installed
python -c "import openai" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  OpenAI not found. Installing dependencies..."
    pip install -r requirements.txt
fi

# Run the server
echo "🚀 Starting FastAPI server..."
echo "📍 API: http://localhost:8000"
echo "📍 Docs: http://localhost:8000/docs"
echo ""
uvicorn main:app --reload --host 0.0.0.0 --port 8000

