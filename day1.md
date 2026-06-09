# 🎬 CineBook — Day 1 Log

**Date:** 2026-06-09
**Theme of the day:** Scaffold + Database + Authentication (foundation build)

CineBook is a movie‑ticket‑booking platform built with a **Spring Boot 3.3 / Java 21** backend, an **Angular 17 + Tailwind CSS** frontend, and a **MySQL 8** database (`cinebook`). This build is a from‑scratch version modeled on a reference project, deliberately **without JWT, coupons, or discounts** — authentication is simple and stateless.

---

## 1. What we built today (high level)

| Area | Delivered |
|---|---|
| **Backend** | All 7 JPA entities + enums, 7 repositories, simple auth (register / register‑admin / login), CORS config, global error handler |
| **Frontend** | Angular shell, navbar, login + register pages, auth service, identity/error interceptors, route guards, icon set |
| **DB** | Schema auto‑created on boot via Hibernate `ddl-auto=update` |
| **Session fixes/refactors** | Fixed dev‑server proxy 404, converted the whole UI to a **light theme**, migrated all components to a **flat 3‑file naming convention** |

---

## 2. Features developed today (detailed)

### 2.1 Authentication (stateless, no JWT)
The core deliverable of Day 1. Three flows are fully working end‑to‑end:

- **Moviegoer registration** — `POST /api/auth/register` with `{username, password}`. Creates a `USER`‑role account.
- **Theater‑owner registration** — `POST /api/auth/register-admin` with `{username, password, theaterName, theaterLocation}`. Creates an `ADMIN`‑role account **and** its associated `Theater` record, linking the two.
- **Login** — `POST /api/auth/login` with `{username, password}`. Returns the user record.

All three return the same shape: `{ id, username, role, theaterId }`.

**How identity works instead of tokens:**
- On success the user object is stored in `localStorage` (`cinebook.user`) and held in an Angular **signal** ([auth.service.ts](frontend/src/app/core/services/auth.service.ts)), so the session survives page reloads.
- Every outgoing HTTP request is decorated by the **identity interceptor** ([identity.interceptor.ts](frontend/src/app/core/interceptors/identity.interceptor.ts)) with `X-User-Id` and `X-Role` headers — the stateless replacement for a bearer token.
- A **401 error interceptor** ([error.interceptor.ts](frontend/src/app/core/interceptors/error.interceptor.ts)) clears the session and redirects to `/login`.

> ⚠️ **Demo‑grade security:** passwords are stored in **plaintext** and identity is trust‑based via headers. This is intentional for the build exercise and must not ship to production.

### 2.2 Route protection (guards)
- **`authGuard`** ([auth.guard.ts](frontend/src/app/core/guards/auth.guard.ts)) — blocks the home route for anonymous users, redirecting to `/login`. Currently applied to `/`.
- **`adminGuard`** ([admin.guard.ts](frontend/src/app/core/guards/admin.guard.ts)) — written and ready; gates admin‑only areas (redirects non‑admins to `/` or `/login`). **Not yet wired to a route** because the admin screens don't exist yet.

### 2.3 Frontend shell & UI
- **Navbar** ([navbar.html](frontend/src/app/shared/navbar.html)) — brand logo, location indicator, signed‑in user + role badge, login/logout actions.
- **Login page** ([login.html](frontend/src/app/features/auth/login.html)) — username/password form with loading + error states.
- **Register page** ([register.html](frontend/src/app/features/auth/register.html)) — a **Moviegoer / Theater‑Owner toggle**; theater fields appear only in owner mode.
- **Home page** ([home.html](frontend/src/app/features/home/home.html)) — a welcome screen with placeholder cards ("Browse movies", "Book seats", "My bookings") flagged as coming in later builds.
- **Icon component** ([icon.html](frontend/src/app/shared/icon.html)) — a lightweight inline‑SVG (Lucide‑style) icon set: `film`, `ticket`, `user`, `lock`, `log-out`, `map-pin`, `chevron-down`, `loader`.
- **Location service** ([location.service.ts](frontend/src/app/core/services/location.service.ts)) — persists a chosen city to `localStorage`, ready to filter the catalog later.

