# Spec for UI Redesign
branch: claude/feature/ui-redesign
figma_component: Detail.html, Listings.html (exported design references)

## Summary

Complete visual redesign of the Listings and Detail pages, shifting from the current editorial-minimalist style (Instrument Serif + DM Sans, white cards on light background) to a dark, data-dense interface inspired by brutalist fintech dashboards. The new design uses a near-black background, monospace data typography, large display numbers, and a neon/warm accent system for status indicators.

All existing functionality, data model, state management, and routing remain unchanged. This is a pure visual layer update.

## Functional Requirements

### Design System Changes

#### Fonts (replace current Instrument Serif + DM Sans)
- **Display/Headings**: `Space Grotesk` (weight 500) — used for addresses, large numbers, page titles
- **Data/Body**: `JetBrains Mono` (weight 400/500) — used for labels, metadata, status text, all numeric data
- Load via Google Fonts CDN (same approach as current)

#### Color Palette (replace current warm-white theme)
| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `rgb(14, 14, 12)` / `#0E0E0C` | Page background |
| `surface` | `rgb(31, 30, 27)` / `#1F1E1B` | Card backgrounds, elevated surfaces |
| `surfaceAlt` | `rgb(42, 41, 36)` / `#2A2924` | Secondary surface (filter bar, active states) |
| `border` | `rgb(90, 89, 83)` / `#5A5953` | Subtle borders, dividers |
| `ink` | `rgb(245, 244, 239)` / `#F5F4EF` | Primary text (headings, key data) |
| `ink2` | `rgb(183, 182, 174)` / `#B7B6AE` | Secondary text (labels, metadata) |
| `ink3` | `rgb(142, 141, 134)` / `#8E8D86` | Tertiary text (breadcrumbs, IDs) |
| `green` | `rgb(182, 255, 26)` / `#B6FF1A` | Pass indicators, positive status |
| `red` | `rgb(255, 93, 42)` / `#FF5D2A` | Fail indicators, rejected, over-budget |
| `amber` | `rgb(255, 200, 0)` / `#FFC800` | Warning, conditional status |
| `purple` | `rgb(139, 92, 246)` / `#8B5CF6` | Accent (contacted status) |

#### Informer Color Logic (Detail page hard-checks)
- **Pass**: green (`#B6FF1A`) — requirement met
- **Fail**: red (`#FF5D2A`) — requirement failed, deal-breaker
- **Warning/Conditional**: amber (`#FFC800`) — partially met or needs negotiation

### Listings Page Redesign

#### Header Area
- Page title "Listings" in Space Grotesk 56px/w500, color `ink`
- Breadcrumb row: "Pipeline / Active" + count ("05 of 12") in JetBrains Mono 10.5px, color `ink3`
- Summary stats row: Budget, /m², Avg all-in — labels in JetBrains Mono 11px `ink3`, values in JetBrains Mono 11px/w500 `ink`

#### Filter Tabs
- Horizontal scrollable row: "All · N", "New", "Viewed", "Contacted", "Rejected"
- Active tab: `ink` color, other tabs: `ink2` color
- JetBrains Mono 11px

#### Listing Cards
- Background: `surface` with subtle radius (2px outer container)
- Layout per card (vertical stack):
  - Row 1: Index number (10px `ink3`) + District name uppercase (10px `ink3`)
  - Row 2: Address in Space Grotesk 22px/w500 `ink`
  - Row 3: All-in price (Space Grotesk 22px/w500 `ink`) displayed prominently
  - Row 4: Size (m²) · Rooms · Year — JetBrains Mono 11px `ink2`, separated by middots
  - Row 5: Status pill + price per m² (JetBrains Mono 11px `ink2`)
- Status pill colors:
  - "Contacted" → `green` text
  - "Viewed" → `ink2` text
  - "New" → `border` text (muted)
  - "Rejected" → `red` text
- Keep existing district emojis in listing cards

#### Card Interaction
- Cards remain clickable → navigate to Detail view
- No hover state changes needed (mobile-first)

### Detail Page Redesign

