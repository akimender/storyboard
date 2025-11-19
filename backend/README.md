# Backend - Storyboard API

FastAPI backend for Storyboard Studio.

## Quick Start

### Option 1: Use the Run Script (Easiest)

```bash
./run.sh
```

This script will:
- ✅ Activate the virtual environment
- ✅ Check/install dependencies
- ✅ Start the server

### Option 2: Manual Start

```bash
# 1. Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Start server
uvicorn main:app --reload
```

## Important: Always Activate Virtual Environment

**The error "ModuleNotFoundError: No module named 'openai'" happens when you don't activate the virtual environment.**

Make sure you see `(venv)` in your terminal prompt before running uvicorn:

```bash
# ✅ Correct - you should see (venv) in prompt
(venv) $ uvicorn main:app --reload

# ❌ Wrong - no (venv) in prompt
$ uvicorn main:app --reload
```

## Verify Installation

Check if packages are installed:

```bash
source venv/bin/activate
pip list | grep openai
```

Should show: `openai 1.51.0`

## Troubleshooting

**"ModuleNotFoundError: No module named 'openai'"**

1. Make sure virtual environment is activated:
   ```bash
   source venv/bin/activate
   ```

2. Reinstall dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Verify installation:
   ```bash
   python -c "import openai; print('OK')"
   ```

**"Port 8000 already in use"**

Use a different port:
```bash
uvicorn main:app --reload --port 8001
```

## API Endpoints

- **Health**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs
- **Projects**: http://localhost:8000/api/projects/
- **Scenes**: http://localhost:8000/api/scenes/
- **Connections**: http://localhost:8000/api/connections/
- **Generate Image**: http://localhost:8000/api/generate_image/

For detailed setup instructions, see `SETUP.md`

