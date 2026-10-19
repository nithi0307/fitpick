"""First-run database setup for a managed PostgreSQL instance.

Docker Compose loads schema.sql and seed.sql through the image's own
initialisation directory. A hosted database has no such hook, so the
application applies them itself on startup. Both steps are idempotent:
the schema uses CREATE TABLE IF NOT EXISTS, and the seed is skipped
unless the wardrobe is empty.
"""

import logging
import pathlib

logger = logging.getLogger("fitpick.bootstrap")

SQL_DIR = pathlib.Path(__file__).parent / "database"
if not SQL_DIR.is_dir():                      # running from a source checkout
    SQL_DIR = pathlib.Path(__file__).parent.parent / "database"


def _read(name: str) -> str:
    return (SQL_DIR / name).read_text()


def prepare_database(dsn: str) -> None:
    """Create the tables if they are missing and seed an empty wardrobe."""
    import psycopg

    with psycopg.connect(dsn) as conn:
        conn.execute(_read("schema.sql"))
        logger.info("schema applied")

        row = conn.execute("SELECT COUNT(*) FROM clothing_items").fetchone()
        if row and row[0] == 0:
            conn.execute(_read("seed.sql"))
            logger.info("sample wardrobe seeded")
        else:
            logger.info("wardrobe already contains data; seed skipped")
