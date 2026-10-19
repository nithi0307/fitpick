"""Integration tests for per-account wardrobes.

A person signing in with a new email starts with an empty wardrobe, and one
account can never see another account's clothes. The demo account keeps the
sample wardrobe used by the screenshots.
"""

NEW = {"X-User-Email": "priya@example.com", "X-User-Name": "Priya Sharma"}
OTHER = {"X-User-Email": "arjun@example.com", "X-User-Name": "Arjun Rao"}

ITEM = {"name": "Linen Shirt", "category": "Tops", "colour": "White", "brand": "Arket"}


def test_a_new_account_starts_with_an_empty_wardrobe(client):
    assert client.get("/clothing", headers=NEW).json() == []


def test_a_new_account_starts_with_no_outfits(client):
    assert client.get("/outfits", headers=NEW).json() == []


def test_a_new_account_sees_zeroed_statistics(client):
    stats = client.get("/stats/dashboard", headers=NEW).json()
    assert stats["total_items"] == 0
    assert stats["total_outfits"] == 0
    assert stats["favourites"] == 0
    assert stats["most_worn"] == "—"
    assert stats["breakdown"] == []


def test_the_demo_account_still_has_the_sample_wardrobe(client):
    assert len(client.get("/clothing").json()) == 12


def test_an_item_added_by_one_account_belongs_only_to_it(client):
    created = client.post("/clothing", json=ITEM, headers=NEW)
    assert created.status_code == 201

    assert [i["name"] for i in client.get("/clothing", headers=NEW).json()] == ["Linen Shirt"]
    assert client.get("/clothing", headers=OTHER).json() == []
    assert len(client.get("/clothing").json()) == 12


def test_one_account_cannot_read_another_accounts_item(client):
    item_id = client.post("/clothing", json=ITEM, headers=NEW).json()["id"]
    assert client.get(f"/clothing/{item_id}", headers=OTHER).status_code == 404


def test_one_account_cannot_delete_another_accounts_item(client):
    item_id = client.post("/clothing", json=ITEM, headers=NEW).json()["id"]
    assert client.delete(f"/clothing/{item_id}", headers=OTHER).status_code == 404
    assert len(client.get("/clothing", headers=NEW).json()) == 1


def test_statistics_follow_the_account_that_added_the_item(client):
    client.post("/clothing", json=ITEM, headers=NEW)
    assert client.get("/stats/dashboard", headers=NEW).json()["total_items"] == 1
    assert client.get("/stats/dashboard", headers=OTHER).json()["total_items"] == 0


def test_signing_in_again_returns_the_same_wardrobe(client):
    client.post("/clothing", json=ITEM, headers=NEW)
    # a second request with the same email must not create a second account
    again = client.get("/clothing", headers=NEW).json()
    assert len(again) == 1
