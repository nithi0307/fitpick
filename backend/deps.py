"""Request-scoped identity.

FitPick has no authentication yet. The frontend sends the signed-in person's
email and display name as headers; this module turns that into a row in the
users table so every wardrobe is stored against its owner. It identifies a
user, it does not authenticate one — real sign-in is listed as future work.

Requests without the header fall back to the demo account, which keeps the
seeded sample wardrobe used by the screenshots and the test suite.
"""

from urllib.parse import unquote

from fastapi import Depends, Header

from repositories import get_user_repository
from repositories.base import UserRepository

DEMO_EMAIL = "jamie@email.com"
DEMO_NAME = "Jamie Anderson"


def current_user_id(
    x_user_email: str | None = Header(default=None),
    x_user_name: str | None = Header(default=None),
    users: UserRepository = Depends(get_user_repository),
) -> int:
    email = (x_user_email or DEMO_EMAIL).strip().lower()
    name = unquote(x_user_name or DEMO_NAME).strip() or email
    return users.get_or_create(email=email, name=name).id
