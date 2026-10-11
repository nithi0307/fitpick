-- Sample wardrobe for local development (mirrors backend/seed_data.py)

INSERT INTO users (name, email, password_hash) VALUES
    ('Jamie Anderson', 'jamie@email.com', 'placeholder-hash');

INSERT INTO clothing_items
    (user_id, name, category, subcategory, colour, season, brand, size, price, tags, times_worn, is_favourite, created_at)
VALUES
    (1, 'Classic White Tee', 'Tops', 'T-Shirt', 'White', 'All Season', 'COS', 'M', 35.0, ARRAY['Casual']::TEXT[], 14, TRUE, NOW() - INTERVAL '0 days'),
    (1, 'Slim Fit Chinos', 'Bottoms', 'Trousers', 'Beige', 'All Season', 'Uniqlo', '32', 45.0, ARRAY['Casual', 'Office']::TEXT[], 11, FALSE, NOW() - INTERVAL '3 days'),
    (1, 'Navy Blazer', 'Outerwear', 'Blazer', 'Navy', 'F/W', 'Zara', 'M', 120.0, ARRAY['Office', 'Formal']::TEXT[], 9, TRUE, NOW() - INTERVAL '6 days'),
    (1, 'White Sneakers', 'Shoes', 'Sneakers', 'White', 'All Season', 'Nike', '9', 95.0, ARRAY['Casual']::TEXT[], 22, TRUE, NOW() - INTERVAL '9 days'),
    (1, 'Black Turtleneck', 'Tops', 'Knitwear', 'Black', 'F/W', 'Arket', 'M', 69.0, ARRAY['Office']::TEXT[], 9, FALSE, NOW() - INTERVAL '12 days'),
    (1, 'Midi Floral Dress', 'Dresses', 'Midi Dress', 'Blue', 'S/S', '& Other Stories', 'S', 110.0, ARRAY['Date Night']::TEXT[], 5, TRUE, NOW() - INTERVAL '15 days'),
    (1, 'Grey Sweatshirt', 'Tops', 'Sweatshirt', 'Grey', 'F/W', 'Champion', 'L', 55.0, ARRAY['Weekend', 'Sport']::TEXT[], 18, FALSE, NOW() - INTERVAL '18 days'),
    (1, 'Dark Wash Jeans', 'Bottoms', 'Jeans', 'Navy', 'All Season', 'Levi''s', '32', 98.0, ARRAY['Casual']::TEXT[], 25, TRUE, NOW() - INTERVAL '21 days'),
    (1, 'Leather Tote Bag', 'Accessories', 'Bag', 'Beige', 'All Season', 'Mango', 'One Size', 79.0, ARRAY['Office']::TEXT[], 20, FALSE, NOW() - INTERVAL '24 days'),
    (1, 'Camel Overcoat', 'Outerwear', 'Coat', 'Beige', 'F/W', 'Massimo Dutti', 'M', 210.0, ARRAY['Office', 'Formal']::TEXT[], 8, TRUE, NOW() - INTERVAL '27 days'),
    (1, 'Striped Linen Shirt', 'Tops', 'Shirt', 'White', 'S/S', 'Ralph Lauren', 'M', 89.0, ARRAY['Weekend']::TEXT[], 10, FALSE, NOW() - INTERVAL '30 days'),
    (1, 'Chelsea Boots', 'Shoes', 'Boots', 'Black', 'F/W', 'Dr. Martens', '9', 160.0, ARRAY['Office', 'Casual']::TEXT[], 10, TRUE, NOW() - INTERVAL '33 days');

INSERT INTO outfits (user_id, name, occasion, is_favourite) VALUES
    (1, 'Business Casual Friday', 'Office', TRUE),
    (1, 'Weekend Coffee Run', 'Weekend', FALSE),
    (1, 'Dinner Date', 'Date Night', TRUE);

INSERT INTO outfit_items (outfit_id, clothing_item_id)
SELECT o.id, c.id FROM outfits o JOIN clothing_items c ON (
    (o.id = 1 AND c.id IN (3, 8, 4))
    OR
    (o.id = 2 AND c.id IN (7, 2, 4))
    OR
    (o.id = 3 AND c.id IN (6, 12, 9))
);
