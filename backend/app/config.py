from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DATASETS_DIR = BASE_DIR / "datasets"

DATASETS_DIR.mkdir(parents=True, exist_ok=True)