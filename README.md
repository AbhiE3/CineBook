# 🎬 CineBook

Movie ticket booking platform — **Spring Boot 3.3 + Java 21** backend, **Angular 17 + Tailwind** frontend, **MySQL 8** database (`cinebook`).

> This build is a from-scratch version modeled on the reference project, with **JWT authentication, coupons, and discounts removed**. Auth is simple/stateless (login returns the user, stored in `localStorage`; identity is passed via `X-User-Id` / `X-Role` request headers). Passwords are stored in plaintext (demo).

## Status — Day 1 (Scaffold + DB + Auth)
- ✅ Backend: all 7 JPA entities matching the schema, repositories, simple auth (register / register-admin / login), CORS, global error handler.
- ✅ Frontend: Angular shell, navbar, login + register (Moviegoer / Theater-Owner) pages, auth service + interceptors + guards.
- ⏭️ Day 2+: movies, theaters, shows, seat picker, bookings, reviews, interests, analytics.

## Prerequisites
| Tool | Version |
|---|---|
| JDK | 21 |
| Node.js | 18 or 20 LTS recommended (Node 25 builds with a warning) |
| MySQL | 8 (running locally) |

Maven is **not** required — the backend ships the Maven Wrapper (`mvnw` / `mvnw.cmd`).

## Run

### 1. Database
The backend points at `jdbc:mysql://localhost:3306/cinebook?createDatabaseIfNotExist=true`, so the DB is created automatically on first boot. Set credentials via env vars (defaults: `root` / `root`):

```powershell
$env:DB_USER = "root"
$env:DB_PASSWORD = "<your-mysql-password>"
```

### 2. Backend (port 8181)
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
Hibernate (`ddl-auto=update`) creates all tables on boot.

### 3. Frontend (port 4200)
```powershell
cd frontend
npm install --legacy-peer-deps
npm start
```
The dev server proxies `/api` → `http://localhost:8181` (see `proxy.conf.json`).

## Auth API (Day 1)
| Method | Endpoint | Body | Returns |
|---|---|---|---|
| POST | `/api/auth/register` | `{username, password}` | `{id, username, role, theaterId}` |
| POST | `/api/auth/register-admin` | `{username, password, theaterName, theaterLocation}` | `{id, username, role, theaterId}` |
| POST | `/api/auth/login` | `{username, password}` | `{id, username, role, theaterId}` |

## Project structure
```
CineBook/
├── backend/    # Spring Boot — com.cinebook.{entity,repository,dto,service,controller,config,exception}
└── frontend/   # Angular 17 — src/app/{core,shared,features}
```
