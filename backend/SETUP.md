# Backend Setup Guide

This guide will help you set up the FastAPI backend for Storyboard Studio.

## Prerequisites

- Python 3.11 or higher
- PostgreSQL (local or remote)
- AWS account (for S3 image storage)
- OpenAI API key (for AI image generation)

## Step 1: Set Up Python Environment

### Option A: Using Existing Virtual Environment

If you already have a `venv` folder:

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Option B: Create New Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

## Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

## Step 3: Set Up Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/storyboard

# AWS S3 (for image storage)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=storyboard-images

# OpenAI (for AI image generation)
OPENAI_API_KEY=sk-your_openai_api_key
```

### Getting Your Credentials:

**PostgreSQL:**
- Local: Use `postgresql://postgres:postgres@localhost:5432/storyboard` (default)
- Remote: Get connection string from your database provider

**AWS S3:**
1. Go to AWS Console → IAM
2. Create a user with S3 access
3. Generate access keys
4. Create an S3 bucket named `storyboard-images` (or your preferred name)
5. Make bucket public or configure CORS

**OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it to `OPENAI_API_KEY`

## Step 4: Set Up PostgreSQL Database

### Option A: Local PostgreSQL

1. **Install PostgreSQL** (if not already installed):
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql`
   - Windows: Download from postgresql.org

2. **Start PostgreSQL:**
   ```bash
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

3. **Create Database:**
   ```bash
   createdb storyboard
   # Or using psql:
   psql -U postgres
   CREATE DATABASE storyboard;
   \q
   ```

### Option B: Using Docker

```bash
docker run --name storyboard-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=storyboard \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Option C: Using Supabase or Other Cloud Provider

1. Create a new project
2. Get the connection string
3. Update `DATABASE_URL` in `.env`

## Step 5: Initialize Database

Run the database initialization script:

```bash
python database/init_db.py
```

This will create all the necessary tables (users, projects, scenes, connections).

## Step 6: Set Up AWS S3 Bucket

1. **Create S3 Bucket:**
   - Go to AWS S3 Console
   - Click "Create bucket"
   - Name: `storyboard-images` (or match your `S3_BUCKET_NAME`)
   - Region: Match your `AWS_REGION`
   - Uncheck "Block all public access" (or configure bucket policy)

2. **Configure CORS** (if needed):
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

3. **Set Bucket Policy** (for public read access):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::storyboard-images/*"
       }
     ]
   }
   ```

## Step 7: Run the Server

### Development Mode (with auto-reload):

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## Step 8: Verify Setup

1. **Check Health Endpoint:**
   ```bash
   curl http://localhost:8000/health
   ```
   Should return: `{"status":"healthy"}`

2. **Check API Docs:**
   Open http://localhost:8000/docs in your browser

3. **Test Database Connection:**
   The server should start without database connection errors

## Troubleshooting

### Database Connection Error

**Error:** `could not connect to server`

**Solutions:**
- Check PostgreSQL is running: `pg_isready`
- Verify `DATABASE_URL` is correct
- Check database exists: `psql -l | grep storyboard`
- Try: `psql -U postgres -d storyboard` to test connection

### AWS S3 Error

**Error:** `Failed to upload image to S3`

**Solutions:**
- Verify AWS credentials are correct
- Check bucket name matches `S3_BUCKET_NAME`
- Verify bucket exists and is accessible
- Check IAM user has S3 permissions

### OpenAI API Error

**Error:** `Failed to generate image`

**Solutions:**
- Verify API key is correct
- Check you have credits in OpenAI account
- Verify API key has DALL-E access
- Check rate limits

### Import Errors

**Error:** `ModuleNotFoundError`

**Solutions:**
- Make sure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`
- Check Python version: `python --version` (should be 3.11+)

## Quick Start (Minimal Setup)

For quick testing without AWS/OpenAI:

1. **Create `.env` with minimal config:**
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/storyboard
   AWS_ACCESS_KEY_ID=placeholder
   AWS_SECRET_ACCESS_KEY=placeholder
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=placeholder
   OPENAI_API_KEY=placeholder
   ```

2. **Run server:**
   ```bash
   uvicorn main:app --reload
   ```

   Note: Image generation and S3 uploads will fail, but other endpoints will work.

## Next Steps

Once the backend is running:

1. Update frontend `.env` to point to backend:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_USE_MOCK=false
   ```

2. Test the full stack:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000

## Using Docker (Alternative)

See the main `README.md` for Docker setup instructions using `docker-compose`.

