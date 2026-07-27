# Blog_Project — Backend (BlogProject.API)

*[Türkçe oku](README.md)*

Corporate Website & Content Management System (CMS) — backend side.
ASP.NET Core Web API, .NET 10, SQL Server (Code-First / EF Core), N-Tier architecture.

## Architecture

```
BlogProject.API/
├── Entities/        # Classes matching database tables (22 tables)
├── DTO/             # Data packets carried in/out of the API
├── Interfaces/      # Repository/Service contracts
├── Repositories/     # CRUD only — GenericRepository<T> + entity-specific repositories
├── Services/         # Business rules — dedicated services (Blog, User, Role, Auth,
│                     #   Comment, Message, Dashboard, Log, FileStorage) + a shared
│                     #   GenericCrudService for simple modules
├── Authentication/   # JWT issuing (TokenService) and login business rule (AuthService)
├── Middlewares/       # Global exception handling
├── Helpers/           # PasswordHasher, SlugGenerator, RoleNames, AutoMapper profile
├── Data/              # AppDbContext, DbSeeder
├── Migrations/        # EF Core Code-First migrations
└── Controllers/       # HTTP endpoints (presentation layer)

BlogProject.Tests/      # 25 unit/integration tests (using EF Core InMemory)
```

## What Was Built

- **22 tables**: User, Role, Permission, Blog, Category, Comment, Page, Slider, Service,
  Project, ProjectImage, Reference, Career, Application, Message, Offer, Gallery, File,
  Setting, SeoSetting, Log, RefreshToken.
- **JWT Authentication**: login, access token + refresh token (7 days, rotating), role-based
  authorization (SuperAdmin/Admin/Editor/Yazar).
- **45+ API endpoints**: listing (pagination + search), detail, create, update, delete for
  every table; clear separation between publicly accessible endpoints (reading blogs,
  submitting comments/messages/offers) and staff-only ones.
- **File upload** service (CV/image, size/format validation).
- **Dashboard** summary/recent-content/recent-activity endpoints.
- **Cross-cutting concerns**: global exception handling, CORS, Serilog logging, rate limiting.
- **25 automated tests** (login/logout scenarios, business rules, search/filtering).
- **Real database**: migrations generated and applied, verified end-to-end (real login,
  real data creation).

## Requirements

- .NET SDK 10
- SQL Server (local development uses Docker/Colima with `azure-sql-edge`)

## Running

```bash
cd BlogProject.API
dotnet restore
dotnet run
```

Swagger UI: `http://localhost:<port>/swagger`

## Database

`appsettings.Development.json` holds the real connection string (this file is excluded via
`.gitignore` and never committed). To (re)generate/apply migrations:

```bash
cd BlogProject.API
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

## Running Tests

```bash
cd BlogProject.Tests
dotnet test
```

## JWT / Authentication

- `Jwt:Key` is a secret kept in `appsettings.Development.json`.
- `POST /api/auth/login` → access token (60 min) + refresh token (7 days)
- `POST /api/auth/refresh` → rotates the refresh token, issues a new access token
- Protected endpoints require an `Authorization: Bearer <token>` header
- Default admin: `admin` / `Admin123!` (must be changed after first login)

## Documentation

- `docs/BlogProject.postman_collection.json` — Postman collection auto-generated from Swagger
- `docs/ER_DIAGRAM.md` — Entity-relationship diagram for all 22 tables (Mermaid)
