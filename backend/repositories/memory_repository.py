"""In-memory implementation of the storage interfaces.

Used when no DATABASE_URL is configured and by the automated tests, so the
test suite runs without a database.
"""

from datetime import date, timedelta

from repositories.base import ClothingRepository, OutfitRepository
from schemas import ClothingItem, ClothingItemCreate, ClothingItemUpdate, Outfit, OutfitCreate
from seed_data import CLOTHING_SEED, OUTFIT_SEED


class InMemoryClothingRepository(ClothingRepository):
    def __init__(self, seed: bool = True) -> None:
        self._items: dict[int, ClothingItem] = {}
        self._next_id = 1
        if seed:
            self._load_seed()

    def _load_seed(self) -> None:
        today = date.today()
        for offset, row in enumerate(CLOTHING_SEED):
            name, category, sub, colour, season, brand, size, price, tags, worn, fav = row
            item = self.add(ClothingItemCreate(
                name=name, category=category, subcategory=sub, colour=colour,
                season=season, brand=brand, size=size, price=price, tags=tags,
            ))
            item.times_worn = worn
            item.is_favourite = fav
            item.created_at = today - timedelta(days=offset * 3)

    def list(self) -> list[ClothingItem]:
        return list(self._items.values())

    def get(self, item_id: int) -> ClothingItem | None:
        return self._items.get(item_id)

    def add(self, data: ClothingItemCreate) -> ClothingItem:
        item = ClothingItem(id=self._next_id, created_at=date.today(), **data.model_dump())
        self._items[item.id] = item
        self._next_id += 1
        return item

    def update(self, item_id: int, data: ClothingItemUpdate) -> ClothingItem | None:
        item = self._items.get(item_id)
        if item is None:
            return None
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(item, field, value)
        return item

    def delete(self, item_id: int) -> bool:
        return self._items.pop(item_id, None) is not None

    def toggle_favourite(self, item_id: int) -> ClothingItem | None:
        item = self._items.get(item_id)
        if item is not None:
            item.is_favourite = not item.is_favourite
        return item


class InMemoryOutfitRepository(OutfitRepository):
    def __init__(self, clothing: InMemoryClothingRepository | None = None) -> None:
        self._outfits: dict[int, Outfit] = {}
        self._next_id = 1
        if clothing is not None:
            self._load_seed(clothing)

    def _load_seed(self, clothing: InMemoryClothingRepository) -> None:
        by_name = {item.name: item.id for item in clothing.list()}
        for name, occasion, item_names, fav in OUTFIT_SEED:
            outfit = self.add(OutfitCreate(
                name=name, occasion=occasion,
                item_ids=[by_name[n] for n in item_names if n in by_name],
            ))
            outfit.is_favourite = fav

    def list(self) -> list[Outfit]:
        return list(self._outfits.values())

    def get(self, outfit_id: int) -> Outfit | None:
        return self._outfits.get(outfit_id)

    def add(self, data: OutfitCreate) -> Outfit:
        outfit = Outfit(id=self._next_id, created_at=date.today(), **data.model_dump())
        self._outfits[outfit.id] = outfit
        self._next_id += 1
        return outfit

    def delete(self, outfit_id: int) -> bool:
        return self._outfits.pop(outfit_id, None) is not None

    def toggle_favourite(self, outfit_id: int) -> Outfit | None:
        outfit = self._outfits.get(outfit_id)
        if outfit is not None:
            outfit.is_favourite = not outfit.is_favourite
        return outfit
