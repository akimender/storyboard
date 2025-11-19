from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, field_serializer
from datetime import datetime
from database import get_db
from models.scene import Scene
import uuid

router = APIRouter()

class SceneCreate(BaseModel):
    project_id: str
    prompt_text: str
    caption: Optional[str] = None
    image_url: Optional[str] = None
    x: float = 0.0
    y: float = 0.0
    width: float = 300.0
    height: float = 200.0

class SceneUpdate(BaseModel):
    prompt_text: Optional[str] = None
    caption: Optional[str] = None
    image_url: Optional[str] = None
    x: Optional[float] = None
    y: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None

class SceneResponse(BaseModel):
    id: str
    project_id: str
    prompt_text: str
    caption: Optional[str]
    image_url: Optional[str]
    x: float
    y: float
    width: float
    height: float
    created_at: datetime

    @field_serializer('created_at')
    def serialize_datetime(self, dt: datetime, _info):
        return dt.isoformat()

    class Config:
        from_attributes = True

@router.get("/", response_model=List[SceneResponse])
def get_scenes(project_id: str, db: Session = Depends(get_db)):
    """Get all scenes for a project"""
    scenes = db.query(Scene).filter(Scene.project_id == project_id).all()
    return scenes

@router.get("/{scene_id}", response_model=SceneResponse)
def get_scene(scene_id: str, db: Session = Depends(get_db)):
    """Get a single scene"""
    scene = db.query(Scene).filter(Scene.id == scene_id).first()
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    return scene

@router.post("/", response_model=SceneResponse)
def create_scene(scene: SceneCreate, db: Session = Depends(get_db)):
    """Create a new scene"""
    db_scene = Scene(
        id=str(uuid.uuid4()),
        project_id=scene.project_id,
        prompt_text=scene.prompt_text,
        caption=scene.caption,
        image_url=scene.image_url,
        x=scene.x,
        y=scene.y,
        width=scene.width,
        height=scene.height
    )
    db.add(db_scene)
    db.commit()
    db.refresh(db_scene)
    return db_scene

@router.patch("/{scene_id}", response_model=SceneResponse)
def update_scene(scene_id: str, scene: SceneUpdate, db: Session = Depends(get_db)):
    """Update a scene"""
    db_scene = db.query(Scene).filter(Scene.id == scene_id).first()
    if not db_scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    
    update_data = scene.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_scene, key, value)
    
    db.commit()
    db.refresh(db_scene)
    return db_scene

@router.delete("/{scene_id}")
def delete_scene(scene_id: str, db: Session = Depends(get_db)):
    """Delete a scene"""
    db_scene = db.query(Scene).filter(Scene.id == scene_id).first()
    if not db_scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    
    db.delete(db_scene)
    db.commit()
    return {"message": "Scene deleted successfully"}

