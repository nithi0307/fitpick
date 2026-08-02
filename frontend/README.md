# FitPick

## Project Overview

FitPick is a web-based Digital Wardrobe and Outfit Planner that helps users organize their clothing, create outfits, and manage their wardrobe digitally. Instead of manually remembering what clothes they own, users can browse their wardrobe, save outfit combinations, and quickly plan outfits for different occasions.

---

## Problem it Solves

Many people own numerous clothing items but struggle to keep track of them, resulting in repeated purchases, difficulty planning outfits, and inefficient wardrobe management. FitPick provides a centralized platform that digitally organizes clothing items and simplifies outfit planning.

---

## Target Users (Personas)

### Persona 1 – College Student

- Age: 18–25
- Needs quick outfit planning for college and events.
- Wants an easy way to organize casual and formal clothing.

### Persona 2 – Working Professional

- Age: 22–40
- Frequently plans outfits for work.
- Wants to save professional outfit combinations.

### Persona 3 – Fashion Enthusiast

- Age: 18–35
- Enjoys experimenting with outfits.
- Wants to maintain a digital wardrobe with categorized clothing.

---

## Vision Statement

To provide users with a simple, modern, and organized platform that makes wardrobe management effortless while helping them create and save stylish outfit combinations.

---

## Key Features / Goals

- User Registration & Login
- Digital Wardrobe Management
- Add, Edit and Delete Clothing
- Clothing Categories
- Search & Filters
- Outfit Builder
- Favourite Outfits
- Wardrobe Statistics
- User Profile

---

## Success Metrics

- Users can successfully organize clothing items.
- Users can create and save outfit combinations.
- Clothing can be searched and filtered efficiently.
- The application provides a clean and user-friendly interface.

---

## Assumptions

- Users have internet access.
- Users upload clear clothing images.
- Each user manages only their own wardrobe.

---

## Constraints

- Internet connection required.
- Initial version supports only registered users.
- AI outfit recommendations are outside the scope of this version.
---

# Folder Structure

```text
fitpick/
├── frontend/
├── backend/
├── database/
│   ├── datasets/
│   ├── schema.sql
│   └── seed.sql
├── docker/
├── docs/
│   ├── architecture/
│   ├── wireframes/
│   ├── screenshots/
│   └── report/
├── README.md
├── docker-compose.yml
└── .gitignore
```

---

# Technology Stack

| Component | Technology |
|----------|------------|
| Frontend | React (Vite) |
| Backend | FastAPI |
| Database | PostgreSQL |
| Version Control | Git & GitHub |
| Containerization | Docker |
| UI Design | Figma |
| Architecture Diagram | Draw.io |

---

# Branching Strategy

This project follows the GitHub Flow branching strategy.

- **main** – Stable production-ready branch
- **feature/*** – Used for developing individual features

Example feature branches:

- feature-login
- feature-dashboard
- feature-outfit-builder

Each feature is developed independently and merged into the `main` branch after testing.

---

# Quick Start

### Clone Repository

```bash
git clone https://github.com/nithi0307/fitpick.git
```

### Navigate to Project

```bash
cd fitpick
```

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at:

```
http://localhost:5173
```

---

# Local Development Tools

- Visual Studio Code
- Node.js
- React + Vite
- FastAPI
- PostgreSQL
- Docker Desktop
- Git
- GitHub

---

# Future Enhancements

- AI-based outfit recommendations
- Weather-based outfit suggestions
- Mobile application support
- Barcode scanning for clothing
- Outfit sharing with friends
- Wardrobe analytics dashboard

---

# Authors

Nithilan A

Software Engineering Project