from pathlib import Path

import pandas as pd


ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls"}


def read_dataset(file_path: Path) -> pd.DataFrame:
    """
    Read CSV or Excel dataset and return a Pandas DataFrame.
    """

    extension = file_path.suffix.lower()

    if extension == ".csv":
        return pd.read_csv(file_path)

    if extension in {".xlsx", ".xls"}:
        return pd.read_excel(file_path)

    raise ValueError(
        "Unsupported file format. Please upload CSV or Excel file."
    )


def get_dataset_info(df: pd.DataFrame) -> dict:
    """
    Generate basic information about the dataset.
    """

    return {
        "rows": int(df.shape[0]),
        "columns": int(df.shape[1]),
        "column_names": df.columns.tolist(),
        "missing_values": {
            column: int(value)
            for column, value in df.isnull().sum().items()
        },
        "duplicate_rows": int(df.duplicated().sum()),
        "data_types": {
            column: str(dtype)
            for column, dtype in df.dtypes.items()
        },
        "preview": df.head(10).fillna("").to_dict(orient="records"),
    }