### 2.4 Backend domain model (ready for Day 2+)
All 7 entities and their Spring Data repositories exist now, so the data layer is ahead of the UI:

| Entity | Purpose |
|---|---|
| `User` | Accounts (USER / ADMIN role) |
| `Theater` | Owner‑managed venue |
| `Movie` | Catalog title (genre, duration, languages, price, poster, trailer, soft‑delete flag) |
| `Show` | A movie screening at a theater (time, language, price, seat counts) |
| `Booking` | A reservation (seats, subtotal, tax, total, refund, status, timestamps) |
| `Review` | User rating/review of a movie |
| `MovieInterest` | "Notify me / interested" signal for a movie |

Supporting pieces: `Role` & `BookingStatus` enums, `CorsConfig`, `ApiException` + `GlobalExceptionHandler`. The matching TypeScript models already exist on the frontend ([catalog.model.ts](frontend/src/app/core/models/catalog.model.ts)) for use from Day 2.

---

## 3. Session fixes & refactors done today

These were carried out on top of the base Day‑1 scaffold during this working session:

### 3.1 Fixed the registration 404 (proxy wiring)
Registration was failing with `POST http://localhost:4200/api/auth/register-admin 404`. Cause: [proxy.conf.json](frontend/proxy.conf.json) correctly routed `/api → http://localhost:8181`, but [angular.json](frontend/angular.json) never referenced it, so the dev server ignored the proxy and the call hit the Angular server instead of Spring Boot. **Fix:** added `"proxyConfig": "proxy.conf.json"` to the `serve` target's options. (Requires an `ng serve` restart to take effect.)

### 3.2 Converted the UI from dark to light theme
The dark look came entirely from shared theme tokens, so the conversion was centralized:
- [tailwind.config.js](frontend/tailwind.config.js) — repurposed the `ink` palette from near‑black to a **light neutral scale** (`950` = app background `#f4f6f8`, `900` = white surfaces, `700`/`600` = borders); kept the **tomato/red brand accent**.
- [styles.css](frontend/src/styles.css) — body text → dark; inputs, ghost buttons, and cards relit; card shadow softened.
- Text colors across navbar/login/register/home were retuned for contrast on white (labels `gray-700`, captions `gray-500`, links `tomato-600`).

### 3.3 Migrated to a flat, 3‑file component convention
Every component was restructured to **`[name].ts` + `[name].html` + `[name].css`** (no `.component` suffix, no inline templates). Files migrated: `app`, `icon`, `navbar`, `home`, `login`, `register`. Import paths in [main.ts](frontend/src/main.ts) and [app.routes.ts](frontend/src/app/app.routes.ts) were updated and the old `*.component.ts` files deleted. **This convention is the standard for all future components.** A development build passes cleanly.

### 3.4 Wrapped controller responses in `ResponseEntity`
The [AuthController](backend/src/main/java/com/cinebook/controller/AuthController.java) originally returned bare DTOs (e.g. `public AuthResponse register(...)`). With that style Spring always replies **`200 OK`**, even when a brand‑new account is created. We changed all three endpoints to return **`ResponseEntity<AuthResponse>`** so we control the status code explicitly:

| Endpoint | Before | After |
|---|---|---|
| `POST /api/auth/register` | `200 OK` | **`201 Created`** |
| `POST /api/auth/register-admin` | `200 OK` | **`201 Created`** |
| `POST /api/auth/login` | `200 OK` | **`200 OK`** (explicit) |

```java
@PostMapping("/register")
public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
}

@PostMapping("/login")
public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
}
```

> No frontend change was needed: `201` and `200` are both `2xx`, so Angular's `HttpClient` still treats them as success and parses the body identically.

#### Why use `ResponseEntity`? (benefits)
`ResponseEntity<T>` is Spring's representation of a **complete HTTP response** — status line, headers, and body — instead of just the body. Benefits:

