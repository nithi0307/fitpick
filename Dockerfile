# Production image: builds the React app, then serves it from the FastAPI
# container so the whole system is one deployable unit with no CORS coupling.
# Local development still uses docker-compose.yml (two containers, hot reload).

# ---------- stage 1: build the frontend ----------
FROM node:20-alpine AS web

WORKDIR /web
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ---------- stage 2: the application ----------
FROM python:3.13-slim

WORKDIR /app

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
COPY database/ ./database/
COPY --from=web /web/dist ./static

EXPOSE 8000

# Render, Railway and Fly all supply $PORT; default to 8000 elsewhere.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
