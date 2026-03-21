# Parikshanam

Turborepo monorepo: **FastAPI** backend, **Expo** mobile app with **Supabase**, and **Next.js** site.

## Layout

| Path | Stack |
|------|--------|
| `apps/api` | Python 3.11+, FastAPI, Uvicorn |
| `apps/mobile` | Expo (Router), React Native, Supabase client |
| `apps/web` | Next.js (App Router), Tailwind CSS |
| `packages/typescript-config` | Shared TS base config |

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS) and [pnpm](https://pnpm.io/) 9+
- [Python](https://www.python.org/) 3.11+ for the API (optional until you work on the backend)
- [Expo CLI](https://docs.expo.dev/) / Xcode or Android Studio for native mobile builds

## Install

```bash
pnpm install
```

### API (Python)

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
```

### Mobile — Supabase

Copy env and add your project URL and anon key:

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

## Commands

From the repo root:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Runs **all** dev tasks (API + Metro + Next) in parallel |
| `pnpm dev:api` | FastAPI at http://localhost:8000 |
| `pnpm dev:mobile` | Expo / Metro |
| `pnpm dev:web` | Next.js (default http://localhost:3000) |
| `pnpm build` | Production builds for JS apps |
| `pnpm lint` | Lint across workspaces |

OpenAPI docs for the API: http://localhost:8000/docs

## Turborepo

[Turborepo](https://turbo.build/) caches task outputs and runs tasks in parallel. The Python app participates via `apps/api/package.json` scripts (`dev`, `lint`); install Python dependencies locally before `pnpm dev:api`.

## Adding shared TypeScript

Add packages under `packages/` and extend `packages/typescript-config/base.json` in app `tsconfig.json` files.
