#!/bin/bash

# Backend Setup Script
echo "🚀 Setting up Storyboard Backend..."
echo ""

# Check Python version
echo "Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✅ Python $python_version found"

# Activate virtual environment or create one
if [ -d "venv" ]; then
    echo "✅ Virtual environment exists"
    source venv/bin/activate
else
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    echo "✅ Virtual environment created"
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt
echo "✅ Dependencies installed"

# Check for .env file
echo ""
if [ -f ".env" ]; then
    echo "✅ .env file exists"
else
    echo "⚠️  .env file not found"
    echo "Creating .env.example..."
    cat > .env.example << EOF
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/storyboard
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=storyboard-images
OPENAI_API_KEY=sk-your_openai_api_key
EOF
    echo "📝 Please create .env file with your credentials (see .env.example)"
fi

# Check database connection
echo ""
echo "Checking database connection..."
if python3 -c "from database import engine; engine.connect()" 2>/dev/null; then
    echo "✅ Database connection successful"
    echo ""
    echo "Initializing database..."
    python3 database/init_db.py
    echo "✅ Database initialized"
else
    echo "⚠️  Could not connect to database"
    echo "   Make sure PostgreSQL is running and DATABASE_URL is correct in .env"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start the server:"
echo "  source venv/bin/activate"
echo "  uvicorn main:app --reload"
echo ""
echo "API will be available at: http://localhost:8000"
echo "API docs at: http://localhost:8000/docs"

