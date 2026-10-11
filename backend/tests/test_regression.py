"""Regression suite.

Each test locks in behaviour for an edge case that was wrong, or easy to get
wrong, during development. They are re-run on every change so the same fault
cannot reappear.
"""

from schemas import ClothingItemCreate
from services import analytics_service


def test_reg01_search_also_matches_the_brand(client):
    """Search originally looked at the item name only, so searching for a
    brand such as 'Levi' returned nothing."""
    results = client.get("/clothing", params={"search": "levi"}).json()
    assert [i["name"] for i in results] == ["Dark Wash Jeans"]


def test_reg02_deleting_a_missing_item_is_a_404(client):
    """Deleting an unknown id must not silently report success."""
    assert client.delete("/clothing/9999").status_code == 404


def test_reg03_category_all_does_not_filter_anything_out(client):
    """The literal string 'All' must be treated as 'no filter'."""
    everything = client.get("/clothing").json()
    with_all = client.get("/clothing", params={"category": "All"}).json()
    assert len(with_all) == len(everything)


def test_reg04_analytics_handles_an_empty_wardrobe(empty_wardrobe):
    """Average wears divided by the item count and crashed on a new account."""
    clothing, _ = empty_wardrobe
    stats = analytics_service.analytics_stats(clothing)
    assert stats.average_wears == 0.0
    assert stats.wardrobe_value == 0.0
    assert stats.top_category == "—"


def test_reg05_dashboard_handles_an_empty_wardrobe(empty_wardrobe):
    """max() over an empty wardrobe raised ValueError on the dashboard."""
    clothing, outfits = empty_wardrobe
    stats = analytics_service.dashboard_stats(clothing, outfits)
    assert stats.total_items == 0
    assert stats.most_worn == "—"
    assert stats.breakdown == []


def test_reg06_favourite_toggles_back_to_its_original_value(client):
    """Toggling twice must return the item to its starting state."""
    original = client.get("/clothing/3").json()["is_favourite"]
    client.post("/clothing/3/favourite")
    client.post("/clothing/3/favourite")
    assert client.get("/clothing/3").json()["is_favourite"] is original


def test_reg07_updating_one_field_keeps_the_others(client):
    """A partial update used to blank out every field that was omitted."""
    before = client.get("/clothing/7").json()
    client.put("/clothing/7", json={"price": 60.0})
    after = client.get("/clothing/7").json()
    assert after["price"] == 60.0
    assert after["name"] == before["name"]
    assert after["brand"] == before["brand"]
    assert after["tags"] == before["tags"]


def test_reg08_search_is_case_insensitive(client):
    """'NAVY' and 'navy' must return the same items."""
    upper = client.get("/clothing", params={"search": "NAVY"}).json()
    lower = client.get("/clothing", params={"search": "navy"}).json()
    assert [i["id"] for i in upper] == [i["id"] for i in lower]
    assert len(upper) >= 1


def test_reg09_counts_are_ordered_largest_first(empty_wardrobe):
    """The wardrobe breakdown chart depends on descending order."""
    clothing, outfits = empty_wardrobe
    for category in ["Tops", "Tops", "Tops", "Shoes", "Shoes", "Bottoms"]:
        clothing.add(ClothingItemCreate(name=f"{category} item", category=category, colour="Black"))
    stats = analytics_service.dashboard_stats(clothing, outfits)
    counts = [row.count for row in stats.breakdown]
    assert counts == sorted(counts, reverse=True)
    assert stats.breakdown[0].label == "Tops"


def test_reg10_deleted_item_disappears_from_the_statistics(client):
    """Statistics were cached and still counted deleted garments."""
    before = client.get("/stats/dashboard").json()["total_items"]
    client.delete("/clothing/1")
    after = client.get("/stats/dashboard").json()["total_items"]
    assert after == before - 1
