"""FitPick backend entry point.

Creates the FastAPI application, enables CORS for the React frontend and
plugs in one router per feature area. Adding a feature means adding a router
module and one `include_router` line here.

In a deployed build the compiled React app sits in ./static and is served by
this same process, so the site and its API share one origin.
"""

import logging
import os
import pathlib
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from routers import clothing, outfits, stats

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("fitpick")

STATIC_DIR = pathlib.Path(__file__).parent / "static"
API_PREFIXES = ("clothing", "outfits", "stats", "health", "docs", "redoc", "openapi.json")


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Prepare a hosted database on first start; a no-op in development."""
    dsn = os.environ.get("DATABASE_URL")
    if dsn and os.environ.get("RUN_DB_BOOTSTRAP", "1") == "1":
        from bootstrap import prepare_database

        try:
            prepare_database(dsn)
        except Exception:  # a failed bootstrap must not stop the API starting
            logger.exception("database bootstrap failed")
    yield


app = FastAPI(title="FitPick API", version="1.0.0", lifespan=lifespan)

allowed_origins = [
    origin.strip()
    for origin in os.environ.get(
        "ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clothing.router)
app.include_router(outfits.router)
app.include_router(stats.router)


@app.get("/health")
def health():
    return {"status": "ok"}


if STATIC_DIR.is_dir():
    # Deployed build: serve the compiled React application.
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    def serve_app(full_path: str):
        """Return the requested file, or index.html so React Router can route."""
        if full_path.split("/")[0] in API_PREFIXES:
            return FileResponse(STATIC_DIR / "index.html", status_code=404)

        candidate = STATIC_DIR / full_path
        if full_path and candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(STATIC_DIR / "index.html")

else:
    # Development and tests: no compiled frontend is present.
    @app.get("/")
    def root():
        return {"message": "FitPick Backend Running", "version": app.version}
