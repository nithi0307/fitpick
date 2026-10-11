"""Repository factory.

One place decides which storage implementation the application uses:
PostgreSQL when DATABASE_URL is set (Docker Compose), otherwise in-memory.
"""

import os

from repositories.base import ClothingRepository, OutfitRepository
from repositories.memory_repository import InMemoryClothingRepository, InMemoryOutfitRepository

_clothing: ClothingRepository | None = None
_outfits: OutfitRepository | None = None


def _build() -> tuple[ClothingRepository, OutfitRepository]:
    dsn = os.environ.get("DATABASE_URL")
    if dsn:
        from repositories.postgres_repository import (
            PostgresClothingRepository,
            PostgresOutfitRepository,
        )
        return PostgresClothingRepository(dsn), PostgresOutfitRepository(dsn)

    clothing = InMemoryClothingRepository()
    return clothing, InMemoryOutfitRepository(clothing)


def get_clothing_repository() -> ClothingRepository:
    global _clothing, _outfits
    if _clothing is None:
        _clothing, _outfits = _build()
    return _clothing


def get_outfit_repository() -> OutfitRepository:
    global _clothing, _outfits
    if _outfits is None:
        _clothing, _outfits = _build()
    return _outfits


def reset() -> None:
    """Used by the test suite to start each test from a clean wardrobe."""
    global _clothing, _outfits
    _clothing, _outfits = None, None
