"""HTTP endpoints for clothing items.

Translates HTTP requests into repository calls and repository results into
HTTP responses. It holds no storage logic and no calculations.
"""

from fastapi import APIRouter, Depends, HTTPException, Query

from repositories import get_clothing_repository
from repositories.base import ClothingRepository
from schemas import CATEGORIES, ClothingItem, ClothingItemCreate, ClothingItemUpdate

router = APIRouter(prefix="/clothing", tags=["clothing"])


@router.get("", response_model=list[ClothingItem])
def list_clothing(
    search: str = "",
    category: str = "All",
    season: str = "All",
    sort: str = "newest",
    repository: ClothingRepository = Depends(get_clothing_repository),
):
    items = repository.list()

    if search:
        needle = search.lower()
        items = [i for i in items if needle in i.name.lower() or needle in i.brand.lower()]
    if category != "All":
        items = [i for i in items if i.category == category]
    if season != "All":
        items = [i for i in items if i.season == season]

    sorters = {
        "newest": lambda i: -i.id,
        "name": lambda i: i.name.lower(),
        "most-worn": lambda i: -i.times_worn,
        "price": lambda i: -i.price,
    }
    return sorted(items, key=sorters.get(sort, sorters["newest"]))


@router.get("/categories", response_model=list[str])
def list_categories():
    return CATEGORIES


@router.get("/{item_id}", response_model=ClothingItem)
def get_clothing(item_id: int, repository: ClothingRepository = Depends(get_clothing_repository)):
    item = repository.get(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Clothing item not found")
    return item


@router.post("", response_model=ClothingItem, status_code=201)
def create_clothing(
    data: ClothingItemCreate, repository: ClothingRepository = Depends(get_clothing_repository)
):
    if data.category not in CATEGORIES:
        raise HTTPException(status_code=422, detail=f"Category must be one of {CATEGORIES}")
    return repository.add(data)


@router.put("/{item_id}", response_model=ClothingItem)
def update_clothing(
    item_id: int,
    data: ClothingItemUpdate,
    repository: ClothingRepository = Depends(get_clothing_repository),
):
    item = repository.update(item_id, data)
    if item is None:
        raise HTTPException(status_code=404, detail="Clothing item not found")
    return item


@router.post("/{item_id}/favourite", response_model=ClothingItem)
def toggle_favourite(
    item_id: int, repository: ClothingRepository = Depends(get_clothing_repository)
):
    item = repository.toggle_favourite(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Clothing item not found")
    return item


@router.delete("/{item_id}", status_code=204)
def delete_clothing(item_id: int, repository: ClothingRepository = Depends(get_clothing_repository)):
    if not repository.delete(item_id):
        raise HTTPException(status_code=404, detail="Clothing item not found")
