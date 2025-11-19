# Quick Start Guide

## Prerequisites

- Docker and Docker Compose installed
- AWS account with S3 bucket
- OpenAI API key

## 1. Clone and Setup

```bash
cd storyboard
```

## 2. Configure Environment

### Backend (.env)
Create `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/storyboard
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=storyboard-images
OPENAI_API_KEY=sk-your_key
```

### Frontend (.env)
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

## 3. Start with Docker

```bash
docker-compose up --build
```

## 4. Initialize Database

In a new terminal:
```bash
docker-compose exec backend python database/init_db.py
```

## 5. Access the App

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 6. Create Your First Project

1. Go to http://localhost:5173
2. Enter a project title
3. Click "Create"
4. Open the project
5. Enter a scene description
6. Click "Generate Scene with AI"

## Troubleshooting

**Port already in use?**
- Change ports in `docker-compose.yml`

**Database connection error?**
- Wait for PostgreSQL to fully start
- Check DATABASE_URL in backend/.env

**S3 upload fails?**
- Verify AWS credentials
- Check bucket exists and is accessible
- Verify bucket name matches S3_BUCKET_NAME

**OpenAI API error?**
- Check API key is valid
- Ensure you have credits
- Verify key has DALL-E access

