"""Integration tests: HTTP endpoint -> router -> repository -> response.

These exercise the real FastAPI application through its HTTP interface, so
routing, validation, serialisation and storage are tested together.
"""

NEW_ITEM = {
    "name": "Linen Shorts",
    "category": "Bottoms",
    "subcategory": "Shorts",
    "colour": "Beige",
    "season": "S/S",
    "brand": "Arket",
    "size": "32",
    "price": 49.0,
    "tags": ["Weekend"],
}


def test_api_is_running(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "FitPick Backend Running"


def test_seeded_wardrobe_is_returned(client):
    response = client.get("/clothing")
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 12
    assert {"id", "name", "category", "colour", "times_worn"} <= set(items[0])


def test_add_item_then_read_it_back(client):
    created = client.post("/clothing", json=NEW_ITEM)
    assert created.status_code == 201
    item_id = created.json()["id"]

    fetched = client.get(f"/clothing/{item_id}")
    assert fetched.status_code == 200
    assert fetched.json()["name"] == "Linen Shorts"
    assert fetched.json()["brand"] == "Arket"


def test_add_item_increases_wardrobe_count(client):
    before = len(client.get("/clothing").json())
    client.post("/clothing", json=NEW_ITEM)
    after = len(client.get("/clothing").json())
    assert after == before + 1


def test_update_item_changes_only_given_fields(client):
    response = client.put("/clothing/1", json={"colour": "Cream"})
    assert response.status_code == 200
    assert response.json()["colour"] == "Cream"
    assert response.json()["name"] == "Classic White Tee"


def test_delete_item_removes_it(client):
    assert client.delete("/clothing/2").status_code == 204
    assert client.get("/clothing/2").status_code == 404


def test_search_matches_item_name(client):
    results = client.get("/clothing", params={"search": "sneakers"}).json()
    assert [i["name"] for i in results] == ["White Sneakers"]


def test_filter_by_category(client):
    results = client.get("/clothing", params={"category": "Shoes"}).json()
    assert len(results) == 2
    assert all(i["category"] == "Shoes" for i in results)


def test_sort_by_most_worn(client):
    results = client.get("/clothing", params={"sort": "most-worn"}).json()
    worn = [i["times_worn"] for i in results]
    assert worn == sorted(worn, reverse=True)


def test_toggle_favourite_flips_the_flag(client):
    before = client.get("/clothing/5").json()["is_favourite"]
    after = client.post("/clothing/5/favourite").json()["is_favourite"]
    assert after is not before


def test_rejects_unknown_category(client):
    bad = {**NEW_ITEM, "category": "Hats"}
    assert client.post("/clothing", json=bad).status_code == 422


def test_rejects_item_without_a_name(client):
    bad = {**NEW_ITEM, "name": ""}
    assert client.post("/clothing", json=bad).status_code == 422
