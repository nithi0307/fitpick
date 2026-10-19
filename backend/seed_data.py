"""Sample wardrobe used by the in-memory repository and mirrored in seed.sql.

The demo account owns this wardrobe. A person who signs in with any other
email starts with an empty wardrobe of their own.
"""

DEMO_USER = ("Jamie Anderson", "jamie@email.com")

CLOTHING_SEED = [
    # name, category, subcategory, colour, season, brand, size, price, tags, worn, fav
    ("Classic White Tee", "Tops", "T-Shirt", "White", "All Season", "COS", "M", 35.0, ["Casual"], 14, True),
    ("Slim Fit Chinos", "Bottoms", "Trousers", "Beige", "All Season", "Uniqlo", "32", 45.0, ["Casual", "Office"], 11, False),
    ("Navy Blazer", "Outerwear", "Blazer", "Navy", "F/W", "Zara", "M", 120.0, ["Office", "Formal"], 9, True),
    ("White Sneakers", "Shoes", "Sneakers", "White", "All Season", "Nike", "9", 95.0, ["Casual"], 22, True),
    ("Black Turtleneck", "Tops", "Knitwear", "Black", "F/W", "Arket", "M", 69.0, ["Office"], 9, False),
    ("Midi Floral Dress", "Dresses", "Midi Dress", "Blue", "S/S", "& Other Stories", "S", 110.0, ["Date Night"], 5, True),
    ("Grey Sweatshirt", "Tops", "Sweatshirt", "Grey", "F/W", "Champion", "L", 55.0, ["Weekend", "Sport"], 18, False),
    ("Dark Wash Jeans", "Bottoms", "Jeans", "Navy", "All Season", "Levi's", "32", 98.0, ["Casual"], 25, True),
    ("Leather Tote Bag", "Accessories", "Bag", "Beige", "All Season", "Mango", "One Size", 79.0, ["Office"], 20, False),
    ("Camel Overcoat", "Outerwear", "Coat", "Beige", "F/W", "Massimo Dutti", "M", 210.0, ["Office", "Formal"], 8, True),
    ("Striped Linen Shirt", "Tops", "Shirt", "White", "S/S", "Ralph Lauren", "M", 89.0, ["Weekend"], 10, False),
    ("Chelsea Boots", "Shoes", "Boots", "Black", "F/W", "Dr. Martens", "9", 160.0, ["Office", "Casual"], 10, True),
]

OUTFIT_SEED = [
    ("Business Casual Friday", "Office", ["Navy Blazer", "Dark Wash Jeans", "White Sneakers"], True),
    ("Weekend Coffee Run", "Weekend", ["Grey Sweatshirt", "Slim Fit Chinos", "White Sneakers"], False),
    ("Dinner Date", "Date Night", ["Midi Floral Dress", "Chelsea Boots", "Leather Tote Bag"], True),
]
