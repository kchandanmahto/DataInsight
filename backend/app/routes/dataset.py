from pathlib import Path
from uuid import uuid4

import pandas as pd

from fastapi import (
    APIRouter,
    File,
    Form,
    HTTPException,
    UploadFile,
)

from app.config import DATASETS_DIR

from app.services.dataset_service import (
    ALLOWED_EXTENSIONS,
    clean_dataset,
    get_dataset_info,
    read_dataset,
)


router = APIRouter(
    prefix="/api/dataset",
    tags=["Dataset"],
)


# =========================================================
# UPLOAD DATASET
# =========================================================

@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...)
):

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No file selected.",
        )

    extension = (
        Path(file.filename)
        .suffix
        .lower()
    )

    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file format. "
                "Please upload CSV or Excel file."
            ),
        )

    try:

        # -------------------------------------------------
        # Generate unique dataset ID
        # -------------------------------------------------

        dataset_id = str(uuid4())

        safe_filename = (
            f"{dataset_id}{extension}"
        )

        file_path = (
            DATASETS_DIR / safe_filename
        )

        # -------------------------------------------------
        # Save uploaded file
        # -------------------------------------------------

        contents = await file.read()

        file_path.write_bytes(contents)

        # -------------------------------------------------
        # Read dataset
        # -------------------------------------------------

        df = read_dataset(file_path)

        # -------------------------------------------------
        # Dataset information
        # -------------------------------------------------

        dataset_info = get_dataset_info(df)

        return {

            "success": True,

            "message": (
                "Dataset uploaded successfully."
            ),

            "dataset_id": dataset_id,

            "filename": file.filename,

            "stored_filename": safe_filename,

            **dataset_info,
        }

    except pd.errors.EmptyDataError:

        raise HTTPException(
            status_code=400,
            detail="The uploaded dataset is empty.",
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Failed to process dataset: {error}"
            ),
        )


# =========================================================
# CLEAN DATASET
# =========================================================

@router.post("/clean")
async def clean_uploaded_dataset(
    dataset_id: str = Form(...),

    remove_missing: bool = Form(True),

    remove_duplicates: bool = Form(True),

    validate_datatypes: bool = Form(True),
):

    try:

        # -------------------------------------------------
        # Find original dataset
        # -------------------------------------------------

        matching_files = list(
            DATASETS_DIR.glob(
                f"{dataset_id}.*"
            )
        )

        if not matching_files:

            raise HTTPException(
                status_code=404,
                detail="Dataset not found.",
            )

        original_file = matching_files[0]

        # -------------------------------------------------
        # Read original dataset
        # -------------------------------------------------

        df = read_dataset(
            original_file
        )

        # -------------------------------------------------
        # Clean dataset
        # -------------------------------------------------

        cleaned_df, report = clean_dataset(

            df,

            remove_missing=remove_missing,

            remove_duplicates=remove_duplicates,

            validate_datatypes=validate_datatypes,
        )

        # -------------------------------------------------
        # Save cleaned dataset
        # -------------------------------------------------

        cleaned_dataset_id = str(
            uuid4()
        )

        output_filename = (
            f"{cleaned_dataset_id}_cleaned.csv"
        )

        output_path = (
            DATASETS_DIR / output_filename
        )

        cleaned_df.to_csv(
            output_path,
            index=False,
        )

        # -------------------------------------------------
        # Generate cleaned dataset info
        # -------------------------------------------------

        cleaned_info = get_dataset_info(
            cleaned_df
        )

        return {

            "success": True,

            "message": (
                "Dataset cleaned successfully."
            ),

            "dataset_id": dataset_id,

            "cleaned_dataset_id": (
                cleaned_dataset_id
            ),

            "original_filename": (
                original_file.name
            ),

            "cleaned_filename": (
                output_filename
            ),

            "download_url": (
                f"/api/dataset/download/"
                f"{cleaned_dataset_id}"
            ),

            "report": report,

            "cleaned_dataset": cleaned_info,
        }

    except HTTPException:

        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Failed to clean dataset: {error}"
            ),
        )


# =========================================================
# DOWNLOAD CLEANED DATASET
# =========================================================

@router.get(
    "/download/{cleaned_dataset_id}"
)
async def download_cleaned_dataset(
    cleaned_dataset_id: str
):

    from fastapi.responses import FileResponse

    matching_files = list(
        DATASETS_DIR.glob(
            f"{cleaned_dataset_id}_cleaned.csv"
        )
    )

    if not matching_files:

        raise HTTPException(
            status_code=404,
            detail="Cleaned dataset not found.",
        )

    file_path = matching_files[0]

    return FileResponse(
        path=file_path,
        filename="cleaned_dataset.csv",
        media_type="text/csv",
    )