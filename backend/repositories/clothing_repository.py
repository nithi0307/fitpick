"""Data access for clothing items.

Routers talk to this class and nothing else, so the storage mechanism is
hidden from the rest of the application. The current implementation keeps
items in memory, which is enough for development; a PostgreSQL-backed
version only needs to implement the same four methods.
"""

from schemas import ClothingItem, ClothingItemCreate


class ClothingRepository:
    def __init__(self) -> None:
        self._items: dict[int, ClothingItem] = {}
        self._next_id = 1

        for item in (
            ClothingItemCreate(name="White Oxford Shirt", category="Top", colour="White", occasion="Formal"),
            ClothingItemCreate(name="Navy Chinos", category="Bottom", colour="Navy", occasion="Casual"),
            ClothingItemCreate(name="Black Sneakers", category="Footwear", colour="Black", occasion="Casual"),
            ClothingItemCreate(name="Denim Jacket", category="Outerwear", colour="Blue", occasion="Casual"),
        ):
            self.add(item)

    def list(self) -> list[ClothingItem]:
        return list(self._items.values())

    def get(self, item_id: int) -> ClothingItem | None:
        return self._items.get(item_id)

    def add(self, data: ClothingItemCreate) -> ClothingItem:
        item = ClothingItem(id=self._next_id, **data.model_dump())
        self._items[item.id] = item
        self._next_id += 1
        return item

    def delete(self, item_id: int) -> bool:
        return self._items.pop(item_id, None) is not None
