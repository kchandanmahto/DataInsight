from fastapi import APIRouter, Form, HTTPException

from app.config import DATASETS_DIR

from app.services.dataset_service import (
    read_dataset,
)

from app.analysis.statistics import (
    calculate_descriptive_statistics,
)


router = APIRouter(
    prefix="/api/statistics",
    tags=["Statistics"],
)


@router.post("/descriptive")
async def descriptive_statistics(
    dataset_id: str = Form(...)
):
    """
    Calculate descriptive statistics
    for an already uploaded dataset.
    """

    try:
        matching_files = list(
            DATASETS_DIR.glob(f"{dataset_id}.*")
        )

        if not matching_files:
            raise HTTPException(
                status_code=404,
                detail="Dataset not found."
            )

        file_path = matching_files[0]

        df = read_dataset(file_path)

        statistics = calculate_descriptive_statistics(df)

        return {
            "success": True,
            "dataset_id": dataset_id,
            "filename": file_path.name,
            "statistics": statistics,
        }

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to calculate statistics: "
                f"{str(exc)}"
            ),
        )