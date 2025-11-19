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
        # Upload to S3 (without ACL - use bucket policy for public access)
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=filename,
            Body=image_data,
            ContentType=content_type
        )
        
        # Construct public URL
        region = os.getenv('AWS_REGION', 'us-east-1')
        # URL format: https://bucket-name.s3.region.amazonaws.com/key
        public_url = f"https://{BUCKET_NAME}.s3.{region}.amazonaws.com/{filename}"
        
        print(f"✅ Successfully uploaded to S3: {public_url}")
        return public_url
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code', 'Unknown')
        error_message = e.response.get('Error', {}).get('Message', str(e))
        print(f"❌ S3 upload failed - Code: {error_code}, Message: {error_message}")
        raise Exception(f"Failed to upload image to S3: {error_code} - {error_message}")
    except Exception as e:
        print(f"❌ S3 upload error: {str(e)}")
        raise Exception(f"Failed to upload image to S3: {str(e)}")

