# FitPick — Demo Script

A seven-minute walkthrough, plus what to say and what to have ready.
**Do** = what you click. **Say** = roughly what you say while clicking.

---

## Before you start (do this 5 minutes early)

```bash
cd ~/Desktop/fitpick
docker compose up -d          # frontend 5173, backend 8000, PostgreSQL 5433
```

Check all three are up:

```bash
docker compose ps
curl -s localhost:8000/health
```

Then open three browser tabs and leave them ready:

| Tab | URL | Used in |
|---|---|---|
| 1 | http://localhost:5173 | the whole demo |
| 2 | http://localhost:8000/docs | Part 7 |
| 3 | GitHub repo | Part 7 |

Have a terminal open at `~/Desktop/fitpick/backend` for the test run.

**Reset to a clean start:** open the app, click your avatar → **Log out**. The demo
begins from the login screen.

---

## Part 1 — The problem (30 seconds)

**Do:** Stay on the login screen.

**Say:**
> People own far more clothes than they wear. Things get forgotten at the back of
> a wardrobe, near-duplicates get bought, and the outfit that worked last month is
> never written down. The real problem is that a wardrobe has no index — you can't
> search it, filter it, or save a combination.
>
> FitPick gives the wardrobe a digital index. It's a React front end, a FastAPI
> REST backend and a PostgreSQL database, all running in Docker.

---

## Part 2 — Signing up, and an empty wardrobe (1 minute)

**Do:**
1. Click **Create Account**.
2. Enter your own name and email, any password.
3. Click **Create Account**.

**Say:**
> I'll sign up as myself. Notice the app picks up my name — the sidebar, the
> avatar initials and the greeting all come from what I just typed.

**Do:** Click **My Wardrobe**.

**Say:**
> And my wardrobe is completely empty, because wardrobes are per-account. The
> `clothing_items` table has a `user_id` foreign key, and every query is scoped
> to the signed-in user, so two accounts can never see each other's clothes.
> There's an integration test that proves exactly that.

> I should be clear: there's no real authentication yet. The name and email
> identify the account, they don't authenticate it. Hashed passwords and sessions
> are listed as future work.

---

## Part 3 — Building a wardrobe from the catalogue (1 minute 30)

**Do:** Click **Dashboard**.

**Say:**
> Because my wardrobe is empty, the dashboard leads with the clothing catalogue —
> 33 ready-made garments across the six categories. This is the answer to the
> most tedious part of an app like this: nobody wants to type in or photograph
> forty garments.

**Do:**
1. Click the **Tops** filter, add **Classic White Tee** and **Grey Sweatshirt**.
2. Click **Bottoms**, add **Dark Wash Jeans**.
3. Click **Shoes**, add **White Sneakers** and **Chelsea Boots**.
4. Click **Outerwear**, add **Navy Blazer**.

**Say:**
> Browsing the catalogue changes nothing — only choosing does. Each piece is
> copied into my wardrobe as my own item, and watch the statistics at the top
> update live as I pick.

> The garments are drawn as SVG from their category and colour, so the wardrobe
> looks consistent from the very first item without shipping any photographs.

**Point out:** the green **In wardrobe** badge on pieces already chosen.

---

## Part 4 — Browse, search, filter, remove (1 minute)

**Do:** Click **My Wardrobe**.

**Say:**
> Here's everything I picked, sorted into categories automatically.

**Do:**
1. Type `levi` in the search box.

**Say:**
> Search matches the brand as well as the name — that was a defect I found and
> there's a regression test locking it in.

2. Clear the search, click the **Shoes** filter, then **All**.
3. Change the sort to **Most worn**.

**Say:**
> Filtering and sorting happen on the server, so the same rules apply whatever
> client is calling the API.

**Do:** Hover a card, click the **bin** icon, then **Cancel**, then do it again and
click **Remove**.

**Say:**
> Removing is destructive, so the card asks first — one click never deletes
> anything. The delete goes through to PostgreSQL, and because `outfit_items`
> cascades, the piece disappears from any outfit that used it too.

---

## Part 5 — The outfit builder (1 minute)

**Do:** Click **Outfit Builder**.

**Say:**
> Three columns: pick pieces on the left, the outfit takes shape in the middle,
> and the right column names it and sets the occasion.

**Do:**
1. Select a top, a bottom and a pair of shoes.
2. Name it something like `Monday Lectures`, choose **Casual**.
3. Click **Save Outfit**.

