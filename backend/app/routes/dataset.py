from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config import DATASETS_DIR
from app.services.dataset_service import (
    ALLOWED_EXTENSIONS,
    get_dataset_info,
    read_dataset,
)


router = APIRouter(
    prefix="/api/dataset",
    tags=["Dataset"],
)


@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    """
    Upload and analyze a CSV or Excel dataset.
    """

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected."
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only CSV and Excel files are supported."
        )

    unique_name = f"{uuid4().hex}{extension}"
    file_path = DATASETS_DIR / unique_name

    try:
        file_content = await file.read()

        with open(file_path, "wb") as buffer:
            buffer.write(file_content)

        df = read_dataset(file_path)

        info = get_dataset_info(df)

        return {
            "success": True,
            "filename": file.filename,
            "message": "Dataset uploaded successfully.",
            "data": info,
        }

    except Exception as exc:
        if file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to process dataset: {str(exc)}"
        )