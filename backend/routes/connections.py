from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, field_serializer
from datetime import datetime
from database import get_db
from models.connection import Connection
import uuid

router = APIRouter()

class ConnectionCreate(BaseModel):
    project_id: str
    from_scene_id: str
    to_scene_id: str
    label: Optional[str] = None

class ConnectionUpdate(BaseModel):
    label: Optional[str] = None

class ConnectionResponse(BaseModel):
    id: str
    project_id: str
    from_scene_id: str
    to_scene_id: str
    label: Optional[str]
    created_at: datetime

    @field_serializer('created_at')
    def serialize_datetime(self, dt: datetime, _info):
        return dt.isoformat()

    class Config:
        from_attributes = True

@router.get("/", response_model=List[ConnectionResponse])
def get_connections(project_id: str, db: Session = Depends(get_db)):
    """Get all connections for a project"""
    connections = db.query(Connection).filter(Connection.project_id == project_id).all()
    return connections

@router.post("/", response_model=ConnectionResponse)
def create_connection(connection: ConnectionCreate, db: Session = Depends(get_db)):
    """Create a new connection"""
    if connection.from_scene_id == connection.to_scene_id:
        raise HTTPException(status_code=400, detail="Cannot connect scene to itself")
    
    db_connection = Connection(
        id=str(uuid.uuid4()),
        project_id=connection.project_id,
        from_scene_id=connection.from_scene_id,
        to_scene_id=connection.to_scene_id,
        label=connection.label
    )
    db.add(db_connection)
    db.commit()
    db.refresh(db_connection)
    return db_connection

@router.patch("/{connection_id}", response_model=ConnectionResponse)
def update_connection(connection_id: str, connection: ConnectionUpdate, db: Session = Depends(get_db)):
    """Update a connection"""
    db_connection = db.query(Connection).filter(Connection.id == connection_id).first()
    if not db_connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    if connection.label is not None:
        db_connection.label = connection.label
    
    db.commit()
    db.refresh(db_connection)
    return db_connection

@router.delete("/{connection_id}")
def delete_connection(connection_id: str, db: Session = Depends(get_db)):
    """Delete a connection"""
    db_connection = db.query(Connection).filter(Connection.id == connection_id).first()
    if not db_connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    db.delete(db_connection)
    db.commit()
    return {"message": "Connection deleted successfully"}

