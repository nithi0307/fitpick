"""HTTP endpoints for outfits."""

from fastapi import APIRouter, Depends, HTTPException

from repositories import get_clothing_repository, get_outfit_repository
from repositories.base import ClothingRepository, OutfitRepository
from schemas import OCCASIONS, Outfit, OutfitCreate

router = APIRouter(prefix="/outfits", tags=["outfits"])


@router.get("", response_model=list[Outfit])
def list_outfits(repository: OutfitRepository = Depends(get_outfit_repository)):
    return repository.list()


@router.get("/occasions", response_model=list[str])
def list_occasions():
    return OCCASIONS


@router.post("", response_model=Outfit, status_code=201)
def create_outfit(
    data: OutfitCreate,
    repository: OutfitRepository = Depends(get_outfit_repository),
    clothing: ClothingRepository = Depends(get_clothing_repository),
):
    if not data.item_ids:
        raise HTTPException(status_code=422, detail="An outfit needs at least one item")
    for item_id in data.item_ids:
        if clothing.get(item_id) is None:
            raise HTTPException(status_code=422, detail=f"Unknown clothing item {item_id}")
    return repository.add(data)


@router.post("/{outfit_id}/favourite", response_model=Outfit)
def toggle_favourite(outfit_id: int, repository: OutfitRepository = Depends(get_outfit_repository)):
    outfit = repository.toggle_favourite(outfit_id)
    if outfit is None:
        raise HTTPException(status_code=404, detail="Outfit not found")
    return outfit


@router.delete("/{outfit_id}", status_code=204)
def delete_outfit(outfit_id: int, repository: OutfitRepository = Depends(get_outfit_repository)):
    if not repository.delete(outfit_id):
        raise HTTPException(status_code=404, detail="Outfit not found")
