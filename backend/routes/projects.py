from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from database import get_db
from models.project import Project
from models.scene import Scene
from models.connection import Connection
import uuid

router = APIRouter()

class ProjectCreate(BaseModel):
    user_id: str
    title: str

class ProjectUpdate(BaseModel):
    title: str

class ProjectResponse(BaseModel):
    id: str
    user_id: str
    title: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

class ProjectFullResponse(ProjectResponse):
    scenes: List[dict]
    connections: List[dict]

@router.get("/", response_model=List[ProjectResponse])
def get_projects(user_id: str, db: Session = Depends(get_db)):
    """Get all projects for a user"""
    projects = db.query(Project).filter(Project.user_id == user_id).all()
    return projects

@router.get("/{project_id}/full", response_model=ProjectFullResponse)
def get_project_full(project_id: str, db: Session = Depends(get_db)):
    """Get project with all scenes and connections"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    scenes = db.query(Scene).filter(Scene.project_id == project_id).all()
    connections = db.query(Connection).filter(Connection.project_id == project_id).all()
    
    return {
        **project.__dict__,
        "scenes": [scene.__dict__ for scene in scenes],
        "connections": [conn.__dict__ for conn in connections]
    }

@router.post("/", response_model=ProjectResponse)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    """Create a new project"""
    db_project = Project(
        id=str(uuid.uuid4()),
        user_id=project.user_id,
        title=project.title
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(project_id: str, project: ProjectUpdate, db: Session = Depends(get_db)):
    """Update a project"""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db_project.title = project.title
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db)):
    """Delete a project"""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted successfully"}