#### Hero Section (top area, dark bg)
- Back nav: "← Pipeline / {id}" in JetBrains Mono 10.5px `ink3`
- Status label: e.g. "Contacted" in JetBrains Mono 10.5px `ink3`
- Address: Space Grotesk 56px/w500 `ink` (multi-line if needed)
- Meta row: DISTRICT · size m² · rooms · year — JetBrains Mono 11px `ink2`

#### Key Metrics (large display numbers)
- All-in price: Space Grotesk 48px/w500 `ink`, with label "All-in · target negotiated" above (10.5px `ink2`)
- Sub-metrics: Kaufpreis, /m², broker status — JetBrains Mono 11px `ink2`
- Hausgeld: Space Grotesk 32px/w500 `ink` with "per month, +X%/2yr" label
- Transit to HBF: Space Grotesk 32px/w500 `ink` with detail label

#### Verdict Section
- Section header: "Verdict — {Match|Conditional|Rejected}" in JetBrains Mono 10.5px `ink`
- Verdict body text: Space Grotesk 18px `ink`
- Verdict header color varies:
  - Match → `green`
  - Conditional → `amber`
  - Rejected → `red`

#### Info Grid (Building, Schools, Parks, Energy)
- Label: JetBrains Mono 11px `ink2`
- Value: Space Grotesk 13.5px/w500 `ink`
- Compact two-column or single-column layout

#### Hard Requirements Checklist
- Each row: requirement label (Space Grotesk 14px `ink`) + result value (JetBrains Mono 10.5px)
- Result value colored by pass/fail:
  - Pass → `green` (#B6FF1A)
  - Fail → `red` (#FF5D2A)
  - Conditional → `amber` (#FFC800)

#### Footer Actions
- "Notes" section header
- "View listing →" link button: JetBrains Mono 11px `ink` on `surface` background

### General Layout Rules
- Mobile-first: max-width 402px content area (matching design frame)
- Background: full-bleed `bg` color
- No card borders — rely on background color differentiation between bg and surface
- Minimal border-radius (2px on outer containers, none on inner elements)
- Dense vertical spacing — reduce whitespace compared to current design
- No box-shadows (flat design)

## Possible Edge Cases
- Very long German addresses may need text wrapping at 56px heading size
- Numbers exceeding 3 digits in all-in price (e.g., "1,200" vs "513") need consistent sizing
- Status colors must remain distinguishable on dark background for colorblind users
- District emojis must remain visible/legible against dark background
- "Conditional" verdict may have long explanation text — ensure it wraps gracefully

## Acceptance Criteria
- Listings page matches the visual structure in `_specs/Listings.html`
- Detail page matches the visual structure in `_specs/Detail.html`
- All existing functionality preserved (filtering, navigation, data display, localStorage)
- District emojis retained in all relevant views
- Hard-check indicators use red/amber/green color coding
- Font loading: Space Grotesk + JetBrains Mono from Google Fonts
- Mobile responsive at 402px width (iPhone-like viewport)
- No visual regressions on Add tab or Districts tab (update their backgrounds/colors to match new theme)
- Dark theme applied globally (all tabs consistent)
- Delete `_specs/Detail.html` and `_specs/Listings.html` after implementation is complete

## Open Questions
- Should the Districts tab and Add tab receive the same dark theme treatment, or remain as-is until separate specs? All pages should be updated.
- Should the filter tabs support swipe gesture on mobile or just horizontal scroll? Tap or click is enough
- Is the 402px max-width intentional or should we use the existing 480px from current design? Please make 600 or 800px max on desktop.

## Testing Guidelines
Create a test file(s) in the /tests folder for the new feature, and create meaningful tests for the following cases,
without going too heavy:
- Color token values match the spec palette
- Font family assignments (Space Grotesk for headings, JetBrains Mono for data)
- Hard-check indicator colors: pass=green, fail=red, conditional=amber
- Listing card renders all required data fields (index, district, address, price, size, rooms, year, status)
- Detail page renders verdict with correct color based on verdict type
- Status pill text colors map correctly (Contacted=green, Rejected=red, New=muted, Viewed=ink2)
