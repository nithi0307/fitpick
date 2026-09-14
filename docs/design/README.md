# FitPick – Design Deliverables

This folder contains the editable sources and exports for the FitPick software design (Digital Assignment 2).

```
docs/design/
├── architecture/
│   ├── fitpick-architecture.drawio   # editable Draw.io source
│   └── fitpick-architecture.png      # PNG export
├── wireframes/                       # screenshots of the six Figma screens
│   ├── 01-login.png
│   ├── 02-dashboard.png
│   ├── 03-wardrobe.png
│   ├── 04-add-clothing.png
│   ├── 05-outfit-builder.png
│   └── 06-profile.png
├── FitPick-Software-Design-Document.pdf
└── README.md
```

## Architecture

![Architecture](architecture/fitpick-architecture.png)

Layered / three-tier architecture: React frontend → FastAPI REST backend → PostgreSQL database, orchestrated with Docker Compose. Open the `.drawio` file at https://app.diagrams.net to edit it.

## UI screens (Figma)

| # | Screen | File |
|---|---|---|
| 1 | Login / Sign Up | `wireframes/01-login.png` |
| 2 | Dashboard | `wireframes/02-dashboard.png` |
| 3 | My Wardrobe | `wireframes/03-wardrobe.png` |
| 4 | Add Clothing Item | `wireframes/04-add-clothing.png` |
| 5 | Outfit Builder | `wireframes/05-outfit-builder.png` |
| 6 | Profile & Analytics | `wireframes/06-profile.png` |
