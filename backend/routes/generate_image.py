from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.ai_image import generate_image_with_openai, download_image
from utils.s3 import upload_image_to_s3
import uuid

router = APIRouter()

class GenerateImageRequest(BaseModel):
    prompt: str
    project_id: str

class GenerateImageResponse(BaseModel):
    image_url: str

@router.post("/", response_model=GenerateImageResponse)
def generate_image(request: GenerateImageRequest):
    """Generate an image using AI and upload to S3"""
    try:
        # Generate image using OpenAI
        image_url = generate_image_with_openai(request.prompt)
        
        # Download the image
        image_data = download_image(image_url)
        
        # Upload to S3
        filename = f"{request.project_id}/{uuid.uuid4()}.png"
        s3_url = upload_image_to_s3(image_data, filename, "image/png")
        
        return GenerateImageResponse(image_url=s3_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

