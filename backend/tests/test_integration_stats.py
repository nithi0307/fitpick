"""Integration tests for the dashboard and analytics figures."""


def test_dashboard_totals_match_the_wardrobe(client):
    stats = client.get("/stats/dashboard").json()
    items = client.get("/clothing").json()
    assert stats["total_items"] == len(items)
    assert stats["favourites"] == sum(1 for i in items if i["is_favourite"])
    assert stats["total_outfits"] == len(client.get("/outfits").json())


def test_dashboard_reports_the_most_worn_item(client):
    stats = client.get("/stats/dashboard").json()
    assert stats["most_worn"] == "Dark Wash Jeans"
    assert stats["most_worn_count"] == 25


def test_breakdown_adds_up_to_the_total(client):
    stats = client.get("/stats/dashboard").json()
    assert sum(row["count"] for row in stats["breakdown"]) == stats["total_items"]


def test_analytics_wardrobe_value_is_the_sum_of_prices(client):
    analytics = client.get("/stats/analytics").json()
    items = client.get("/clothing").json()
    assert analytics["wardrobe_value"] == round(sum(i["price"] for i in items), 2)


def test_analytics_names_the_largest_category(client):
    analytics = client.get("/stats/analytics").json()
    assert analytics["top_category"] == "Tops"


def test_dashboard_updates_after_adding_an_item(client):
    before = client.get("/stats/dashboard").json()["total_items"]
    client.post("/clothing", json={"name": "Cap", "category": "Accessories", "colour": "Navy"})
    after = client.get("/stats/dashboard").json()["total_items"]
    assert after == before + 1
