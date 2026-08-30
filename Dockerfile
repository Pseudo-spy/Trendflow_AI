# TrendWear AI — Backend runtime image (Render / Docker)
# Runs the FastAPI app with sibling packages (optimization/, ml/, services/, risk_service/)
# importable via the sys.path injection in backend/app/main.py.
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install Python dependencies (backend requirements, which cover the whole runtime).
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy the full monorepo so sibling packages are available next to `backend/`.
COPY . .

EXPOSE 8000

# `--app-dir backend` lets uvicorn import `app.main`; main.py adds the repo
# root (parents[2]) to sys.path for optimization/ml/services/risk_service.
CMD ["uvicorn", "app.main:app", "--app-dir", "backend", "--host", "0.0.0.0", "--port", "8000"]
