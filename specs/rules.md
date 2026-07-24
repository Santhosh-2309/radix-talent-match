# Coding Conventions

- **Secrets**: No hardcoded secrets. Use `.env` only. It MUST be in `.gitignore` from the FIRST commit.
- **Imports**: Consistent relative imports within `backend/`. Never `from backend.X import Y`, always `from X import Y` (assume uvicorn runs from `backend/` directory).
- **Data Contracts**: Use Pydantic models for all data contracts.
- **Project Structure**: One module = one folder under `backend/`.
