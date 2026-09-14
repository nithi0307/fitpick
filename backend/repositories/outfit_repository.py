"""Data access for outfits – same pattern as ClothingRepository."""

from schemas import Outfit, OutfitCreate


class OutfitRepository:
    def __init__(self) -> None:
        self._outfits: dict[int, Outfit] = {}
        self._next_id = 1

    def list(self) -> list[Outfit]:
        return list(self._outfits.values())

    def add(self, data: OutfitCreate) -> Outfit:
        outfit = Outfit(id=self._next_id, **data.model_dump())
        self._outfits[outfit.id] = outfit
        self._next_id += 1
        return outfit

    def toggle_favourite(self, outfit_id: int) -> Outfit | None:
        outfit = self._outfits.get(outfit_id)
        if outfit:
            outfit.is_favourite = not outfit.is_favourite
        return outfit
