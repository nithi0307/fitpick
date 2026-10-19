"""The ready-made clothing catalogue.

Browsing is read-only. Choosing a piece copies it into the signed-in
person's own wardrobe, which is how a wardrobe gets built without typing
every garment in by hand.
"""

from fastapi import APIRouter, Depends, HTTPException

import catalogue as catalogue_data
from deps import current_user_id
from repositories import get_clothing_repository
from repositories.base import ClothingRepository
from schemas import AddFromCatalogue, CatalogueItem, ClothingItem, ClothingItemCreate

router = APIRouter(prefix="/catalogue", tags=["catalogue"])


@router.get("", response_model=list[CatalogueItem])
def list_catalogue(category: str = "All"):
    entries = catalogue_data.entries()
    if category != "All":
        entries = [e for e in entries if e["category"] == category]
    return entries


@router.post("/add", response_model=ClothingItem, status_code=201)
def add_from_catalogue(
    data: AddFromCatalogue,
    repository: ClothingRepository = Depends(get_clothing_repository),
    user_id: int = Depends(current_user_id),
):
    entry = catalogue_data.find(data.catalogue_id)
    if entry is None:
        raise HTTPException(status_code=404, detail="Catalogue item not found")

    fields = {key: entry[key] for key in catalogue_data.FIELDS}
    return repository.add(user_id, ClothingItemCreate(**fields))
