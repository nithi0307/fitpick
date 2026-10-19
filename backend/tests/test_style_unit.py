"""Unit tests for the outfit style score.

The score must be deterministic and explainable: the same pieces always give
the same result, and each rule contributes a known number of points.
"""

import pytest

from schemas import ClothingItem
from services.style_service import MAX_SCORE, score_outfit


def piece(category, colour="Black", season="All Season", tags=None, name=None):
    return ClothingItem(
        id=0,
        name=name or f"{colour} {category}",
        category=category,
        colour=colour,
        season=season,
        tags=tags or [],
    )


FULL = [
    piece("Tops", "White", tags=["Office"]),
    piece("Bottoms", "Navy"),
    piece("Shoes", "Black"),
    piece("Outerwear", "Grey"),
]


def test_a_complete_neutral_in_season_outfit_scores_full_marks():
    score, notes = score_outfit(FULL, "Office")
    assert score == MAX_SCORE == 10
    assert notes[0] == "Complete look"


def test_the_same_pieces_always_give_the_same_score():
    assert score_outfit(FULL, "Office") == score_outfit(FULL, "Office")


def test_an_empty_outfit_scores_zero():
    assert score_outfit([], "Casual") == (0, ["No pieces chosen"])


def test_missing_shoes_costs_a_point_and_is_named():
    score, notes = score_outfit(FULL[:2] + [FULL[3]], "Office")
    assert score == 9
    assert notes[0] == "Missing shoes"


def test_a_dress_counts_as_both_top_and_bottom():
    outfit = [piece("Dresses", "Black", tags=["Date Night"]), piece("Shoes", "Black")]
    score, notes = score_outfit(outfit, "Date Night")
    assert notes[0] == "Complete look"
    assert score == 9  # no outerwear or accessory


def test_three_accent_colours_lose_colour_points():
    loud = [
        piece("Tops", "Red", tags=["Casual"]),
        piece("Bottoms", "Green"),
        piece("Shoes", "Blue"),
    ]
    score, notes = score_outfit(loud, "Casual")
    assert notes[1] == "3 accent colours competing"
    assert score == 7


def test_mixing_summer_and_winter_pieces_loses_the_season_points():
    mixed = [
        piece("Tops", "White", season="S/S", tags=["Casual"]),
        piece("Bottoms", "Navy", season="F/W"),
        piece("Shoes", "Black"),
    ]
    score, notes = score_outfit(mixed, "Casual")
    assert notes[2] == "Mixes S/S and F/W pieces"
    assert score == 7


def test_nothing_tagged_for_the_occasion_loses_the_occasion_point():
    score, notes = score_outfit(FULL, "Sport")
    assert notes[3] == "Nothing tagged for Sport"
    assert score == 9


@pytest.mark.parametrize("occasion", ["Casual", "Office", "Formal", "Sport"])
def test_the_score_never_leaves_the_zero_to_ten_range(occasion):
    score, _ = score_outfit(FULL, occasion)
    assert 0 <= score <= MAX_SCORE
