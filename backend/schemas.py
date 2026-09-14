"""Pydantic models that define the shape of data crossing the API boundary.

The frontend only ever sees these structures, so the database tables can
change without the frontend noticing as long as these models stay stable.
"""

from pydantic import BaseModel


class ClothingItemCreate(BaseModel):
    name: str
    category: str
    colour: str
    occasion: str


class ClothingItem(ClothingItemCreate):
    id: int


class OutfitCreate(BaseModel):
    name: str
    item_ids: list[int]


class Outfit(OutfitCreate):
    id: int
    is_favourite: bool = False
