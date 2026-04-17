# Samle 📦

> **Samle** (Norwegian: *to collect*) — A subscription management app that gives you a clear overview of all your recurring payments.

---

## Tech Stack

### Backend
- **.NET 8** — Runtime
- **ASP.NET Core Web API** — REST API
- **Entity Framework Core** — ORM with SQL Server
- **xUnit** — Unit testing
- **FakeItEasy** — Mocking/faking

### Frontend
- **React 18** + **TypeScript**
- **Vite** — Build tool & dev server
- **React Router v6** — Client-side routing
- **Axios** — HTTP client
- **CSS Modules** — Scoped styling

---

## Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- SQL Server (or LocalDB for development)

---

### Backend

```bash
cd backend

# Restore packages
dotnet restore

# Apply database migrations
dotnet ef database update --project Samle.API

# Run the API (available at https://localhost:7001)
dotnet run --project Samle.API

# Run tests
dotnet test
```

The Swagger UI is available at `https://localhost:7001/swagger` in development.

---

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (available at http://localhost:5173)
npm run dev

# Build for production
npm run build
```

---

## Project Structure

```
Samle/
├── backend/
│   ├── Samle.sln
│   ├── Samle.API/
│   │   ├── Controllers/       # API endpoints
│   │   ├── Services/          # Business logic
│   │   ├── Repositories/      # Data access
│   │   ├── Models/            # Domain models
│   │   ├── DTOs/              # Data transfer objects
│   │   ├── Data/              # EF Core DbContext
│   │   └── Program.cs
│   └── Samle.Tests/
│       ├── Controllers/       # Controller tests
│       └── Services/          # Service tests
└── frontend/
    └── src/
        ├── components/
        │   ├── layout/        # Shell, sidebar, nav
        │   └── ui/            # Reusable components
        ├── pages/             # Route-level pages
        ├── hooks/             # Custom React hooks
        ├── services/          # API calls (Axios)
        └── types/             # TypeScript interfaces & enums
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subscriptions` | Get all subscriptions |
| GET | `/api/subscriptions/{id}` | Get subscription by ID |
| POST | `/api/subscriptions` | Create new subscription |
| PUT | `/api/subscriptions/{id}` | Update subscription |
| DELETE | `/api/subscriptions/{id}` | Delete subscription |
