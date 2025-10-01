import os
import time
import uuid
from typing import Optional

import boto3
from botocore.client import Config
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


router = APIRouter()


class PresignRequest(BaseModel):
    filename: str
    contentType: str


class PresignResponse(BaseModel):
    uploadUrl: str
    publicUrl: str
    key: str


def _s3_client():
    region = os.getenv("AWS_REGION") or os.getenv("AWS_DEFAULT_REGION")
    if not region:
        raise HTTPException(status_code=500, detail="AWS_REGION not configured")
    session = boto3.session.Session(
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name=region,
    )
    return session.client("s3", config=Config(signature_version="s3v4")), region


@router.post("/presign", response_model=PresignResponse)
def presign(req: PresignRequest) -> PresignResponse:
    bucket = os.getenv("S3_BUCKET")
    if not bucket:
        raise HTTPException(status_code=500, detail="S3_BUCKET not configured")
    client, region = _s3_client()
    # key: images/yyyy/mm/uuid-filename
    ts = time.gmtime()
    safe_name = req.filename.replace("/", "-")
    key = f"images/{ts.tm_year:04d}/{ts.tm_mon:02d}/{uuid.uuid4().hex}-{safe_name}"

    try:
        upload_url = client.generate_presigned_url(
            "put_object",
            Params={"Bucket": bucket, "Key": key, "ContentType": req.contentType},
            ExpiresIn=3600,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to presign: {e}")

    public_base = os.getenv("S3_PUBLIC_BASE")
    if public_base:
        public_url = f"{public_base.rstrip('/')}/{key}"
    else:
        public_url = f"https://{bucket}.s3.{region}.amazonaws.com/{key}"

    return PresignResponse(uploadUrl=upload_url, publicUrl=public_url, key=key)


