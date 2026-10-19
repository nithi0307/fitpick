"""Scores an outfit out of ten.

The score is a small rule-based model, not a learned one and not random: the
same pieces always produce the same score, and every point can be explained.
It rewards an outfit that is complete, coherent in colour, consistent in
season, and suited to the occasion it was saved for.
"""

from schemas import ClothingItem

NEUTRALS = {"white", "black", "grey", "gray", "navy", "beige", "cream", "brown", "tan"}

MAX_COVERAGE, MAX_COLOUR, MAX_SEASON, MAX_OCCASION = 4, 3, 2, 1
MAX_SCORE = MAX_COVERAGE + MAX_COLOUR + MAX_SEASON + MAX_OCCASION


def _coverage(items: list[ClothingItem]) -> tuple[int, str]:
    """A complete look needs something on top, something below and shoes."""
    categories = {item.category for item in items}
    has_dress = "Dresses" in categories

    points = 0
    if has_dress or "Tops" in categories:
        points += 1
    if has_dress or "Bottoms" in categories:
        points += 1
    if "Shoes" in categories:
        points += 1
    if categories & {"Outerwear", "Accessories"}:
        points += 1

    missing = []
    if not (has_dress or "Tops" in categories):
        missing.append("a top")
    if not (has_dress or "Bottoms" in categories):
        missing.append("a bottom")
    if "Shoes" not in categories:
        missing.append("shoes")

    note = "Complete look" if not missing else "Missing " + ", ".join(missing)
    return points, note


def _colour(items: list[ClothingItem]) -> tuple[int, str]:
    """Neutrals always sit together; one accent lifts them; three fight."""
    accents = {
        item.colour.strip().lower()
        for item in items
        if item.colour.strip().lower() not in NEUTRALS
    }

    if len(accents) <= 1:
        note = "Neutral palette" if not accents else f"Neutrals with one accent"
        return MAX_COLOUR, note
    if len(accents) == 2:
        return 2, "Two accent colours"
    return 1, f"{len(accents)} accent colours competing"


def _season(items: list[ClothingItem]) -> tuple[int, str]:
    """Mixing a summer piece with a winter one rarely works."""
    seasons = {item.season for item in items} - {"All Season"}
    if len(seasons) <= 1:
        return MAX_SEASON, "Season consistent"
    return 0, "Mixes S/S and F/W pieces"


def _occasion(items: list[ClothingItem], occasion: str) -> tuple[int, str]:
    """At least one piece should actually be tagged for the occasion."""
    for item in items:
        if occasion in item.tags:
            return MAX_OCCASION, f"Suited to {occasion}"
    return 0, f"Nothing tagged for {occasion}"


def score_outfit(items: list[ClothingItem], occasion: str) -> tuple[int, list[str]]:
    """Return the score out of ten and the reason for each part of it."""
    if not items:
        return 0, ["No pieces chosen"]

    results = [
        _coverage(items),
        _colour(items),
        _season(items),
        _occasion(items, occasion),
    ]
    total = sum(points for points, _ in results)
    return total, [note for _, note in results]
