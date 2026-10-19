"""Unit tests for the analytics calculations.

These were written in response to the mutation-testing report: each test
below kills a mutant that the integration suite alone left alive.
"""

from datetime import date, timedelta

import pytest

from repositories.memory_repository import InMemoryClothingRepository, InMemoryOutfitRepository
from schemas import ClothingItemCreate
from services import analytics_service


@pytest.fixture
def wardrobe():
    return InMemoryClothingRepository(seed=False), InMemoryOutfitRepository()


USER = 1  # every fixture wardrobe belongs to one account


def add(repo, name, category="Tops", colour="Black", brand="", price=0.0, worn=0, days_old=0):
    item = repo.add(USER, ClothingItemCreate(
        name=name, category=category, colour=colour, brand=brand, price=price
    ))
    item.times_worn = worn
    item.created_at = date.today() - timedelta(days=days_old)
    return item


def test_equal_counts_are_ordered_alphabetically(wardrobe):
    """Tie-break must be the label, so the charts have a stable order."""
    clothing, outfits = wardrobe
    add(clothing, "Boot", category="Shoes")
    add(clothing, "Jean", category="Bottoms")
    breakdown = analytics_service.dashboard_stats(clothing, outfits).breakdown
    assert [row.label for row in breakdown] == ["Bottoms", "Shoes"]


def test_added_this_week_includes_exactly_the_last_seven_days(wardrobe):
    """The boundary is seven days inclusive: an eight-day-old item is old."""
    clothing, outfits = wardrobe
    add(clothing, "Today", days_old=0)
    add(clothing, "Exactly seven days", days_old=7)
    add(clothing, "Eight days", days_old=8)
    assert analytics_service.dashboard_stats(clothing, outfits).added_this_week == 2


def test_items_without_a_date_are_not_counted_as_recent(wardrobe):
    """Imported items can have no creation date and must be skipped safely."""
    clothing, outfits = wardrobe
    undated = add(clothing, "Imported")
    undated.created_at = None
    assert analytics_service.dashboard_stats(clothing, outfits).added_this_week == 0


def test_empty_wardrobe_reports_a_zero_wear_count(wardrobe):
    clothing, outfits = wardrobe
    stats = analytics_service.dashboard_stats(clothing, outfits)
    assert stats.most_worn_count == 0


def test_average_wears_is_the_mean_rounded_to_one_decimal(wardrobe):
    """1 + 1 + 2 wears over three items is 1.333…, shown as 1.3."""
    clothing, _ = wardrobe
    add(clothing, "A", worn=1)
    add(clothing, "B", worn=1)
    add(clothing, "C", worn=2)
    assert analytics_service.analytics_stats(clothing).average_wears == 1.3


def test_average_wears_divides_rather_than_multiplies(wardrobe):
    clothing, _ = wardrobe
    add(clothing, "A", worn=3)
    add(clothing, "B", worn=5)
    assert analytics_service.analytics_stats(clothing).average_wears == 4.0


def test_wardrobe_value_is_rounded_to_two_decimals(wardrobe):
    clothing, _ = wardrobe
    for name in "ABC":
        add(clothing, name, price=0.125)
    assert analytics_service.analytics_stats(clothing).wardrobe_value == 0.38


def test_favourite_brand_is_the_most_common_brand(wardrobe):
    clothing, _ = wardrobe
    add(clothing, "A", brand="COS")
    add(clothing, "B", brand="COS")
    add(clothing, "C", brand="Zara")
    assert analytics_service.analytics_stats(clothing).favourite_brand == "COS"


def test_items_without_a_brand_are_ignored(wardrobe):
    clothing, _ = wardrobe
    add(clothing, "A", brand="")
    add(clothing, "B", brand="Zara")
    assert analytics_service.analytics_stats(clothing).favourite_brand == "Zara"


def test_colour_chart_counts_every_colour(wardrobe):
    clothing, _ = wardrobe
    add(clothing, "A", colour="Black")
    add(clothing, "B", colour="Black")
    add(clothing, "C", colour="White")
    colours = analytics_service.analytics_stats(clothing).colours
    assert [(c.label, c.count) for c in colours] == [("Black", 2), ("White", 1)]


def test_empty_wardrobe_shows_a_placeholder_instead_of_a_brand(wardrobe):
    """The Analytics screen prints this placeholder for a new account."""
    clothing, _ = wardrobe
    assert analytics_service.analytics_stats(clothing).favourite_brand == "—"
