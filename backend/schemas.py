"""Pydantic models that define the shape of data crossing the API boundary.

These models are the contract between the React frontend and the FastAPI
backend. The storage layer can change freely as long as these stay stable.
"""

from datetime import date

from pydantic import BaseModel, Field

CATEGORIES = ["Tops", "Bottoms", "Outerwear", "Shoes", "Dresses", "Accessories"]
SEASONS = ["S/S", "F/W", "All Season"]
OCCASIONS = ["Casual", "Office", "Date Night", "Weekend", "Formal", "Sport"]


class User(BaseModel):
    id: int
    name: str
    email: str


class ClothingItemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    category: str
    subcategory: str = ""
    colour: str = Field(min_length=1, max_length=50)
    season: str = "All Season"
    brand: str = ""
    size: str = ""
    price: float = 0.0
    tags: list[str] = []
    notes: str = ""


class ClothingItemUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    subcategory: str | None = None
    colour: str | None = None
    season: str | None = None
    brand: str | None = None
    size: str | None = None
    price: float | None = None
    tags: list[str] | None = None
    notes: str | None = None


class ClothingItem(ClothingItemCreate):
    id: int
    is_favourite: bool = False
    times_worn: int = 0
    created_at: date | None = None


class CatalogueItem(BaseModel):
    id: int
    name: str
    category: str
    subcategory: str
    colour: str
    season: str
    brand: str
    size: str
    price: float


class AddFromCatalogue(BaseModel):
    catalogue_id: int


class OutfitCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    occasion: str = "Casual"
    item_ids: list[int] = []


class Outfit(OutfitCreate):
    id: int
    is_favourite: bool = False
    created_at: date | None = None


class CategoryCount(BaseModel):
    label: str
    count: int


class DashboardStats(BaseModel):
    total_items: int
    total_outfits: int
    favourites: int
    most_worn: str
    most_worn_count: int
    added_this_week: int
    breakdown: list[CategoryCount]


class AnalyticsStats(BaseModel):
    wardrobe_value: float
    average_wears: float
    top_category: str
    favourite_brand: str
    categories: list[CategoryCount]
    colours: list[CategoryCount]