1. **Explicit, correct status codes.** A bare return value always means `200 OK`. `ResponseEntity` lets each endpoint say exactly what happened — `201 Created` for a new resource, `204 No Content` for a delete, `200 OK` for a read — which is what REST clients and standards expect.
2. **Control over response headers.** You can set headers such as `Location` (the URL of a newly created resource), `Cache-Control`, or `ETag` — impossible when returning the body alone.
3. **Conditional / dynamic responses.** A single method can branch — e.g. `return found ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();` — returning different statuses from the same handler.
4. **Consistency with the rest of the codebase.** Our [GlobalExceptionHandler](backend/src/main/java/com/cinebook/exception/GlobalExceptionHandler.java) already returns `ResponseEntity` for errors; using it on the happy path too makes the whole API uniform.
5. **Self‑documenting & testable.** The method signature now advertises the response shape, and tests/tools (MockMvc, Swagger) can assert on status and headers, not just the JSON body.
6. **Fluent, readable builders.** Helpers like `ResponseEntity.ok(...)`, `.created(uri)`, `.noContent()`, and `.status(...).body(...)` keep controllers concise and intention‑revealing.

> **Trade‑off:** for simple endpoints that always return `200 OK`, a bare DTO is shorter. The convention going forward is to **use `ResponseEntity` whenever the status code isn't a plain `200` or when headers matter** (creates, deletes, conditional reads), which covers most of the Day 2+ endpoints.

---

## 4. Features pending (not yet built)

The data layer (entities/repositories) exists for most of these, but the **services, controllers, and UI are not yet implemented**.

### 4.1 Movie catalog (Day 2)
- **Backend:** Movie service + REST controller (list, detail, create, update, soft‑delete).
- **Frontend:** Public catalog grid with poster cards, search/filter by genre & language, a movie detail page with trailer.
- **Admin:** The **"Manage Movies" admin console** seen in the design mockup — add/edit/remove titles with a live poster preview. *(This screen is referenced in designs but does not exist in the codebase yet.)*

### 4.2 Theaters & shows (Day 2–3)
- Theater‑owner ("admin") dashboard to manage their venue.
- Create/manage **shows** (a movie at a theater: showtime, language, ticket price, seat capacity).
- Browse showtimes filtered by the selected **location**.

### 4.3 Seat selection & booking (Day 3)
- Interactive **seat picker** UI (available vs. booked seats).
- Booking flow with **price breakdown** (subtotal + tax → total) — fields already modeled on `Booking`.
- Decrement of `availableSeats` on confirmation; concurrency handling.

### 4.4 My bookings & cancellation (Day 3)
- "My bookings" list per user.
- **Cancellation** with refund calculation (`refundAmount`, `cancelledAt`, status → `CANCELLED`).

### 4.5 Reviews & interests (Day 3+)
- Post/read **reviews & ratings** per movie (`Review` entity ready).
- **"Interested / notify me"** signal on upcoming movies (`MovieInterest` entity ready).

### 4.6 Analytics (Day 3+)
- Admin **analytics** dashboard: bookings, revenue, occupancy per show/movie/theater.

### 4.7 Hardening (post‑MVP / out of scope for the exercise)
- Real password hashing (e.g. BCrypt) and proper auth — currently plaintext + header‑based identity.
- Input validation coverage, pagination, and automated tests.

---

## 5. How to run (recap)

```powershell
# 1. MySQL must be running locally (DB auto‑created on first boot)
$env:DB_USER = "root"
$env:DB_PASSWORD = "<your-mysql-password>"

# 2. Backend — port 8181
cd backend
.\mvnw.cmd spring-boot:run

# 3. Frontend — port 4200 (proxies /api → :8181)
cd frontend
npm install --legacy-peer-deps
npm start
```

| Tool | Version |
|---|---|
| JDK | 21 |
| Node.js | 18 or 20 LTS (Node 25 builds with a warning) |
| MySQL | 8 |

---

## 6. Day 1 status summary

- ✅ **Done:** project scaffold, DB schema, all entities/repositories, stateless auth (register / register‑admin / login), navbar + auth pages, interceptors, guards, light theme, flat component structure.
- ⏭️ **Next (Day 2):** movie catalog + admin "Manage Movies" console, theaters & shows.
- ⏭️ **Later (Day 3+):** seat picker, bookings, cancellations, reviews, interests, analytics.
