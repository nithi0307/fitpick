"""Integration tests for the outfit endpoints."""


def test_seeded_outfits_are_returned(client):
    outfits = client.get("/outfits").json()
    assert len(outfits) == 3
    assert outfits[0]["name"] == "Business Casual Friday"


def test_create_outfit_from_existing_items(client):
    payload = {"name": "Gym Session", "occasion": "Sport", "item_ids": [1, 4]}
    response = client.post("/outfits", json=payload)
    assert response.status_code == 201
    assert response.json()["item_ids"] == [1, 4]


def test_created_outfit_appears_in_the_list(client):
    client.post("/outfits", json={"name": "Gym Session", "occasion": "Sport", "item_ids": [1]})
    names = [o["name"] for o in client.get("/outfits").json()]
    assert "Gym Session" in names


def test_outfit_needs_at_least_one_item(client):
    response = client.post("/outfits", json={"name": "Empty", "item_ids": []})
    assert response.status_code == 422


def test_outfit_rejects_unknown_item(client):
    response = client.post("/outfits", json={"name": "Ghost", "item_ids": [9999]})
    assert response.status_code == 422


def test_delete_outfit(client):
    assert client.delete("/outfits/1").status_code == 204
    assert len(client.get("/outfits").json()) == 2


def test_favourite_an_outfit(client):
    before = client.get("/outfits").json()[1]["is_favourite"]
    after = client.post("/outfits/2/favourite").json()["is_favourite"]
    assert after is not before
