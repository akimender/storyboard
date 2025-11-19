from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import projects, scenes, connections, generate_image
import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(title="Storyboard API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(scenes.router, prefix="/api/scenes", tags=["scenes"])
app.include_router(connections.router, prefix="/api/connections", tags=["connections"])
app.include_router(generate_image.router, prefix="/api/generate_image", tags=["generate_image"])

@app.get("/")
def read_root():
    return {"message": "Storyboard API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

