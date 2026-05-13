from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import detect_router
from utils.processing import load_model


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context.

    Loads the YOLO model once at startup and attaches it to app.state so that
    each request can reuse the same instance instead of reloading it.
    """
    app.state.yolo_model = load_model()
    yield
    # At shutdown, you could free GPU resources or close streams if needed.


app = FastAPI(
    title="On-Road Obstacle Detection & Avoidance System API",
    version="1.0.0",
    description=(
        "FastAPI backend for running YOLO-based obstacle detection on road images. "
        "Designed to work with the React dashboard frontend."
    ),
    lifespan=lifespan,
)

# Allow the React dev server and other origins to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For college demos; restrict in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes.
app.include_router(detect_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

