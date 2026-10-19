"""The shared clothing catalogue.

Rather than typing every garment in by hand, a person picks the pieces they
own from this ready-made list and FitPick copies them into their wardrobe.
The catalogue is read-only and the same for everyone; a copy becomes the
user's own item the moment they choose it.

Columns: name, category, subcategory, colour, season, brand, size, price
"""

CATALOGUE = [
    # ---- Tops ----
    ("Classic White Tee", "Tops", "T-Shirt", "White", "All Season", "COS", "M", 35.0),
    ("Black Turtleneck", "Tops", "Knitwear", "Black", "F/W", "Arket", "M", 69.0),
    ("Striped Linen Shirt", "Tops", "Shirt", "White", "S/S", "Ralph Lauren", "M", 89.0),
    ("Blue Oxford Shirt", "Tops", "Shirt", "Blue", "All Season", "Gant", "M", 95.0),
    ("Navy Polo", "Tops", "Polo", "Navy", "S/S", "Lacoste", "M", 85.0),
    ("Grey Sweatshirt", "Tops", "Sweatshirt", "Grey", "F/W", "Champion", "L", 55.0),
    ("Oversized Hoodie", "Tops", "Hoodie", "Grey", "F/W", "Uniqlo", "L", 45.0),
    ("Cream Knit Jumper", "Tops", "Knitwear", "Cream", "F/W", "COS", "M", 79.0),

    # ---- Bottoms ----
    ("Dark Wash Jeans", "Bottoms", "Jeans", "Navy", "All Season", "Levi's", "32", 98.0),
    ("Slim Fit Chinos", "Bottoms", "Chinos", "Beige", "All Season", "Uniqlo", "32", 45.0),
    ("Black Tailored Trousers", "Bottoms", "Trousers", "Black", "All Season", "Zara", "32", 59.0),
    ("Denim Shorts", "Bottoms", "Shorts", "Blue", "S/S", "Levi's", "32", 48.0),
    ("Pleated Midi Skirt", "Bottoms", "Skirt", "Black", "All Season", "& Other Stories", "S", 75.0),
    ("Grey Joggers", "Bottoms", "Joggers", "Grey", "F/W", "Nike", "M", 52.0),

    # ---- Dresses ----
    ("Midi Floral Dress", "Dresses", "Midi Dress", "Blue", "S/S", "& Other Stories", "S", 110.0),
    ("Black Slip Dress", "Dresses", "Mini Dress", "Black", "All Season", "Mango", "S", 69.0),
    ("Linen Shirt Dress", "Dresses", "Shirt Dress", "Beige", "S/S", "Arket", "M", 99.0),

    # ---- Outerwear ----
    ("Navy Blazer", "Outerwear", "Blazer", "Navy", "F/W", "Zara", "M", 120.0),
    ("Camel Overcoat", "Outerwear", "Coat", "Beige", "F/W", "Massimo Dutti", "M", 210.0),
    ("Denim Jacket", "Outerwear", "Denim Jacket", "Blue", "All Season", "Levi's", "M", 95.0),
    ("Black Puffer Jacket", "Outerwear", "Jacket", "Black", "F/W", "Uniqlo", "M", 89.0),
    ("Beige Trench Coat", "Outerwear", "Trench Coat", "Beige", "All Season", "Mango", "M", 139.0),

    # ---- Shoes ----
    ("White Sneakers", "Shoes", "Sneakers", "White", "All Season", "Nike", "9", 95.0),
    ("Chelsea Boots", "Shoes", "Boots", "Black", "F/W", "Dr. Martens", "9", 160.0),
    ("Brown Loafers", "Shoes", "Loafers", "Brown", "All Season", "Clarks", "9", 110.0),
    ("Black Heels", "Shoes", "Heels", "Black", "All Season", "Zara", "6", 59.0),
    ("Running Trainers", "Shoes", "Trainers", "White", "All Season", "Adidas", "9", 85.0),

    # ---- Accessories ----
    ("Leather Tote Bag", "Accessories", "Bag", "Beige", "All Season", "Mango", "One Size", 79.0),
    ("Black Leather Belt", "Accessories", "Belt", "Black", "All Season", "Zara", "M", 29.0),
    ("Wool Scarf", "Accessories", "Scarf", "Grey", "F/W", "Acne Studios", "One Size", 120.0),
    ("Baseball Cap", "Accessories", "Cap", "Navy", "All Season", "Nike", "One Size", 25.0),
    ("Round Sunglasses", "Accessories", "Sunglasses", "Black", "S/S", "Ray-Ban", "One Size", 145.0),
    ("Silver Watch", "Accessories", "Watch", "Grey", "All Season", "Daniel Wellington", "One Size", 165.0),
]

FIELDS = ("name", "category", "subcategory", "colour", "season", "brand", "size", "price")


def entries() -> list[dict]:
    """The catalogue as dictionaries, each with a stable 1-based id."""
    return [
        {"id": index, **dict(zip(FIELDS, row))}
        for index, row in enumerate(CATALOGUE, start=1)
    ]


def find(catalogue_id: int) -> dict | None:
    for entry in entries():
        if entry["id"] == catalogue_id:
            return entry
    return None
