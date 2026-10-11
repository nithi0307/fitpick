"""Derived wardrobe figures shown on the Dashboard and Analytics screens.

Kept out of the routers so the calculations can be unit-tested without HTTP,
and out of the repositories so storage stays free of business rules.
"""

from collections import Counter
from datetime import date, timedelta

from repositories.base import ClothingRepository, OutfitRepository
from schemas import AnalyticsStats, CategoryCount, DashboardStats


def _counts(values: list[str]) -> list[CategoryCount]:
    counter = Counter(values)
    ordered = sorted(counter.items(), key=lambda pair: (-pair[1], pair[0]))
    return [CategoryCount(label=label, count=count) for label, count in ordered]


def dashboard_stats(clothing: ClothingRepository, outfits: OutfitRepository) -> DashboardStats:
    items = clothing.list()
    cutoff = date.today() - timedelta(days=7)
    recent = [i for i in items if i.created_at and i.created_at >= cutoff]
    most_worn = max(items, key=lambda i: i.times_worn, default=None)

    return DashboardStats(
        total_items=len(items),
        total_outfits=len(outfits.list()),
        favourites=sum(1 for i in items if i.is_favourite),
        most_worn=most_worn.name if most_worn else "—",
        most_worn_count=most_worn.times_worn if most_worn else 0,
        added_this_week=len(recent),
        breakdown=_counts([i.category for i in items]),
    )


def analytics_stats(clothing: ClothingRepository) -> AnalyticsStats:
    items = clothing.list()
    categories = _counts([i.category for i in items])
    brands = _counts([i.brand for i in items if i.brand])
    total_wears = sum(i.times_worn for i in items)

    return AnalyticsStats(
        wardrobe_value=round(sum(i.price for i in items), 2),
        average_wears=round(total_wears / len(items), 1) if items else 0.0,
        top_category=categories[0].label if categories else "—",
        favourite_brand=brands[0].label if brands else "—",
        categories=categories,
        colours=_counts([i.colour for i in items]),
    )
