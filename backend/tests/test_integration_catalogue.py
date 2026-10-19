"""Integration tests for the ready-made catalogue.

Browsing it must never change anyone's wardrobe; choosing a piece must copy
it into the signed-in account only.
"""

NEW = {"X-User-Email": "catalogue-tester@example.com", "X-User-Name": "Cat Tester"}


def test_catalogue_lists_every_predefined_piece(client):
    entries = client.get("/catalogue").json()
    assert len(entries) == 33
    assert {"id", "name", "category", "subcategory", "colour", "brand", "price"} <= set(entries[0])


def test_catalogue_can_be_filtered_by_category(client):
    shoes = client.get("/catalogue", params={"category": "Shoes"}).json()
    assert len(shoes) == 5
    assert all(e["category"] == "Shoes" for e in shoes)


def test_catalogue_covers_all_six_categories(client):
    categories = {e["category"] for e in client.get("/catalogue").json()}
    assert categories == {"Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"}


def test_browsing_the_catalogue_does_not_change_the_wardrobe(client):
    client.get("/catalogue", headers=NEW)
    assert client.get("/clothing", headers=NEW).json() == []


def test_choosing_a_piece_copies_it_into_the_wardrobe(client):
    entry = client.get("/catalogue").json()[0]
    created = client.post("/catalogue/add", json={"catalogue_id": entry["id"]}, headers=NEW)

    assert created.status_code == 201
    assert created.json()["name"] == entry["name"]
    assert created.json()["category"] == entry["category"]
    assert created.json()["brand"] == entry["brand"]

    wardrobe = client.get("/clothing", headers=NEW).json()
    assert [i["name"] for i in wardrobe] == [entry["name"]]


def test_a_chosen_piece_belongs_only_to_the_account_that_chose_it(client):
    client.post("/catalogue/add", json={"catalogue_id": 1}, headers=NEW)
    other = {"X-User-Email": "someone-else@example.com"}
    assert client.get("/clothing", headers=other).json() == []


def test_choosing_a_piece_updates_the_statistics(client):
    client.post("/catalogue/add", json={"catalogue_id": 9}, headers=NEW)
    stats = client.get("/stats/dashboard", headers=NEW).json()
    assert stats["total_items"] == 1
    assert stats["breakdown"] == [{"label": "Bottoms", "count": 1}]


def test_an_unknown_catalogue_id_is_rejected(client):
    assert client.post("/catalogue/add", json={"catalogue_id": 9999}, headers=NEW).status_code == 404


def test_the_same_piece_can_be_owned_twice(client):
    client.post("/catalogue/add", json={"catalogue_id": 1}, headers=NEW)
    client.post("/catalogue/add", json={"catalogue_id": 1}, headers=NEW)
    assert len(client.get("/clothing", headers=NEW).json()) == 2
