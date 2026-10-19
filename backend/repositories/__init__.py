"""Repository factory.

One place decides which storage implementation the application uses:
PostgreSQL when DATABASE_URL is set (Docker Compose), otherwise in-memory.
"""

import os

from repositories.base import ClothingRepository, OutfitRepository, UserRepository
from repositories.memory_repository import (
    InMemoryClothingRepository,
    InMemoryOutfitRepository,
    InMemoryUserRepository,
)

_clothing: ClothingRepository | None = None
_outfits: OutfitRepository | None = None
_users: UserRepository | None = None


def _build() -> tuple[ClothingRepository, OutfitRepository, UserRepository]:
    dsn = os.environ.get("DATABASE_URL")
    if dsn:
        from repositories.postgres_repository import (
            PostgresClothingRepository,
            PostgresOutfitRepository,
            PostgresUserRepository,
        )
        return (
            PostgresClothingRepository(dsn),
            PostgresOutfitRepository(dsn),
            PostgresUserRepository(dsn),
        )

    clothing = InMemoryClothingRepository()
    return clothing, InMemoryOutfitRepository(clothing), InMemoryUserRepository()


def _ensure() -> None:
    global _clothing, _outfits, _users
    if _clothing is None:
        _clothing, _outfits, _users = _build()


def get_clothing_repository() -> ClothingRepository:
    _ensure()
    return _clothing


def get_outfit_repository() -> OutfitRepository:
    _ensure()
    return _outfits


def get_user_repository() -> UserRepository:
    _ensure()
    return _users


def reset() -> None:
    """Used by the test suite to start each test from a clean wardrobe."""
    global _clothing, _outfits, _users
    _clothing, _outfits, _users = None, None, None
