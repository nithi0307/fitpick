# FitPick — frontend

React 19 + Vite single-page application. Six screens, a shared component
library and one API client module.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle
npm run lint
```

The backend address defaults to `http://localhost:8000` and can be overridden
with `VITE_API_URL`.

```
src/
├── App.jsx              route table
├── pages/               Login, Dashboard, Wardrobe, AddClothing,
│                        OutfitBuilder, Profile
├── components/          Layout, Sidebar, Topbar, Button, Card, ItemCard,
│                        Charts, Garment, Icon, HeroArt
├── services/api.js      the only module that calls the backend
└── styles/global.css    design tokens and shared component styles
```

See the repository root README for the full project.
