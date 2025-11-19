from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.ai_image import generate_image as generate_ai_image, download_image
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
        print(f"🎨 Generating image for prompt: {request.prompt[:50]}...")
        # Generate image using available service (OpenAI or Stability AI)
        openai_url = generate_ai_image(request.prompt)
        print(f"✅ Image generated: {openai_url[:80]}...")
        
        # Try to upload to S3, but fallback to OpenAI URL if it fails
        try:
            print("📥 Downloading image from OpenAI...")
            # Download the image
            image_data = download_image(openai_url)
            print(f"✅ Image downloaded ({len(image_data)} bytes)")
            
            # Upload to S3
            filename = f"{request.project_id}/{uuid.uuid4()}.png"
            print(f"☁️  Uploading to S3: {filename}")
            s3_url = upload_image_to_s3(image_data, filename, "image/png")
            
            print(f"✅ Successfully uploaded to S3: {s3_url}")
            return GenerateImageResponse(image_url=s3_url)
        except Exception as s3_error:
            # If S3 upload fails, return the OpenAI URL directly
            # This allows the app to work even without S3 configured
            print(f"⚠️  WARNING: S3 upload failed: {str(s3_error)}")
            print(f"⚠️  Using OpenAI URL directly (temporary): {openai_url}")
            import traceback
            traceback.print_exc()
            return GenerateImageResponse(image_url=openai_url)
    except Exception as e:
        print(f"❌ Error generating image: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

