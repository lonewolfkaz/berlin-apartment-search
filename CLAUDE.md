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

Editorial minimalism inspired by rachelchen.tech — serif headings, clean sans body, generous whitespace, warm-cool palette.

### Fonts

- **Headings**: `Instrument Serif` (italic for app title, regular for section titles, addresses)
- **Body**: `DM Sans` (all UI text, labels, data)
- Loaded via Google Fonts CDN

### Color Tokens (object `T`)

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | #FAFCFD | Page background |
| `card` | #FFFFFF | Card backgrounds |
| `ink` | #1A1A1A | Primary text |
| `ink2` | #3D3D3D | Secondary text |
| `ink3` | #6B6B6B | Tertiary/muted text |
| `ink4` | #A3A3A3 | Disabled/placeholder |
| `green/greenSoft` | #1A7F37 / #DAFBE1 | Pass, in-budget, pros |
| `red/redSoft` | #CF222E / #FFEBE9 | Fail, over-budget, cons |
| `amber/amberSoft` | #BF8700 / #FFF8C5 | Warning, conditional |
| `blue/blueSoft` | #0969DA / #DDF4FF | New status, info |
| `purple/purpleSoft` | #8250DF / #FBEFFF | Contacted status |
| `rose` | #FF385C | CTA buttons (Save listing) |

### Component Patterns

- Cards: `border-radius: 14px`, `box-shadow` (no borders), white background
- Pills: `border-radius: 20px`, colored bg + text, 11px font
- Sections: serif title with ▾ toggle, collapsible content
- Requirements/Pros/Cons: icon squares (28×28, rounded-8) + text rows
- Form inputs: `background: #F3F4F6`, no border, `border-radius: 12px`
- Fixed bottom CTA: dark button with gradient fade overlay

## Patterns to Follow

- All state changes go through `setListings` callback pattern, never direct mutation
- New listings: append to `SEEDS` array in code for permanent ones, or add via localStorage for user-added ones
- District data is static — edit `DISTRICTS` array directly
- Scenario scoring is computed, never stored — edit `SCENARIOS` to change criteria
- Components use `function` declarations (not arrow functions) for JSX compatibility
- No optional chaining (`?.`) — use explicit null checks
- Mobile-first: `max-width: 480px` container, generous touch targets

## Coding Preferences

- Do NOT use semicolons
- Do NOT apply Tailwind classes directly in templates unless just 1 class — combine into custom classes via `@apply`
- Use minimal project dependencies
- Use `git switch -c` to create branches, not `git checkout -b`
- Keep the app as a single page (no routing) until explicitly asked to add routes
- Prefer `function` keyword over arrow functions for component definitions
- German real estate terms stay in German — never translate or simplify
