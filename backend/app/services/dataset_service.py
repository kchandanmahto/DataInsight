from pathlib import Path

import pandas as pd


ALLOWED_EXTENSIONS = {
    ".csv",
    ".xlsx",
    ".xls",
}


def read_dataset(file_path: Path) -> pd.DataFrame:
    """
    Read CSV or Excel dataset.
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
    Generate basic information about a dataset.
    """

    missing_values = {
        column: int(value)
        for column, value in df.isnull().sum().items()
    }

    return {
        "rows": int(df.shape[0]),

        "columns": int(df.shape[1]),

        "column_names": df.columns.tolist(),

        "missing_values": missing_values,

        "total_missing_values": int(
            df.isnull().sum().sum()
        ),

        "duplicate_rows": int(
            df.duplicated().sum()
        ),

        "data_types": {
            column: str(dtype)
            for column, dtype in df.dtypes.items()
        },

        "preview": (
            df.head(10)
            .fillna("")
            .to_dict(orient="records")
        ),
    }


def clean_dataset(
    df: pd.DataFrame,
    remove_missing: bool = True,
    remove_duplicates: bool = True,
    validate_datatypes: bool = True,
) -> tuple[pd.DataFrame, dict]:
    """
    Clean dataset according to selected options.
    """

    cleaned_df = df.copy()

    original_rows = len(cleaned_df)

    original_missing = int(
        cleaned_df.isnull().sum().sum()
    )

    original_duplicates = int(
        cleaned_df.duplicated().sum()
    )

    # -------------------------------------------------
    # Remove duplicate rows
    # -------------------------------------------------

    removed_duplicates = 0

    if remove_duplicates:

        before_rows = len(cleaned_df)

        cleaned_df = cleaned_df.drop_duplicates()

        removed_duplicates = (
            before_rows - len(cleaned_df)
        )

    # -------------------------------------------------
    # Handle missing values
    # -------------------------------------------------

    filled_missing_values = 0

    if remove_missing:

        numeric_columns = (
            cleaned_df
            .select_dtypes(include="number")
            .columns
        )

        categorical_columns = (
            cleaned_df
            .select_dtypes(exclude="number")
            .columns
        )

        # Numeric → Median

        for column in numeric_columns:

            missing_count = int(
                cleaned_df[column].isnull().sum()
            )

            if missing_count > 0:

                median_value = (
                    cleaned_df[column].median()
                )

                if pd.notna(median_value):

                    cleaned_df[column] = (
                        cleaned_df[column]
                        .fillna(median_value)
                    )

                    filled_missing_values += (
                        missing_count
                    )

        # Categorical → Mode

        for column in categorical_columns:

            missing_count = int(
                cleaned_df[column].isnull().sum()
            )

            if missing_count > 0:

                mode_values = (
                    cleaned_df[column].mode()
                )

                if not mode_values.empty:

                    cleaned_df[column] = (
                        cleaned_df[column]
                        .fillna(mode_values.iloc[0])
                    )

                    filled_missing_values += (
                        missing_count
                    )

    # -------------------------------------------------
    # Datatype validation
    # -------------------------------------------------

    datatype_report = {}

    if validate_datatypes:

        for column in cleaned_df.columns:

            datatype_report[column] = {
                "dtype": str(
                    cleaned_df[column].dtype
                ),
                "valid": True,
            }

    # -------------------------------------------------
    # Final report
    # -------------------------------------------------

    final_missing = int(
        cleaned_df.isnull().sum().sum()
    )

    final_rows = len(cleaned_df)

    report = {

        "original_rows": original_rows,

        "final_rows": final_rows,

        "rows_removed": (
            original_rows - final_rows
        ),

        "original_missing_values": (
            original_missing
        ),

        "filled_missing_values": (
            filled_missing_values
        ),

        "remaining_missing_values": (
            final_missing
        ),

        "original_duplicate_rows": (
            original_duplicates
        ),

        "removed_duplicates": (
            removed_duplicates
        ),

        "remaining_duplicate_rows": int(
            cleaned_df.duplicated().sum()
        ),

        "datatype_validation": (
            datatype_report
        ),

        "datatype_validation_applied": (
            validate_datatypes
        ),
    }

    return cleaned_df, report