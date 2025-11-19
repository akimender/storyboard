from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Connection(Base):
    __tablename__ = "connections"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    from_scene_id = Column(String, ForeignKey("scenes.id"), nullable=False)
    to_scene_id = Column(String, ForeignKey("scenes.id"), nullable=False)
    label = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="connections")
    from_scene = relationship("Scene", foreign_keys=[from_scene_id], back_populates="from_connections")
    to_scene = relationship("Scene", foreign_keys=[to_scene_id], back_populates="to_connections")

