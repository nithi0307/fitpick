"""FitPick backend entry point.

Creates the FastAPI application, enables CORS for the React frontend and
plugs in one router per feature area. Adding a new feature means adding a
new router module and one `include_router` line here.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import clothing, outfits

app = FastAPI(title="FitPick API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clothing.router)
app.include_router(outfits.router)


@app.get("/")
def root():
    return {"message": "FitPick Backend Running"}
