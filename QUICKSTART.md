# Quick Start Guide

## Starting the Application

### 1. Start the Backend

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

The backend will run on `http://localhost:8000`

### 2. Start the Frontend (in a new terminal)

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is taken)

## Troubleshooting

### Frontend won't start

1. **Kill existing processes:**
   ```bash
   # Find and kill any running vite/node processes
   pkill -f vite
   pkill -f "npm run dev"
   ```

2. **Clear node_modules and reinstall (if needed):**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

3. **Check for port conflicts:**
   - Vite defaults to port 5173
   - If that's taken, it will try the next available port
   - Check the terminal output for the actual URL

### Backend won't start

1. **Make sure virtual environment is activated:**
   ```bash
   cd backend
   source venv/bin/activate
   ```

2. **Check if port 8000 is already in use:**
   ```bash
   lsof -i :8000
   ```

3. **Restart the server:**
   - Stop with Ctrl+C
   - Start again with `uvicorn main:app --reload`

### Database Issues

If you need to reset the database:
```bash
cd backend
source venv/bin/activate
python database/flush_db.py
# Type "yes" when prompted
```

## Using the App

1. Open `http://localhost:5173` in your browser
2. Create a new project
3. Add scenes with AI-generated images
4. Arrange scenes on the canvas
5. Connect scenes together

## Mock Mode (Frontend Only)

If you want to run the frontend without the backend:

1. Create a `.env` file in the `frontend` directory:
   ```
   VITE_USE_MOCK=true
   ```

2. Start only the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

This will use localStorage to store data instead of the backend API.
