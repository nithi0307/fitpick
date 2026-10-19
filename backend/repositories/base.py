"""Storage interfaces.

Routers depend on these abstract classes, never on a concrete database.
Every wardrobe operation is scoped to the user it belongs to, so one account
can never read or change another account's clothes.
"""

from abc import ABC, abstractmethod

from schemas import (
    ClothingItem,
    ClothingItemCreate,
    ClothingItemUpdate,
    Outfit,
    OutfitCreate,
    User,
)


class UserRepository(ABC):
    @abstractmethod
    def get_or_create(self, email: str, name: str) -> User: ...


class ClothingRepository(ABC):
    @abstractmethod
    def list(self, user_id: int) -> list[ClothingItem]: ...

    @abstractmethod
    def get(self, user_id: int, item_id: int) -> ClothingItem | None: ...

    @abstractmethod
    def add(self, user_id: int, data: ClothingItemCreate) -> ClothingItem: ...

    @abstractmethod
    def update(
        self, user_id: int, item_id: int, data: ClothingItemUpdate
    ) -> ClothingItem | None: ...

    @abstractmethod
    def delete(self, user_id: int, item_id: int) -> bool: ...

    @abstractmethod
    def toggle_favourite(self, user_id: int, item_id: int) -> ClothingItem | None: ...


class OutfitRepository(ABC):
    @abstractmethod
    def list(self, user_id: int) -> list[Outfit]: ...

    @abstractmethod
    def get(self, user_id: int, outfit_id: int) -> Outfit | None: ...

    @abstractmethod
    def add(self, user_id: int, data: OutfitCreate) -> Outfit: ...

    @abstractmethod
    def delete(self, user_id: int, outfit_id: int) -> bool: ...

    @abstractmethod
    def toggle_favourite(self, user_id: int, outfit_id: int) -> Outfit | None: ...