**Say:**
> An outfit and its pieces are a many-to-many relationship, so there's a join
> table — `outfit_items` — rather than a list stuffed into a column. The API
> refuses an outfit with no items, and refuses any item id that doesn't exist.

**Do:** It lands on **My Fits**. Point at the new card.

**Say:**
> Each saved outfit is numbered — Fit 1, Fit 2 — and scored out of ten. That
> score is a rule-based model, not AI and not random: four points for coverage,
> three for colour, two for season consistency, one for matching the occasion.
> The same pieces always give the same score, and every point is spelled out
> underneath so it can be argued with.

**Do:** Point at a lower-scoring fit and read its reason aloud.

---

## Part 6 — Analytics (45 seconds)

**Do:** Click **Analytics**.

**Say:**
> Every figure here is calculated by the backend from my own items — total value,
> average wears per item, the category donut, the colour breakdown. The charts are
> hand-drawn SVG; a charting library would have added about 100 kB for two shapes.
>
> This is also where mutation testing paid off: the calculations behind these
> numbers started at a 60% mutation score, and the eleven unit tests I added to
> kill the surviving mutants took it to 100%.

---

## Part 7 — Under the hood (1 minute 30)

**Do:** Switch to tab 2 — `localhost:8000/docs`.

**Say:**
> The API documents itself. FastAPI generates this from the Pydantic schemas, so
> the documentation can't drift from the code. Seventeen REST endpoints across
> clothing, outfits, the catalogue and statistics (eighteen counting the dev-only
> service banner).

**Do:** Expand `GET /clothing` to show the query parameters.

**Do:** Switch to the terminal:

```bash
cd ~/Desktop/fitpick/backend
.venv/bin/python -m pytest
```

**Say:**
> Seventy-six tests — integration tests that drive the real app over HTTP, a
> regression suite for defects I'd already fixed once, and unit tests for the
> calculations. They run in under a second because they use the in-memory
> repository; the same code runs against PostgreSQL in Docker because both
> implement one repository interface.

**Do:** Switch to tab 3 — GitHub.

**Say:**
> Everything's here: the code, the tests, editable Draw.io sources for the
> architecture, DFD, ERD and UML diagrams, and both reports.

---

## Likely questions — and honest answers

**"Is the login real?"**
> No. The name and email identify the account so wardrobes are kept separate, but
> nothing is authenticated and no password is stored. The schema has a
> `password_hash` column ready for it. It's listed as future work, and the user
> stories for login and registration are marked "UI only" in the report rather
> than claimed as done.

**"Where do the clothing images come from?"**
> They're SVG drawings generated from each garment's category and colour — twenty
> shapes. No stock photos, so no licensing issue and no storage cost. Photo upload
> is the next step; the `image_url` column already exists.

**"Why PostgreSQL and not just a file?"**
> The data is genuinely relational: a user owns many items, an outfit contains
> many items, and an item can appear in many outfits. Foreign keys with cascade
> deletes keep it consistent without any clean-up code in the application.

**"How would you add a feature?"**
> One router on the backend and one page on the front end. The routers depend on
> a repository interface, not on a database, so adding a feature doesn't touch
> storage, and swapping storage doesn't touch any endpoint.

**"Is the outfit rating AI?"**
> No, and the report says so. It's a rule-based score in
> `services/style_service.py` — coverage, colour harmony, season consistency and
> occasion match. It's deterministic, so it's testable: twelve unit tests cover
> the rules. Calling it AI would have been easy and dishonest.

**"What was the hardest part?"**
> Finding out that passing tests don't mean good tests. Mutation testing changed
> twelve mutants that survived into eleven new unit tests, and the score went from
> 60% to 100% — without any production code being wrong.

---

## If something breaks

| Symptom | Fix |
|---|---|
| Page loads but is empty, "Could not reach the FitPick API" | `docker compose restart backend`, wait 10 seconds |
| Nothing responds at all | `docker compose up -d`, then `docker compose ps` |
| Wardrobe shows the wrong account | Avatar → **Log out**, sign in again |
| You want to start completely fresh | Sign up with a different email — it's an empty wardrobe |

**Fallback:** if the live app fails entirely, every screen is captured in
`docs/screenshots/` and in the Testing report — talk over those instead and come
back to the live app afterwards.
