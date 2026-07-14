# Task Manager — Full-Stack Take-Home

A Task Management API with a web interface: CRUD, filtering, sorting, search, and pagination over a
single `Task` resource.

## Tech stack & reasoning

| Layer | Choice | Why |
|---|---|---|
| Backend | NestJS + TypeScript | Structured DI/module system keeps the API organized without hand-rolling routing/middleware conventions; class-based DTOs pair naturally with `class-validator`. |
| ORM | Prisma (v6) | Type-safe queries and a single schema file that doubles as schema documentation. Pinned to `^6` rather than the current `^7` release simply because the project was already stable on it — no compelling reason to churn to Prisma 7's new adapter-based config mid-project. |
| Database | SQLite | The spec's suggested default — a single file, zero external services, nothing to install or run for local development. |
| Frontend | React + TypeScript + Vite | Fast dev loop, no framework ceremony beyond what the UI actually needs. |
| Styling | Plain CSS | The spec explicitly deprioritizes visual polish; CSS variables give light/dark support without a UI framework dependency. |
| Tests | Jest (Nest's default) | Backend service layer tested against a mocked `PrismaService` — no live DB needed to run the suite. |
| Containers | Docker Compose (optional) | Runs the whole app (backend + frontend) with one command for a grader who just wants to see it working, without installing Node at all. |

**Note on SQLite + Prisma enums:** SQLite has no native enum type in Prisma, so `status`/`priority` are
plain string columns. The allowed values are defined once in `backend/src/tasks/task.enums.ts` and
enforced at the API boundary via `class-validator`'s `@IsEnum()` on the request DTOs.

## Running it

### Option A — Docker Compose (simplest, no Node install required)

```bash
docker compose up --build -d      # builds and starts backend (:3000) + frontend (:5173)
docker compose exec backend npm run seed   # loads sample tasks (one-time)
```

Open `http://localhost:5173`. The SQLite file persists in a named Docker volume (`backend-data`) across
container restarts — `docker compose down` stops the containers without losing data; add `-v` to also
wipe the volume.

### Option B — Local dev (two terminals, faster iteration)

Requires Node.js 20+.

```bash
# Backend
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma db push          # creates backend/prisma/dev.db and syncs the schema
npm run seed                # loads sample tasks
npm run start:dev           # http://localhost:3000/api

# Frontend (separate terminal)
cd frontend
npm install
cp .env.example .env
npm run dev                 # http://localhost:5173
```

Run backend tests with `npm test` from `backend/` (no running database required — the service layer is
tested against a mocked Prisma client).

## Database schema

Single `Task` table (`backend/prisma/schema.prisma` is the source of truth):

| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | auto-generated |
| `title` | string | required, max 100 chars |
| `description` | string? | optional, max 500 chars |
| `status` | string | `pending` \| `in_progress` \| `completed`, default `pending` — values enforced by `class-validator`, not the DB (SQLite has no enum type) |
| `priority` | string | `low` \| `medium` \| `high`, default `medium` — same enforcement note as above |
| `dueDate` | DateTime? | optional |
| `createdAt` | DateTime | server-set |
| `updatedAt` | DateTime | server-set, auto-updated on write |

## API endpoints

Base URL: `http://localhost:3000/api`

| Method | Path | Description |
|---|---|---|
| `GET` | `/tasks` | List tasks. Query params: `page`, `limit`, `status`, `priority`, `search`, `sortBy` (`dueDate`\|`createdAt`\|`priority`), `sortOrder` (`asc`\|`desc`) |
| `GET` | `/tasks/search` | Alias of the above (kept for parity with the spec's example endpoint list) |
| `GET` | `/tasks/:id` | Get a single task |
| `POST` | `/tasks` | Create a task |
| `PUT` | `/tasks/:id` | Update a task (partial body accepted) — also how status is toggled complete/incomplete |
| `DELETE` | `/tasks/:id` | Delete a task (`204 No Content`) |

Validation errors return `400` with a message array. A missing or nonexistent task id returns `404`.

## Known limitations / trade-offs

- **Priority sort is done in application memory, not the database.** SQLite has no enum type, so
  `priority` is stored as a plain string; a DB-level `ORDER BY priority` would sort alphabetically
  (`high, low, medium`) instead of by actual severity. Given the small dataset size expected here,
  `TasksService.findAll` fetches the filtered set and sorts in memory when `sortBy=priority`. This
  wouldn't scale to a large table — the real fix is a numeric `priorityWeight` column written alongside
  `priority` and indexed.
- **No authentication** — out of scope per the spec's FAQ.
- **Delete confirmation uses `window.confirm`** rather than a custom modal, to avoid building a second
  modal component for a single confirmation step.
- **Status toggle (checkbox) only flips between `pending` and `completed`** — it doesn't try to restore
  a prior `in_progress` state, since "un-completing" a task doesn't have an obvious single correct target
  status.
- **The backend Docker image isn't size-optimized** (single stage, includes devDependencies) so that
  `docker compose exec backend npm run seed` works identically to the local dev flow via `ts-node`. A
  production deployment would want a multi-stage build that strips dev dependencies from the final image.
- WebSockets, CSV/JSON export, dark-mode *toggle* (the app does respect OS dark mode via CSS), and
  deployment were left out — see Bonus Points in the spec; not attempted given the time budget.

## Time spent

_Fill in honestly before submitting — this section is part of the grading rubric._

| Area | Time |
|---|---|
| Backend (API, validation, Prisma schema) | |
| Frontend (UI, forms, state) | |
| Docker Compose setup | |
| Tests | |
| README / docs | |
| Debugging / polish | |
