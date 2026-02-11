Auth Frontend (Vite + React)

Quick start:

1. Install dependencies

```bash
cd Web
npm install
```

2. Run dev server

```bash
npm run dev
```

Configuration:
- API base URL can be set via environment variable `VITE_API_BASE`. Default: `http://localhost:8080/api`

Backend endpoints expected:
- POST /auth/register {username, email, password}
- POST /auth/login {usernameOrEmail, password} -> { token }
- GET /auth/me -> profile

Notes:
- This is a minimal scaffold implementing registration, login, protected dashboard, and JWT storage in localStorage.
- Replace API endpoints to match your Spring Boot backend paths.
