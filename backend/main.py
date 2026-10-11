"""FitPick backend entry point.

Creates the FastAPI application, enables CORS for the React frontend and
plugs in one router per feature area. Adding a feature means adding a router
module and one `include_router` line here.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import clothing, outfits, stats

app = FastAPI(title="FitPick API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clothing.router)
app.include_router(outfits.router)
app.include_router(stats.router)


@app.get("/")
def root():
    return {"message": "FitPick Backend Running", "version": app.version}


@app.get("/health")
def health():
    return {"status": "ok"}
