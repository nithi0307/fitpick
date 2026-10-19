"""HTTP endpoints for outfits."""

from fastapi import APIRouter, Depends, HTTPException

from deps import current_user_id
from repositories import get_clothing_repository, get_outfit_repository
from repositories.base import ClothingRepository, OutfitRepository
from schemas import OCCASIONS, Outfit, OutfitCreate
from services import style_service

router = APIRouter(prefix="/outfits", tags=["outfits"])


def _scored(outfit: Outfit, clothing: ClothingRepository, user_id: int) -> Outfit:
    """Attach the style score, which is derived rather than stored."""
    items = [clothing.get(user_id, item_id) for item_id in outfit.item_ids]
    outfit.score, outfit.score_notes = style_service.score_outfit(
        [item for item in items if item], outfit.occasion
    )
    return outfit


@router.get("", response_model=list[Outfit])
def list_outfits(
    repository: OutfitRepository = Depends(get_outfit_repository),
    clothing: ClothingRepository = Depends(get_clothing_repository),
    user_id: int = Depends(current_user_id),
):
    return [_scored(o, clothing, user_id) for o in repository.list(user_id)]


@router.get("/occasions", response_model=list[str])
def list_occasions():
    return OCCASIONS


@router.post("", response_model=Outfit, status_code=201)
def create_outfit(
    data: OutfitCreate,
    repository: OutfitRepository = Depends(get_outfit_repository),
    clothing: ClothingRepository = Depends(get_clothing_repository),
    user_id: int = Depends(current_user_id),
):
    if not data.item_ids:
        raise HTTPException(status_code=422, detail="An outfit needs at least one item")
    for item_id in data.item_ids:
        if clothing.get(user_id, item_id) is None:
            raise HTTPException(status_code=422, detail=f"Unknown clothing item {item_id}")
    return _scored(repository.add(user_id, data), clothing, user_id)


@router.post("/{outfit_id}/favourite", response_model=Outfit)
def toggle_favourite(
    outfit_id: int,
    repository: OutfitRepository = Depends(get_outfit_repository),
    clothing: ClothingRepository = Depends(get_clothing_repository),
    user_id: int = Depends(current_user_id),
):
    outfit = repository.toggle_favourite(user_id, outfit_id)
    if outfit is None:
        raise HTTPException(status_code=404, detail="Outfit not found")
    return _scored(outfit, clothing, user_id)


@router.delete("/{outfit_id}", status_code=204)
def delete_outfit(
    outfit_id: int,
    repository: OutfitRepository = Depends(get_outfit_repository),
    user_id: int = Depends(current_user_id),
):
    if not repository.delete(user_id, outfit_id):
        raise HTTPException(status_code=404, detail="Outfit not found")
