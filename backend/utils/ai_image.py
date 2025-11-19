import openai
import os
import requests
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
STABILITY_API_KEY = os.getenv("STABILITY_API_KEY")

def generate_image_with_openai(prompt: str) -> str:
    """Generate image using OpenAI DALL-E API"""
    try:
        if not OPENAI_API_KEY:
            raise Exception("OPENAI_API_KEY not set")
        
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        return response.data[0].url
    except Exception as e:
        raise Exception(f"Failed to generate image: {str(e)}")

def generate_image_with_stability(prompt: str) -> str:
    """Generate image using Stability AI API (free tier available)"""
    try:
        api_key = STABILITY_API_KEY
        if not api_key:
            raise Exception("STABILITY_API_KEY not set")
        
        response = requests.post(
            "https://api.stability.ai/v2beta/stable-image/generate/core",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Accept": "image/*"
            },
            files={"none": ""},
            data={
                "prompt": prompt,
                "output_format": "png",
                "aspect_ratio": "1:1"
            }
        )
        
        if response.status_code != 200:
            raise Exception(f"Stability API error: {response.status_code} - {response.text}")
        
        # Save to temporary location or return as data URL
        # For now, we'll need to upload it somewhere or return base64
        # This is a simplified version - you may need to adjust based on Stability API response
        raise Exception("Stability AI integration needs completion - use OpenAI for now")
    except Exception as e:
        raise Exception(f"Failed to generate image with Stability AI: {str(e)}")

def generate_image(prompt: str) -> str:
    """Generate image using available service (OpenAI or Stability AI)"""
    # Try OpenAI first if key is available
    if OPENAI_API_KEY:
        try:
            return generate_image_with_openai(prompt)
        except Exception as e:
            print(f"OpenAI failed: {e}")
    
    # Fallback to Stability AI if configured
    if STABILITY_API_KEY:
        try:
            return generate_image_with_stability(prompt)
        except Exception as e:
            print(f"Stability AI failed: {e}")
    
    raise Exception("No image generation service configured. Set OPENAI_API_KEY or STABILITY_API_KEY")

def download_image(url: str) -> bytes:
    """Download image from URL and return as bytes"""
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.content
    except Exception as e:
        raise Exception(f"Failed to download image: {str(e)}")

