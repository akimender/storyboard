import boto3
import os
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv()

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION", "us-east-1")
)

BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "storyboard-images")

def upload_image_to_s3(image_data: bytes, filename: str, content_type: str = "image/png") -> str:
    """Upload image to S3 and return public URL"""
    try:
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=filename,
            Body=image_data,
            ContentType=content_type,
            ACL='public-read'
        )
        # Return public URL
        return f"https://{BUCKET_NAME}.s3.{os.getenv('AWS_REGION', 'us-east-1')}.amazonaws.com/{filename}"
    except ClientError as e:
        raise Exception(f"Failed to upload image to S3: {str(e)}")

