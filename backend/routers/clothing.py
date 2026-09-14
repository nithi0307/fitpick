"""HTTP endpoints for clothing items.

This module only translates HTTP requests into repository calls and
repository results into HTTP responses. It contains no storage logic.
"""

from fastapi import APIRouter, HTTPException

from repositories.clothing_repository import ClothingRepository
from schemas import ClothingItem, ClothingItemCreate

router = APIRouter(prefix="/clothing", tags=["clothing"])
repository = ClothingRepository()


@router.get("", response_model=list[ClothingItem])
def list_clothing():
    return repository.list()


@router.get("/{item_id}", response_model=ClothingItem)
def get_clothing(item_id: int):
    item = repository.get(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Clothing item not found")
    return item


@router.post("", response_model=ClothingItem, status_code=201)
def create_clothing(data: ClothingItemCreate):
    return repository.add(data)


@router.delete("/{item_id}", status_code=204)
def delete_clothing(item_id: int):
    if not repository.delete(item_id):
        raise HTTPException(status_code=404, detail="Clothing item not found")
