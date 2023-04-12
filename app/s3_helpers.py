import boto3
import botocore
import os
import uuid


s3 = boto3.client(
   "s3",
   aws_access_key_id=os.environ.get("ACCESS_KEY"),
   aws_secret_access_key=os.environ.get("SECRET_ACCESS_KEY")
)

IMAGE_EXTENSIONS = {
                    "jpg",
                    "jpeg",
                    "png",
                    "gif"
}

def image_file(filename):
    return "." in filename and \
           filename.rsplit(".", 1)[1].lower() in IMAGE_EXTENSIONS

def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{filename.rsplit('.', 1)[0]}-{unique_filename}.{ext}"

S3_BUCKET = os.environ.get("S3_BUCKET")

S3_FILES_LOCATION = f"https://{S3_BUCKET}.s3.amazonaws.com/"

def upload_image_file_to_s3(file, acl="public-read"):
    try:
        s3.upload_fileobj(
            file,
            S3_BUCKET,
            file.filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )
    except Exception as e:
        # in the case that our s3 upload fails
        return { "errors": str(e) }

    return { "url": f"{S3_FILES_LOCATION}{file.filename}" }

def remove_file_from_s3(key):
    try:
        s3.delete_object(
        Bucket=S3_BUCKET,
        Key=key
        )
    except Exception as e:
        return { "errors": str(e) }