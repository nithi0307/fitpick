-- Sample data for local development

INSERT INTO users (name, email, password_hash) VALUES
    ('Nithilan', 'nithilan@example.com', 'placeholder-hash');

INSERT INTO clothing_items (user_id, name, category, colour, occasion) VALUES
    (1, 'White Oxford Shirt', 'Top',       'White', 'Formal'),
    (1, 'Navy Chinos',        'Bottom',    'Navy',  'Casual'),
    (1, 'Black Sneakers',     'Footwear',  'Black', 'Casual'),
    (1, 'Denim Jacket',       'Outerwear', 'Blue',  'Casual');

INSERT INTO outfits (user_id, name) VALUES
    (1, 'Smart Casual Friday');

INSERT INTO outfit_items (outfit_id, clothing_item_id) VALUES
    (1, 1), (1, 2), (1, 3);
