# Backend Quick Start

## Fastest Way to Get Started

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Run Setup Script

```bash
./setup.sh
```

This will:
- ✅ Check Python version
- ✅ Create/activate virtual environment
- ✅ Install all dependencies
- ✅ Check database connection
- ✅ Initialize database tables

### 3. Configure Environment Variables

Edit `.env` file with your credentials:

```env
# Database (use local PostgreSQL or cloud provider)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/storyboard

# AWS S3 (for image storage)
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=storyboard-images

# OpenAI (for AI image generation)
OPENAI_API_KEY=sk-your_key_here
```

### 4. Start the Server

```bash
source venv/bin/activate
uvicorn main:app --reload
```

The API will be running at:
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health**: http://localhost:8000/health

## Manual Setup (Alternative)

If the script doesn't work, follow these steps:

### Step 1: Activate Virtual Environment

```bash
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Create .env File

```bash
cp .env.example .env  # If .env.example exists
# Or create .env manually with the variables above
```

### Step 4: Set Up Database

**Option A: Local PostgreSQL**
```bash
createdb storyboard
```

**Option B: Docker**
```bash
docker run --name storyboard-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=storyboard \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Step 5: Initialize Database

```bash
python database/init_db.py
```

### Step 6: Start Server

```bash
uvicorn main:app --reload
```

## Testing Without Full Setup

You can test the backend without AWS/OpenAI by using placeholder values:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/storyboard
AWS_ACCESS_KEY_ID=placeholder
AWS_SECRET_ACCESS_KEY=placeholder
AWS_REGION=us-east-1
S3_BUCKET_NAME=placeholder
OPENAI_API_KEY=placeholder
```

**Note:** Image generation and S3 uploads will fail, but other API endpoints will work.

## Verify It's Working

1. **Check health endpoint:**
   ```bash
   curl http://localhost:8000/health
   ```
   Should return: `{"status":"healthy"}`

2. **Open API docs:**
   Visit http://localhost:8000/docs in your browser

3. **Test a project endpoint:**
   ```bash
   curl http://localhost:8000/api/projects/?user_id=test-user
   ```
   Should return: `[]` (empty array)

## Common Issues

**"Module not found" errors:**
- Make sure virtual environment is activated
- Run: `pip install -r requirements.txt`

**Database connection errors:**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env is correct
- Make sure database exists

**Port 8000 already in use:**
- Use a different port: `uvicorn main:app --reload --port 8001`
- Or stop the process using port 8000

For more details, see `backend/SETUP.md`

