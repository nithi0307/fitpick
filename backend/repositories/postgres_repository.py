"""PostgreSQL implementation of the storage interfaces.

Selected automatically when DATABASE_URL is set (which Docker Compose does).
It implements exactly the same methods as the in-memory version, so no
router or frontend code changes when the storage swaps over.
"""

import psycopg
from psycopg.rows import dict_row

from repositories.base import ClothingRepository, OutfitRepository, UserRepository
from schemas import (
    ClothingItem,
    ClothingItemCreate,
    ClothingItemUpdate,
    Outfit,
    OutfitCreate,
    User,
)

CLOTHING_COLUMNS = """
    id, name, category, subcategory, colour, season, brand, size, price,
    tags, notes, is_favourite, times_worn, created_at::date AS created_at
"""


class PostgresClothingRepository(ClothingRepository):
    def __init__(self, dsn: str) -> None:
        self._dsn = dsn

    def _connect(self):
        return psycopg.connect(self._dsn, row_factory=dict_row)

    def list(self, user_id: int) -> list[ClothingItem]:
        with self._connect() as conn:
            rows = conn.execute(
                f"SELECT {CLOTHING_COLUMNS} FROM clothing_items WHERE user_id = %s ORDER BY id",
                (user_id,),
            ).fetchall()
        return [ClothingItem(**row) for row in rows]

    def get(self, user_id: int, item_id: int) -> ClothingItem | None:
        with self._connect() as conn:
            row = conn.execute(
                f"SELECT {CLOTHING_COLUMNS} FROM clothing_items WHERE id = %s AND user_id = %s",
                (item_id, user_id),
            ).fetchone()
        return ClothingItem(**row) if row else None

    def add(self, user_id: int, data: ClothingItemCreate) -> ClothingItem:
        with self._connect() as conn:
            row = conn.execute(
                f"""INSERT INTO clothing_items
                    (user_id, name, category, subcategory, colour, season, brand, size, price, tags, notes)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING {CLOTHING_COLUMNS}""",
                (user_id, data.name, data.category, data.subcategory, data.colour,
                 data.season, data.brand, data.size, data.price, data.tags, data.notes),
            ).fetchone()
        return ClothingItem(**row)

    def update(self, user_id: int, item_id: int, data: ClothingItemUpdate) -> ClothingItem | None:
        fields = data.model_dump(exclude_none=True)
        if not fields:
            return self.get(item_id)
        assignments = ", ".join(f"{name} = %s" for name in fields)
        with self._connect() as conn:
            row = conn.execute(
                f"""UPDATE clothing_items SET {assignments}
                    WHERE id = %s AND user_id = %s RETURNING {CLOTHING_COLUMNS}""",
                (*fields.values(), item_id, user_id),
            ).fetchone()
        return ClothingItem(**row) if row else None

    def delete(self, user_id: int, item_id: int) -> bool:
        with self._connect() as conn:
            result = conn.execute(
                "DELETE FROM clothing_items WHERE id = %s AND user_id = %s", (item_id, user_id)
            )
        return result.rowcount > 0

    def toggle_favourite(self, user_id: int, item_id: int) -> ClothingItem | None:
        with self._connect() as conn:
            row = conn.execute(
                f"""UPDATE clothing_items SET is_favourite = NOT is_favourite
                    WHERE id = %s AND user_id = %s RETURNING {CLOTHING_COLUMNS}""",
                (item_id, user_id),
            ).fetchone()
        return ClothingItem(**row) if row else None


class PostgresOutfitRepository(OutfitRepository):
    def __init__(self, dsn: str) -> None:
        self._dsn = dsn

    def _connect(self):
        return psycopg.connect(self._dsn, row_factory=dict_row)

    @staticmethod
    def _query(where: str = "") -> str:
        return f"""
            SELECT o.id, o.name, o.occasion, o.is_favourite, o.created_at::date AS created_at,
                   COALESCE(ARRAY_AGG(oi.clothing_item_id ORDER BY oi.clothing_item_id)
                            FILTER (WHERE oi.clothing_item_id IS NOT NULL), '{{}}') AS item_ids
            FROM outfits o
            LEFT JOIN outfit_items oi ON oi.outfit_id = o.id
            WHERE o.user_id = %s {where}
            GROUP BY o.id ORDER BY o.id
        """

    def list(self, user_id: int) -> list[Outfit]:
        with self._connect() as conn:
            rows = conn.execute(self._query(), (user_id,)).fetchall()
        return [Outfit(**row) for row in rows]

    def get(self, user_id: int, outfit_id: int) -> Outfit | None:
        with self._connect() as conn:
            row = conn.execute(self._query("AND o.id = %s"), (user_id, outfit_id)).fetchone()
        return Outfit(**row) if row else None

    def add(self, user_id: int, data: OutfitCreate) -> Outfit:
        with self._connect() as conn:
            row = conn.execute(
                "INSERT INTO outfits (user_id, name, occasion) VALUES (%s, %s, %s) RETURNING id",
                (user_id, data.name, data.occasion),
            ).fetchone()
            outfit_id = row["id"]
            for item_id in data.item_ids:
                conn.execute(
                    "INSERT INTO outfit_items (outfit_id, clothing_item_id) VALUES (%s, %s)"
                    " ON CONFLICT DO NOTHING",
                    (outfit_id, item_id),
                )
        return self.get(user_id, outfit_id)

    def delete(self, user_id: int, outfit_id: int) -> bool:
        with self._connect() as conn:
            result = conn.execute(
                "DELETE FROM outfits WHERE id = %s AND user_id = %s", (outfit_id, user_id)
            )
        return result.rowcount > 0

    def toggle_favourite(self, user_id: int, outfit_id: int) -> Outfit | None:
        with self._connect() as conn:
            updated = conn.execute(
                "UPDATE outfits SET is_favourite = NOT is_favourite"
                " WHERE id = %s AND user_id = %s RETURNING id",
                (outfit_id, user_id),
            ).fetchone()
        return self.get(user_id, outfit_id) if updated else None


class PostgresUserRepository(UserRepository):
    """Finds the account for an email, creating it on first sign-in.

    The password column is required by the schema but unused: FitPick does
    not authenticate yet, so nothing is stored in it.
    """

    def __init__(self, dsn: str) -> None:
        self._dsn = dsn

    def get_or_create(self, email: str, name: str) -> User:
        with psycopg.connect(self._dsn, row_factory=dict_row) as conn:
            row = conn.execute(
                "SELECT id, name, email FROM users WHERE email = %s", (email,)
            ).fetchone()
            if row is None:
                row = conn.execute(
                    "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, '')"
                    " RETURNING id, name, email",
                    (name, email),
                ).fetchone()
        return User(**row)
