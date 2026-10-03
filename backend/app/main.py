from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.dataset import router as dataset_router
from app.routes.statistics import router as statistics_router


app = FastAPI(
    title="DataInsight",
    description="Data Science Analysis & Visualization System",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(dataset_router)
app.include_router(statistics_router)


@app.get("/")
def root():
    return {
        "project": "DataInsight",
        "message": (
            "Data Science Analysis "
            "& Visualization System"
        ),
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }