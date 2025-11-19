# Storyboard Studio

A full-stack web application for creating storyboards with AI-generated images. Built with React, FastAPI, PostgreSQL, and AWS S3.

## Features

- 🎨 **AI Image Generation**: Generate images from text descriptions using OpenAI DALL-E
- 🖼️ **Interactive Canvas**: Drag and drop scenes on an infinite canvas using React Konva
- 🔗 **Scene Connections**: Visually connect scenes with arrows to show story flow
- 💾 **Auto-save**: Automatic saving of scene positions and edits
- 📤 **Export**: Export storyboards as PNG or PDF
- 🐳 **Docker Support**: Full Docker setup for easy deployment

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Konva** - Canvas rendering
- **React Router** - Routing
- **Axios** - HTTP client
- **html2canvas & jsPDF** - Export tools

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy** - ORM
- **PostgreSQL** - Database
- **AWS S3** - Image storage
- **OpenAI API** - AI image generation
- **Uvicorn** - ASGI server

## Project Structure

```
storyboard/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── api/           # API client
│   │   └── store/         # Zustand store
│   └── Dockerfile
├── backend/               # FastAPI backend
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── database/          # Database setup
│   ├── utils/             # Utilities
│   └── Dockerfile
├── docker-compose.yml     # Docker orchestration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose (optional)
- PostgreSQL (if not using Docker)
- AWS account with S3 bucket
- OpenAI API key

### Option 1: Docker Setup (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd storyboard
   ```

2. **Set up environment variables:**
   
   Create `backend/.env`:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@postgres:5432/storyboard
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=storyboard-images
   OPENAI_API_KEY=sk-your_openai_api_key
   ```
   
   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

3. **Start services:**
   ```bash
   docker-compose up --build
   ```

4. **Initialize database:**
   ```bash
   docker-compose exec backend python database/init_db.py
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create `.env` file with the variables from `.env.example`

5. **Initialize database:**
   ```bash
   python database/init_db.py
   ```

6. **Run the server:**
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173

## AWS S3 Setup

1. **Create an S3 bucket:**
   - Go to AWS S3 Console
   - Create a bucket named `storyboard-images` (or your preferred name)
   - Make it public or configure CORS

2. **Set up IAM user:**
   - Create an IAM user with S3 access
   - Generate access keys
   - Add keys to `backend/.env`

3. **Configure CORS (if needed):**
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

## Database Schema

- **users**: User accounts
- **projects**: Storyboard projects
- **scenes**: Individual scenes with images and positions
- **connections**: Links between scenes

## API Endpoints

### Projects
- `GET /api/projects/?user_id={id}` - Get all projects
- `GET /api/projects/{id}/full` - Get project with scenes and connections
- `POST /api/projects/` - Create project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Scenes
- `GET /api/scenes/?project_id={id}` - Get all scenes
- `GET /api/scenes/{id}` - Get scene
- `POST /api/scenes/` - Create scene
- `PATCH /api/scenes/{id}` - Update scene
- `DELETE /api/scenes/{id}` - Delete scene

### Connections
- `GET /api/connections/?project_id={id}` - Get all connections
- `POST /api/connections/` - Create connection
- `PATCH /api/connections/{id}` - Update connection
- `DELETE /api/connections/{id}` - Delete connection

### Image Generation
- `POST /api/generate_image/` - Generate AI image

## Usage

1. **Create a Project:**
   - Go to the dashboard
   - Enter a project title
   - Click "Create"

2. **Generate Scenes:**
   - Open a project
   - Enter a scene description in the left sidebar
   - Click "Generate Scene with AI"
   - Wait for image generation (10-30 seconds)

3. **Arrange Scenes:**
   - Drag scenes on the canvas to position them
   - Click on a scene to select it

4. **Connect Scenes:**
   - Click the connection button (top-right) on a scene
   - Click another scene to connect them
   - Arrows will show the connection

5. **Edit Scenes:**
   - Select a scene
   - Edit caption in the right panel
   - Regenerate image if needed

6. **Export:**
   - Click "Export PNG" or "Export PDF" in the header
   - File will download automatically

## Development

### Running Tests
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
# Use uvicorn with production settings
```

## Troubleshooting

### Database Connection Issues
- Check PostgreSQL is running
- Verify `DATABASE_URL` is correct
- Ensure database exists

### S3 Upload Issues
- Verify AWS credentials
- Check bucket exists and is accessible
- Verify CORS configuration

### OpenAI API Issues
- Check API key is valid
- Ensure you have credits
- Verify API key has DALL-E access

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

