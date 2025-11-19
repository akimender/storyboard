from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Scene(Base):
    __tablename__ = "scenes"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    prompt_text = Column(String, nullable=False)
    caption = Column(String)
    image_url = Column(String)
    x = Column(Float, default=0.0)
    y = Column(Float, default=0.0)
    width = Column(Float, default=300.0)
    height = Column(Float, default=200.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="scenes")
    from_connections = relationship("Connection", foreign_keys="Connection.from_scene_id", back_populates="from_scene")
    to_connections = relationship("Connection", foreign_keys="Connection.to_scene_id", back_populates="to_scene")

