# Build-a-Deck (Synergy Simulator)

A small full-stack app for exploring **Magic: The Gathering** card pools via **Scryfall queries**, then drawing a 7-card hand and running a lightweight “synergy scan” over the results.

- **Frontend**: Create React App + TypeScript + Tailwind (shadcn-style UI primitives)
- **Backend**: Express + TypeScript

> Note: this project uses the public Scryfall API. Please be mindful of rate limits.

## Features

- Paste any Scryfall search expression (e.g. `type:creature color:g`, `oracle:"gain life"`)
- Fetch a card pool and browse results (with modal card details)
- Draw a random 7-card hand from the fetched pool
- Highlight potential synergy themes (currently: simple `lifegain_payoff` heuristic)

## Quick start

From the repo root:

```bash
bash ./run.sh
```

This will:

1. Install dependencies in both backend + frontend
2. Build + start the backend on `http://localhost:3001`
3. Start the frontend dev server on `http://localhost:3000`

## Manual (two terminals)

### Backend

```bash
cd synergy-simulator-backend
npm ci
npm run build
npm start
```

### Frontend

```bash
cd synergy-simulator-frontend
npm ci
npm start
```

The frontend dev server proxies API calls to the backend (`proxy` is set to `http://localhost:3001`).

## API

- `GET /health` -> `{ ok: true }`
- `GET /api/deck?query=<scryfall query>` -> `{ cards: Card[] }`
- `POST /api/draw` body `{ cards: Card[] }` -> `{ drawn_cards: Card[], synergy_tags: string[] }`

`/api/deck` is a thin wrapper around the Scryfall search endpoint; `/api/draw` draws 7 cards from the provided list and returns detected synergy tags.

## Repo layout

- `synergy-simulator-backend/` — Express server and simple synergy tagging
- `synergy-simulator-frontend/` — React UI for searching, browsing, and drawing hands

## Requirements

- Node.js **18+** (backend enforces this via `engines`)

## Extending synergies

Synergy tags live in `synergy-simulator-backend/api.ts` (`getSynergyTags`). Add new tag rules there and optionally teach the frontend how to display them in `synergy-simulator-frontend/src/components/SynergyPanel.tsx`.
