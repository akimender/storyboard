import openai
import os
import requests
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_image_with_openai(prompt: str) -> str:
    """Generate image using OpenAI DALL-E API"""
    try:
        client = openai.OpenAI(api_key=openai.api_key)
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

def download_image(url: str) -> bytes:
    """Download image from URL and return as bytes"""
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.content
    except Exception as e:
        raise Exception(f"Failed to download image: {str(e)}")

