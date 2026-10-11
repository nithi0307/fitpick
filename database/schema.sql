-- FitPick database schema (PostgreSQL 16)
-- Loaded automatically by the database container on first start.

CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clothing_items (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name         VARCHAR(100) NOT NULL,
    category     VARCHAR(50)  NOT NULL,  -- Tops, Bottoms, Outerwear, Shoes, Dresses, Accessories
    subcategory  VARCHAR(50)  NOT NULL DEFAULT '',
    colour       VARCHAR(50)  NOT NULL,
    season       VARCHAR(20)  NOT NULL DEFAULT 'All Season',  -- S/S, F/W, All Season
    brand        VARCHAR(80)  NOT NULL DEFAULT '',
    size         VARCHAR(20)  NOT NULL DEFAULT '',
    price        NUMERIC(8,2) NOT NULL DEFAULT 0,
    tags         TEXT[]       NOT NULL DEFAULT '{}',
    notes        TEXT         NOT NULL DEFAULT '',
    image_url    TEXT,
    is_favourite BOOLEAN      NOT NULL DEFAULT FALSE,
    times_worn   INTEGER      NOT NULL DEFAULT 0,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS outfits (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name         VARCHAR(100) NOT NULL,
    occasion     VARCHAR(50)  NOT NULL DEFAULT 'Casual',
    is_favourite BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Join table: which clothing items make up an outfit (many-to-many)
CREATE TABLE IF NOT EXISTS outfit_items (
    outfit_id        INTEGER NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
    clothing_item_id INTEGER NOT NULL REFERENCES clothing_items(id) ON DELETE CASCADE,
    PRIMARY KEY (outfit_id, clothing_item_id)
);

CREATE INDEX IF NOT EXISTS idx_clothing_user     ON clothing_items (user_id);
CREATE INDEX IF NOT EXISTS idx_clothing_category ON clothing_items (category);
CREATE INDEX IF NOT EXISTS idx_outfits_user      ON outfits (user_id);
