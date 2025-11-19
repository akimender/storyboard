# Running Frontend Only (No Backend Required)

You can run and test the frontend without setting up the backend, AWS credentials, or database!

## Quick Start

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Create `.env` file with mock mode enabled:**
   ```env
   VITE_USE_MOCK=true
   ```
   
   Or simply leave `VITE_API_URL` empty:
   ```env
   VITE_API_URL=
   ```

4. **Start the dev server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   - Frontend: http://localhost:5173

## What Works in Mock Mode

✅ **All UI features work:**
- Create, edit, and delete projects
- Create scenes with descriptions
- Drag and arrange scenes on canvas
- Connect scenes with arrows
- Edit scene captions
- Export as PNG or PDF

⚠️ **Limitations:**
- AI image generation uses placeholder images (not real AI)
- Data is stored in browser localStorage (cleared if you clear browser data)
- No real image uploads to S3

## How It Works

The app automatically detects if the backend is unavailable and switches to "mock mode" which:
- Uses `localStorage` to persist data in your browser
- Simulates API calls with delays
- Uses placeholder images instead of AI-generated ones
- All data is stored locally in your browser

## Switching Between Modes

**Mock Mode (No Backend):**
```env
VITE_USE_MOCK=true
```

**Real Backend Mode:**
```env
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK=false
```

**Auto-detect (tries backend, falls back to mock):**
```env
VITE_API_URL=http://localhost:8000
# Don't set VITE_USE_MOCK, or set it to false
```

## Testing the UI

You can fully test all UI features:
1. Create projects
2. Add scenes (will use placeholder images)
3. Drag scenes around
4. Connect scenes
5. Edit captions
6. Export storyboards

All data persists in your browser's localStorage until you clear it.

