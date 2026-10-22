"""Unit tests for the outfit style score.

The score must be deterministic and explainable: the same pieces always give
the same result, and each rule contributes a known number of points.
"""

import pytest

from schemas import ClothingItem
from services.style_service import (
    MAX_COLOUR,
    MAX_COVERAGE,
    MAX_OCCASION,
    MAX_SCORE,
    MAX_SEASON,
    score_outfit,
)


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


# ---------------------------------------------------------------------------
# Written in response to the mutation-testing report: each test below kills a
# mutant that the first set of tests left alive.
# ---------------------------------------------------------------------------


def test_the_rule_weights_are_four_three_two_one():
    assert (MAX_COVERAGE, MAX_COLOUR, MAX_SEASON, MAX_OCCASION) == (4, 3, 2, 1)
    assert MAX_SCORE == 10


@pytest.mark.parametrize(
    "colour", ["White", "Black", "Grey", "Gray", "Navy", "Beige", "Cream", "Brown", "Tan"]
)
def test_every_listed_neutral_counts_as_neutral(colour):
    outfit = [
        piece("Tops", colour, tags=["Casual"]),
        piece("Bottoms", colour),
        piece("Shoes", colour),
    ]
    assert score_outfit(outfit, "Casual")[1][1] == "Neutral palette"


def test_coverage_points_accumulate_rather_than_overwrite():
    shoes_only = [piece("Shoes", "Black", tags=["Casual"])]
    full_base = [
        piece("Tops", "Black", tags=["Casual"]),
        piece("Bottoms", "Black"),
        piece("Shoes", "Black"),
    ]
    assert score_outfit(shoes_only, "Casual")[0] == 1 + MAX_COLOUR + MAX_SEASON + MAX_OCCASION
    assert score_outfit(full_base, "Casual")[0] == 3 + MAX_COLOUR + MAX_SEASON + MAX_OCCASION


def test_an_accessory_finishes_a_look_just_as_outerwear_does():
    base = [
        piece("Tops", "Black", tags=["Casual"]),
        piece("Bottoms", "Black"),
        piece("Shoes", "Black"),
    ]
    with_accessory = base + [piece("Accessories", "Black")]
    assert score_outfit(with_accessory, "Casual")[0] == score_outfit(base, "Casual")[0] + 1


def test_a_missing_top_is_named():
    outfit = [piece("Bottoms", "Black", tags=["Casual"]), piece("Shoes", "Black")]
    assert score_outfit(outfit, "Casual")[1][0] == "Missing a top"


def test_a_missing_bottom_is_named():
    outfit = [piece("Tops", "Black", tags=["Casual"]), piece("Shoes", "Black")]
    assert score_outfit(outfit, "Casual")[1][0] == "Missing a bottom"


def test_several_missing_pieces_are_listed_in_one_note():
    outfit = [piece("Accessories", "Black", tags=["Casual"])]
    assert score_outfit(outfit, "Casual")[1][0] == "Missing a top, a bottom, shoes"


def test_one_accent_is_described_as_neutrals_with_an_accent():
    outfit = [
        piece("Tops", "Red", tags=["Casual"]),
        piece("Bottoms", "Black"),
        piece("Shoes", "Black"),
    ]
    score, notes = score_outfit(outfit, "Casual")
    assert notes[1] == "Neutrals with one accent"
    assert score == 3 + MAX_COLOUR + MAX_SEASON + MAX_OCCASION


def test_two_accents_cost_one_colour_point():
    outfit = [
        piece("Tops", "Red", tags=["Casual"]),
        piece("Bottoms", "Green"),
        piece("Shoes", "Black"),
    ]
    score, notes = score_outfit(outfit, "Casual")
    assert notes[1] == "Two accent colours"
    assert score == 3 + 2 + MAX_SEASON + MAX_OCCASION


def test_all_season_pieces_never_clash_with_a_seasonal_one():
    outfit = [
        piece("Tops", "Black", season="All Season", tags=["Casual"]),
        piece("Bottoms", "Black", season="F/W"),
        piece("Shoes", "Black", season="All Season"),
    ]
    assert score_outfit(outfit, "Casual")[1][2] == "Season consistent"


def test_the_occasion_note_names_the_occasion():
    outfit = [
        piece("Tops", "Black", tags=["Office"]),
        piece("Bottoms", "Black"),
        piece("Shoes", "Black"),
    ]
    assert score_outfit(outfit, "Office")[1][3] == "Suited to Office"


def test_a_repeated_accent_colour_counts_once():
    outfit = [
        piece("Tops", "Red", tags=["Casual"]),
        piece("Bottoms", "Red"),
        piece("Shoes", "Black"),
    ]
    assert score_outfit(outfit, "Casual")[1][1] == "Neutrals with one accent"
