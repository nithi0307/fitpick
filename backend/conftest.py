"""Shared pytest fixtures.

Every test starts from a freshly seeded in-memory wardrobe so tests never
depend on each other or on a running database.
"""

import pytest
from fastapi.testclient import TestClient

import repositories
from main import app


@pytest.fixture
def client() -> TestClient:
    repositories.reset()
    with TestClient(app) as test_client:
        yield test_client
    repositories.reset()


@pytest.fixture
def empty_wardrobe():
    """An empty repository pair, for edge-case tests."""
    from repositories.memory_repository import (
        InMemoryClothingRepository,
        InMemoryOutfitRepository,
    )

    clothing = InMemoryClothingRepository(seed=False)
    return clothing, InMemoryOutfitRepository()
