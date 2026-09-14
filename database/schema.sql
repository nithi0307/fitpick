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
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name       VARCHAR(100) NOT NULL,
    category   VARCHAR(50) NOT NULL,   -- Top, Bottom, Outerwear, Footwear, Accessory
    colour     VARCHAR(50) NOT NULL,
    occasion   VARCHAR(50) NOT NULL,   -- Casual, Formal, Sport, Party
    image_url  TEXT,
    is_favourite BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS outfits (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name         VARCHAR(100) NOT NULL,
    is_favourite BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Join table: which clothing items make up an outfit
CREATE TABLE IF NOT EXISTS outfit_items (
    outfit_id        INTEGER NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
    clothing_item_id INTEGER NOT NULL REFERENCES clothing_items(id) ON DELETE CASCADE,
    PRIMARY KEY (outfit_id, clothing_item_id)
);
