# Vita OpenRestor Dashboard

Dashboard for the OpenRestore benchmark: leaderboard of submitted models and a data
download section _(WIP — repository is an initialized skeleton)_.

## Requirements

- [uv](https://docs.astral.sh/uv/) — Python package/project manager
- [npm](https://docs.npmjs.com/) — Node.js package manager
- [Docker](https://docs.docker.com/) — for PostgreSQL
- Make

## Deploying locally

Clone the repository and set up your environment:

```bash
git clone
cd vita-openrestor
make install
```

Fill the values in the `.env` file (PostgreSQL user, password, database name).

### Backend (FastAPI)

```bash
make run-db       # start PostgreSQL (docker compose)
make run-backend  # FastAPI + Swagger UI
```

The interactive API documentation is available at http://localhost:8000/docs.

### Frontend (Quasar)

```bash
make run-frontend
```

The website will be available at http://localhost:9000.

## Project structure

- `backend/` — FastAPI application (Python 3.13, uv, alembic migrations, pytest)
- `frontend/` — Quasar/Vue application (TypeScript, prettier/eslint)
- `docker-compose.yml` — PostgreSQL service
- `.github/workflows/` — CI (backend checks/tests, frontend checks)
