"""Storage interfaces.

Routers depend on these abstract classes, never on a concrete database.
Swapping storage means adding a subclass, not editing an endpoint.
"""

from abc import ABC, abstractmethod

from schemas import ClothingItem, ClothingItemCreate, ClothingItemUpdate, Outfit, OutfitCreate


class ClothingRepository(ABC):
    @abstractmethod
    def list(self) -> list[ClothingItem]: ...

    @abstractmethod
    def get(self, item_id: int) -> ClothingItem | None: ...

    @abstractmethod
    def add(self, data: ClothingItemCreate) -> ClothingItem: ...

    @abstractmethod
    def update(self, item_id: int, data: ClothingItemUpdate) -> ClothingItem | None: ...

    @abstractmethod
    def delete(self, item_id: int) -> bool: ...

    @abstractmethod
    def toggle_favourite(self, item_id: int) -> ClothingItem | None: ...


class OutfitRepository(ABC):
    @abstractmethod
    def list(self) -> list[Outfit]: ...

    @abstractmethod
    def get(self, outfit_id: int) -> Outfit | None: ...

    @abstractmethod
    def add(self, data: OutfitCreate) -> Outfit: ...

    @abstractmethod
    def delete(self, outfit_id: int) -> bool: ...

    @abstractmethod
    def toggle_favourite(self, outfit_id: int) -> Outfit | None: ...
