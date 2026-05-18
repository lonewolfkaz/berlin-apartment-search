# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Build & Development Commands

- `npm run dev` — Start Vite dev server (port 5173)
- `npm run build` — Production build
- `npm run lint` — ESLint (flat config format)
- `npm run preview` — Preview production build

No environment variables or backend services needed. All data persists in browser localStorage.

## Tech Stack

- **React 19** with functional components and hooks (JSX, no TypeScript)
- **Vite 6+** with @vitejs/plugin-react
- **Tailwind CSS v4** (uses `@import "tailwindcss"` syntax, not v3 config/directive)
- **React Router v7** for client-side routing
- **No backend** — pure client-side app with localStorage persistence

## What This App Does

**Berlin Apartment Search** is a personal apartment buying triage tool. The buyer evaluates listings against a fixed set of criteria (budget, district, schools, scenarios) and tracks them through a pipeline (New → Viewed → Contacted → Offer → Rejected).

### Language & Domain

- UI language: **English** (labels, buttons, section titles)
- Chat/evaluation language: **Russian** (when user interacts via Claude chat)
- Real estate terms: **German** — never simplify (WEG, Hausgeld, Sonderumlage, ndH, Schulsprengel, Grunderwerbsteuer, Kernsanierung, Energieausweis, Bezugsfrei, Nießbrauch, etc.)

### Buyer Profile

- Budget: up to **€640,000 all-in** (purchase + Nebenkosten)
- Eigenkapital: €176,000
- Mortgage: ~€464K loan, ~€2,800/month, target rate ≤4%
- Horizon: 15 years owner-occupied
- Nebenkosten formula: `all_in = price × (1 + 0.06 + 0.02 + broker)`
  - Grunderwerbsteuer: 6%, Notar: 2%, Makler (if applicable): 3.57%
- Max price without broker: €592,593 — with broker: €573,476

### Hard Requirements (deal-breakers)

- ❌ NOT Erdgeschoss (floor 0) or Dachgeschoss (top floor)
- ✅ Inside S-Bahn Ring (exceptions: Pankow-Süd, Weißensee ≤15 min to S-Bahn)
- ✅ Max 15-min walk to U/S-Bahn
- ✅ Parks nearby
- ✅ Schools with ndH < 40%
- ✅ Transit to Hauptbahnhof: 15–20 min preferred

### Five Scenarios

| ID | Name | Max All-in | Min m² | Min Rooms | Year Range |
|----|------|-----------|--------|-----------|------------|
| A  | Anchor | €620K | 75 | 3 | 2005–2025 |
| 1  | Kernsaniert | €550K | 75 | 3 | 1900–2025 |
| 2  | Neubau | €590K | 70 | 2.5 | 2020–2030 |
| 3  | Modern Bestand | €600K | 71 | 3 | 2005–2020 |
| 4  | Pankow | €600K | 72 | 3 | 2012–2025 |

All scenarios also require: not EG/DG, Energy class ≤ C.

## Architecture

### State Management

- Single-file app (currently `src/App.jsx`) — no routing yet
- State via `useState` hooks in top-level `App` component
- Listings array initialized from `SEEDS` constant (hardcoded listings baked into code)
- Additional listings loaded from localStorage key `berlin-triage-listings` and merged on mount
- State auto-syncs to localStorage on every change via `useEffect`

### Data Model

```
Listing {
  id, address, district, price, size, rooms,
  floor, totalFloors, year, energy, broker, kfw,
  url, notes, status, created,
  ev?: {                          // evaluation data (optional)
    verdict, vt,                  // "match" | "conditional" | "rejected"
    building, unit, transit,      // summary strings
    schools, parks, hausgeld,
    hc: [[name, pass, detail]],   // hard checks array
    pros: string[],
    cons: string[],
    qs: string[],                 // open questions
    eq: string[],                 // Ausstattung items
  }
}
```

### Key Constants

- `DISTRICTS` — array of 11 district objects with price ranges, school data, ndH stats
- `DEMOJI` — district → emoji mapping
- `SCENARIOS` — 5 scoring scenarios with budget/size/room/year thresholds
- `STATUS_OPTS` — pipeline stages with colors
- `SEEDS` — hardcoded listings that always appear (merged with localStorage on load)
- `ENERGY` — energy class scale A+ through H

### Components

