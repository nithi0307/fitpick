"""In-memory implementation of the storage interfaces.

Used when no DATABASE_URL is configured and by the automated tests, so the
suite runs without a database. Data is held per user, exactly as the
PostgreSQL implementation scopes every query by user_id.
"""

from collections import defaultdict
from datetime import date, timedelta

from repositories.base import ClothingRepository, OutfitRepository, UserRepository
from schemas import (
    ClothingItem,
    ClothingItemCreate,
    ClothingItemUpdate,
    Outfit,
    OutfitCreate,
    User,
)
from seed_data import CLOTHING_SEED, DEMO_USER, OUTFIT_SEED


class InMemoryUserRepository(UserRepository):
    def __init__(self) -> None:
        self._by_email: dict[str, User] = {}
        self._next_id = 1
        self.get_or_create(email=DEMO_USER[1], name=DEMO_USER[0])

    def get_or_create(self, email: str, name: str) -> User:
        existing = self._by_email.get(email)
        if existing:
            return existing
        user = User(id=self._next_id, name=name, email=email)
        self._by_email[email] = user
        self._next_id += 1
        return user


class InMemoryClothingRepository(ClothingRepository):
    def __init__(self, seed: bool = True) -> None:
        self._items: dict[int, dict[int, ClothingItem]] = defaultdict(dict)
        self._next_id = 1
        if seed:
            self._load_seed(user_id=1)

    def _load_seed(self, user_id: int) -> None:
        today = date.today()
        for offset, row in enumerate(CLOTHING_SEED):
            name, category, sub, colour, season, brand, size, price, tags, worn, fav = row
            item = self.add(user_id, ClothingItemCreate(
                name=name, category=category, subcategory=sub, colour=colour,
                season=season, brand=brand, size=size, price=price, tags=tags,
            ))
            item.times_worn = worn
            item.is_favourite = fav
            item.created_at = today - timedelta(days=offset * 3)

    def list(self, user_id: int) -> list[ClothingItem]:
        return list(self._items[user_id].values())

    def get(self, user_id: int, item_id: int) -> ClothingItem | None:
        return self._items[user_id].get(item_id)

    def add(self, user_id: int, data: ClothingItemCreate) -> ClothingItem:
        item = ClothingItem(id=self._next_id, created_at=date.today(), **data.model_dump())
        self._items[user_id][item.id] = item
        self._next_id += 1
        return item

    def update(
        self, user_id: int, item_id: int, data: ClothingItemUpdate
    ) -> ClothingItem | None:
        item = self._items[user_id].get(item_id)
        if item is None:
            return None
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(item, field, value)
        return item

    def delete(self, user_id: int, item_id: int) -> bool:
        return self._items[user_id].pop(item_id, None) is not None

    def toggle_favourite(self, user_id: int, item_id: int) -> ClothingItem | None:
        item = self._items[user_id].get(item_id)
        if item is not None:
            item.is_favourite = not item.is_favourite
        return item


class InMemoryOutfitRepository(OutfitRepository):
    def __init__(self, clothing: InMemoryClothingRepository | None = None) -> None:
        self._outfits: dict[int, dict[int, Outfit]] = defaultdict(dict)
        self._next_id = 1
        if clothing is not None:
            self._load_seed(clothing, user_id=1)

    def _load_seed(self, clothing: InMemoryClothingRepository, user_id: int) -> None:
        by_name = {item.name: item.id for item in clothing.list(user_id)}
        for name, occasion, item_names, fav in OUTFIT_SEED:
            outfit = self.add(user_id, OutfitCreate(
                name=name, occasion=occasion,
                item_ids=[by_name[n] for n in item_names if n in by_name],
            ))
            outfit.is_favourite = fav

    def list(self, user_id: int) -> list[Outfit]:
        return list(self._outfits[user_id].values())

    def get(self, user_id: int, outfit_id: int) -> Outfit | None:
        return self._outfits[user_id].get(outfit_id)

    def add(self, user_id: int, data: OutfitCreate) -> Outfit:
        outfit = Outfit(id=self._next_id, created_at=date.today(), **data.model_dump())
        self._outfits[user_id][outfit.id] = outfit
        self._next_id += 1
        return outfit

    def delete(self, user_id: int, outfit_id: int) -> bool:
        return self._outfits[user_id].pop(outfit_id, None) is not None

    def toggle_favourite(self, user_id: int, outfit_id: int) -> Outfit | None:
        outfit = self._outfits[user_id].get(outfit_id)
        if outfit is not None:
            outfit.is_favourite = not outfit.is_favourite
        return outfit
