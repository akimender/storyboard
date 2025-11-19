#!/bin/bash
# Script to start the frontend dev server

echo "Starting frontend development server..."
cd "$(dirname "$0")"

# Kill any existing vite processes on port 5173
if lsof -ti :5173 > /dev/null 2>&1; then
    echo "Killing process on port 5173..."
    lsof -ti :5173 | xargs kill -9 2>/dev/null || true
    sleep 1
fi

# Kill any other vite processes
pkill -f vite 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Wait a moment for processes to die
sleep 1

# Start the dev server
echo "Starting Vite dev server..."
npm run dev