| Component | Purpose |
|-----------|---------|
| `App` | Root — tabs, state, routing to detail |
| `Detail` | Full listing evaluation page with collapsible sections |
| `Sec` | Collapsible section wrapper (title + ▾ toggle) |
| `DistrictsTab` | Expandable district cards with school/price data |
| `ListingsTab` | Filtered listing cards, click → detail |
| `AddTab` | Manual listing entry form with live preview |
| `Pill` | Status/budget pill badge |
| `Dots` | Scenario pass/fail indicator dots |

### Functions

- `calcAllIn(price, broker)` — compute total purchase cost
- `scoreScenarios(listing)` — evaluate listing against all 5 scenarios
- `loadLst()` / `saveLst()` — localStorage read/write with SEEDS merge
- `fmt(number)` — German locale number formatting

## Design System

### Visual Direction

Dark, data-dense brutalist interface. Near-black background, monospace data typography, large display numbers, neon/warm accent system for status indicators. No shadows, flat surfaces, minimal radius.

### Fonts

- **Display/Headings**: `Space Grotesk` (weight 500) — addresses, large numbers, page titles
- **Data/Body**: `JetBrains Mono` (weight 400/500) — labels, metadata, status text, all numeric data
- Loaded via Google Fonts CDN

### Color Tokens (object `T`)

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | #0E0E0C | Page background |
| `surface` | #1F1E1B | Card backgrounds, elevated surfaces |
| `surfaceAlt` | #2A2924 | Secondary surface (inputs, filter bar) |
| `border` | #5A5953 | Subtle borders, dividers |
| `ink` | #F5F4EF | Primary text (headings, key data) |
| `ink2` | #B7B6AE | Secondary text (labels, metadata) |
| `ink3` | #8E8D86 | Tertiary text (breadcrumbs, IDs) |
| `ink4` | #5A5953 | Disabled/placeholder |
| `green/greenSoft` | #B6FF1A / #1A2E0A | Pass, in-budget, pros |
| `red/redSoft` | #FF5D2A / #2E1510 | Fail, over-budget, cons |
| `amber/amberSoft` | #FFC800 / #2E2400 | Warning, conditional |
| `blue/blueSoft` | #4DA6FF / #0D1F33 | Info, school ratings |
| `purple/purpleSoft` | #8B5CF6 / #1E1233 | Accent |

### Component Patterns

- Cards: `border-radius: 2px`, no shadows, dark surface background
- Pills: `border-radius: 2px`, colored text + dark tint background, 11px mono font
- Sections: display font title with ▾ toggle, collapsible content
- Requirements/Pros/Cons: icon squares (28×28, rounded-8) + text rows
- Form inputs: `background: surfaceAlt`, no border, `border-radius: 12px`
- Fixed bottom CTA: ink-colored button with gradient fade overlay
- Hard-check indicators: pass=#B6FF1A, fail=#FF5D2A, conditional=#FFC800

## Patterns to Follow

- All state changes go through `setListings` callback pattern, never direct mutation
- New listings: append to `SEEDS` array in code for permanent ones, or add via localStorage for user-added ones
- District data is static — edit `DISTRICTS` array directly
- Scenario scoring is computed, never stored — edit `SCENARIOS` to change criteria
- Components use `function` declarations (not arrow functions) for JSX compatibility
- No optional chaining (`?.`) — use explicit null checks
- Mobile-first: `max-width: 640px` container, generous touch targets

## Coding Preferences

- Do NOT use semicolons
- Do NOT apply Tailwind classes directly in templates unless just 1 class — combine into custom classes via `@apply`
- Use minimal project dependencies
- Use `git switch -c` to create branches, not `git checkout -b`
- Keep the app as a single page (no routing) until explicitly asked to add routes
- Prefer `function` keyword over arrow functions for component definitions
- German real estate terms stay in German — never translate or simplify

## Supabase Backend

- Table: `listings` (see supabase/migrations/001_create_listings.sql)
- Auth: anon key only, RLS policy "allow all" (personal tool, single user)
- Client: src/lib/supabase.js
- Data layer: src/lib/listings.js

### Field mapping (JS camelCase ↔ DB snake_case)

- totalFloors ↔ total_floors
- createdAt ↔ created_at
- evaluation ↔ ev (JSONB column)
- id: UUID generated by DB — never set client-side

### Environment variables

- VITE_SUPABASE_URL — Supabase project URL
- VITE_SUPABASE_ANON_KEY — Supabase anon/publishable key
- Both required at build time. See .env.example
- In GitHub Actions: stored as repository secrets

### Important rules

- Snake_case in DB, camelCase in JS — always map in src/lib/listings.js
- The ev column is nullable — listings without evaluation must render without errors
- Do not change visual styling without explicit request
