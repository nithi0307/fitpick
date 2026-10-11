"""PostgreSQL implementation of the storage interfaces.

Selected automatically when DATABASE_URL is set (which Docker Compose does).
It implements exactly the same methods as the in-memory version, so no
router or frontend code changes when the storage swaps over.
"""

import psycopg
from psycopg.rows import dict_row

from repositories.base import ClothingRepository, OutfitRepository
from schemas import ClothingItem, ClothingItemCreate, ClothingItemUpdate, Outfit, OutfitCreate

USER_ID = 1  # single-user version; multi-user auth is future work

CLOTHING_COLUMNS = """
    id, name, category, subcategory, colour, season, brand, size, price,
    tags, notes, is_favourite, times_worn, created_at::date AS created_at
"""


class PostgresClothingRepository(ClothingRepository):
    def __init__(self, dsn: str) -> None:
        self._dsn = dsn

    def _connect(self):
        return psycopg.connect(self._dsn, row_factory=dict_row)

    def list(self) -> list[ClothingItem]:
        with self._connect() as conn:
            rows = conn.execute(
                f"SELECT {CLOTHING_COLUMNS} FROM clothing_items WHERE user_id = %s ORDER BY id",
                (USER_ID,),
            ).fetchall()
        return [ClothingItem(**row) for row in rows]

    def get(self, item_id: int) -> ClothingItem | None:
        with self._connect() as conn:
            row = conn.execute(
                f"SELECT {CLOTHING_COLUMNS} FROM clothing_items WHERE id = %s AND user_id = %s",
                (item_id, USER_ID),
            ).fetchone()
        return ClothingItem(**row) if row else None

    def add(self, data: ClothingItemCreate) -> ClothingItem:
        with self._connect() as conn:
            row = conn.execute(
                f"""INSERT INTO clothing_items
                    (user_id, name, category, subcategory, colour, season, brand, size, price, tags, notes)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING {CLOTHING_COLUMNS}""",
                (USER_ID, data.name, data.category, data.subcategory, data.colour,
                 data.season, data.brand, data.size, data.price, data.tags, data.notes),
            ).fetchone()
        return ClothingItem(**row)

    def update(self, item_id: int, data: ClothingItemUpdate) -> ClothingItem | None:
        fields = data.model_dump(exclude_none=True)
        if not fields:
            return self.get(item_id)
        assignments = ", ".join(f"{name} = %s" for name in fields)
        with self._connect() as conn:
            row = conn.execute(
                f"""UPDATE clothing_items SET {assignments}
                    WHERE id = %s AND user_id = %s RETURNING {CLOTHING_COLUMNS}""",
                (*fields.values(), item_id, USER_ID),
            ).fetchone()
        return ClothingItem(**row) if row else None

    def delete(self, item_id: int) -> bool:
        with self._connect() as conn:
            result = conn.execute(
                "DELETE FROM clothing_items WHERE id = %s AND user_id = %s", (item_id, USER_ID)
            )
        return result.rowcount > 0

    def toggle_favourite(self, item_id: int) -> ClothingItem | None:
        with self._connect() as conn:
            row = conn.execute(
                f"""UPDATE clothing_items SET is_favourite = NOT is_favourite
                    WHERE id = %s AND user_id = %s RETURNING {CLOTHING_COLUMNS}""",
                (item_id, USER_ID),
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

    def list(self) -> list[Outfit]:
        with self._connect() as conn:
            rows = conn.execute(self._query(), (USER_ID,)).fetchall()
        return [Outfit(**row) for row in rows]

    def get(self, outfit_id: int) -> Outfit | None:
        with self._connect() as conn:
            row = conn.execute(self._query("AND o.id = %s"), (USER_ID, outfit_id)).fetchone()
        return Outfit(**row) if row else None

    def add(self, data: OutfitCreate) -> Outfit:
        with self._connect() as conn:
            row = conn.execute(
                "INSERT INTO outfits (user_id, name, occasion) VALUES (%s, %s, %s) RETURNING id",
                (USER_ID, data.name, data.occasion),
            ).fetchone()
            outfit_id = row["id"]
            for item_id in data.item_ids:
                conn.execute(
                    "INSERT INTO outfit_items (outfit_id, clothing_item_id) VALUES (%s, %s)"
                    " ON CONFLICT DO NOTHING",
                    (outfit_id, item_id),
                )
        return self.get(outfit_id)

    def delete(self, outfit_id: int) -> bool:
        with self._connect() as conn:
            result = conn.execute(
                "DELETE FROM outfits WHERE id = %s AND user_id = %s", (outfit_id, USER_ID)
            )
        return result.rowcount > 0

    def toggle_favourite(self, outfit_id: int) -> Outfit | None:
        with self._connect() as conn:
            updated = conn.execute(
                "UPDATE outfits SET is_favourite = NOT is_favourite"
                " WHERE id = %s AND user_id = %s RETURNING id",
                (outfit_id, USER_ID),
            ).fetchone()
        return self.get(outfit_id) if updated else None
