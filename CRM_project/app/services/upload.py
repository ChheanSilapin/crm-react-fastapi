import os
import uuid
import io
import boto3
from fastapi import HTTPException, UploadFile
from PIL import Image
from app.core.config import settings

class UploadService:
    """Service for handling file uploads to AWS S3 and converting images to WebP."""
    
    ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"]

    @staticmethod
    def get_s3_client():
        """Initialize and return a boto3 S3 client using settings."""
        if not all([settings.AWS_ACCESS_KEY_ID, settings.AWS_SECRET_ACCESS_KEY, settings.S3_BUCKET_NAME]):
            raise HTTPException(
                status_code=500, 
                detail="AWS S3 credentials or bucket name are not properly configured in the environment."
            )
            
        return boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )

    @staticmethod
    def upload_image_to_s3(file: UploadFile, folder: str) -> str:
        """
        Validates the image, converts it to WebP format, uploads it to S3, 
        and returns the public URL.
        """
        if file.content_type not in UploadService.ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type. Allowed types are: {', '.join(UploadService.ALLOWED_IMAGE_TYPES)}"
            )

        try:
            # Read the image using Pillow
            image_data = file.file.read()
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if needed (e.g. for RGBA PNGs)
            if image.mode in ("RGBA", "P"):
                # WebP supports RGBA natively, but just to be safe, PIL handles WebP RGBA well
                pass
            
            # Convert image to WebP format in memory
            webp_buffer = io.BytesIO()
            image.save(webp_buffer, format="WEBP", quality=80)
            webp_buffer.seek(0)
            
            # Generate unique filename
            unique_filename = f"{folder}/{uuid.uuid4()}.webp"
            
            # Initialize S3 client
            s3_client = UploadService.get_s3_client()
            
            # Upload to S3
            s3_client.upload_fileobj(
                webp_buffer,
                settings.S3_BUCKET_NAME,
                unique_filename,
                ExtraArgs={
                    "ContentType": "image/webp"
                }
            )
            
            # Construct and return the public URL
            public_url = f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{unique_filename}"
            return public_url
            
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"An error occurred while uploading the file to S3: {str(e)}"
            )
