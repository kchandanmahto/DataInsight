import pandas as pd
from scipy.stats import skew, kurtosis


def calculate_descriptive_statistics(
    df: pd.DataFrame
) -> dict:

    numeric_statistics = {}

    categorical_statistics = {}


    # ==========================================
    # Numeric Columns
    # ==========================================

    numeric_columns = df.select_dtypes(
        include="number"
    ).columns


    for column in numeric_columns:

        series = df[column].dropna()


        if series.empty:
            continue


        mode_values = series.mode()


        mode_value = (
            mode_values.iloc[0]
            if not mode_values.empty
            else None
        )


        numeric_statistics[column] = {

            "count": int(series.count()),

            "mean": float(series.mean()),

            "median": float(series.median()),

            "mode": (
                float(mode_value)
                if mode_value is not None
                else None
            ),

            "variance": (
                float(series.var())
                if len(series) > 1
                else 0.0
            ),

            "std_dev": (
                float(series.std())
                if len(series) > 1
                else 0.0
            ),

            "min": float(series.min()),

            "max": float(series.max()),

            "skewness": (
                float(skew(series))
                if len(series) > 2
                else 0.0
            ),

            "kurtosis": (
                float(kurtosis(series))
                if len(series) > 3
                else 0.0
            ),
        }


    # ==========================================
    # Categorical Columns
    # ==========================================

    categorical_columns = df.select_dtypes(
        exclude="number"
    ).columns


    for column in categorical_columns:

        frequency = (
            df[column]
            .fillna("Missing")
            .value_counts()
            .to_dict()
        )


        categorical_statistics[column] = {

            str(key): int(value)

            for key, value in frequency.items()

        }


    # ==========================================
    # Final Response
    # ==========================================

    return {

        "numeric_statistics":
            numeric_statistics,

        "frequency":
            categorical_statistics,

    }