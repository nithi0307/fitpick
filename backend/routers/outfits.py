"""HTTP endpoints for outfits."""

from fastapi import APIRouter, HTTPException

from repositories.outfit_repository import OutfitRepository
from schemas import Outfit, OutfitCreate

router = APIRouter(prefix="/outfits", tags=["outfits"])
repository = OutfitRepository()


@router.get("", response_model=list[Outfit])
def list_outfits():
    return repository.list()


@router.post("", response_model=Outfit, status_code=201)
def create_outfit(data: OutfitCreate):
    return repository.add(data)


@router.post("/{outfit_id}/favourite", response_model=Outfit)
def toggle_favourite(outfit_id: int):
    outfit = repository.toggle_favourite(outfit_id)
    if outfit is None:
        raise HTTPException(status_code=404, detail="Outfit not found")
    return outfit
