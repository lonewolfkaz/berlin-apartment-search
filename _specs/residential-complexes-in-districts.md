# Spec for Residential Complexes in Districts

branch: claude/feature/residential-complexes-in-districts

## Summary

Add a curated list of Wohnquartiere (residential complexes) as an expandable sub-section inside each district card on the Districts tab. Each complex shows key at-a-glance data (name, year, energy class, €/sqm, status, scenario fit) and expands to reveal full details. The data comes from a static `COMPLEXES` array keyed by district ID, sourced from the reference document below.

This transforms the Districts tab from a district-level overview into a two-level hierarchy: district → complexes — giving the buyer instant access to monitored developments without leaving the district context.

## Reference Data

The full Wohnquartiere dataset is documented in:
`_specs/berlin-wohnquartiere-reference.md`

This file contains 15 complexes across 7 districts with pricing, energy, transit, school, and status data. It should be used as the source of truth for seeding the `COMPLEXES` constant.

## Functional Requirements

- Each district card, when expanded, shows a new "Wohnquartiere" section below the existing stats
- Complexes are grouped by their parent district ID
- Each complex card shows at minimum:
  - Name (e.g. "Immergrün", "Mittenmang", "Friedenauer Höhe")
  - Address (one-liner)
  - Year built
  - Energy class (color-coded pill: A/B = green, C = amber, D+ = red)
  - €/sqm range
  - 75 sqm all-in estimate
  - Status indicator (🟢 on sale · 🟡 possibly available · ⚪ monitor · 🔴 nothing available · ❌ over budget)
  - Scenario fit label (e.g. "ANCHOR", "S2 Neubau")
- Tapping a complex card expands it inline to show extended details:
  - Developer, Architect (if known)
  - ETW count
  - Heating type
  - HBF travel time
  - Nearest transit stops
  - Schools nearby + ndH
  - Parks
  - Notable features (bullet list)
  - Verification notes (if any)
- Districts with no complexes in the dataset show nothing (no empty state needed — the section simply doesn't render)
- The "Bayerisches Viertel" entry has no specific complexes but has a strategy note — render it as a single informational card with the ImmoScout filter strategy text

## Data Model

```
Complex {
  id: string,               // kebab-case unique id (e.g. "immergruen", "mittenmang")
  districtId: string,       // matches DISTRICTS[].id
  name: string,             // Display name
  address: string,          // Full street address
  year: string,             // "2020" or "2026–2027"
  developer: string|null,
  architect: string|null,
  etwCount: string|null,    // "~132" or "78"
  energy: string,           // "A", "B", "~B/C"
  energyKwh: string|null,   // "63 kWh/(m²·a)"
  heating: string|null,     // "Fernwärme · Fußbodenheizung"
  eurSqm: [number, number], // [6500, 7500]
  allIn75: [number, number],// [530000, 605000]
  hbf: string,              // "~28 min"
  transit: string|null,     // nearest stops text
  schools: string|null,     // school names
  ndh: string|null,         // "20–28%"
  parks: string|null,
  features: string[],       // bullet list of notable features
  scenario: string,         // "ANCHOR", "S2 (Neubau)", etc.
  status: string,           // "sale" | "possible" | "monitor" | "none" | "over"
  statusNote: string|null,  // free-text explanation
  verify: string|null       // verification notes
}
```

Static constant: `export const COMPLEXES = [...]` in a new file `src/data/complexes.js`.

## Visual Design

### Complex Card (collapsed state)

```
┌─────────────────────────────────────────┐
│  Immergrün                    B  🔴     │
│  Talstraße 3–6 · 2020                   │
│  €6,500–7,500/m²       ANCHOR          │
└─────────────────────────────────────────┘
```

- Card style: slightly inset from district card (8px left margin, lighter shadow or subtle border-left accent)
- Name in Instrument Serif (16px, regular weight)
- Address + year in DM Sans (12px, ink3 color)
- Energy class as a small colored pill (same style as budget pills)
- Status emoji on the right
- Scenario label as a subdued tag (11px, uppercase, ink4 or scenario-specific color)

### Complex Card (expanded state)

Expands below the collapsed header to show detail rows:

```
┌─────────────────────────────────────────┐
│  Immergrün                    B  🔴     │
│  Talstraße 3–6 · 2020                   │
│  €6,500–7,500/m²       ANCHOR          │
│─────────────────────────────────────────│
│  75 m² all-in    €530,000–605,000      │
│  Developer       UBM Development        │
│  Architect       zanderrotharchitekten   │
│  Units           ~132 ETW               │
│  HBF             ~28 min                │
│  Transit         Tram M1 3', U2 12'     │
│  Schools         ndH 20–28%             │
│  Parks           Humannplatz 5'         │
│─────────────────────────────────────────│
│  • Car-free grounds                     │
│  • Underground garage with EV charging  │
│  • Fiber optic FTTH                     │
│  • Oak parquet                          │
│─────────────────────────────────────────│
│  Primary stock sold out. No resales.    │
└─────────────────────────────────────────┘
```

- Detail rows: two-column grid (label in ink3, value in ink2)
- Features: bulleted list with small dot markers
- Status note at bottom in italics, color matching the status type
- Smooth expand/collapse animation (CSS transition on max-height)

### Section Header within District

```
  ── Wohnquartiere (3) ──────────────────
```

- Thin horizontal rule with section label
- Count badge showing number of complexes
- Uses DM Sans, 11px, uppercase, ink4 color
- 16px top margin from the district stats above

### Status Color Mapping

| Status | Emoji | Card accent |
|--------|-------|-------------|
| sale | 🟢 | Left border: green |
| possible | 🟡 | Left border: amber |
| monitor | ⚪ | Left border: ink4 (neutral) |
| none | 🔴 | Left border: red, text muted |
| over | ❌ | Left border: red, entire card at 60% opacity |

### Responsive Behavior

- Mobile (≤480px): full-width complex cards stacked vertically
- Touch targets: entire collapsed card is tappable (min 44px height)
- Expanded details scroll within the district card if content overflows

## Possible Edge Cases

- District has no complexes in dataset → don't render the Wohnquartiere section at all
- Energy class is uncertain (prefixed with ~) → render with a dashed border on the pill instead of solid
- Complex marked "over budget" → render at reduced opacity with strikethrough on price
- Very long feature lists → cap at 5 bullets, collapse the rest behind "Show more"
- Multiple complexes in same district with same status → group visually by status (sale first, then possible, monitor, none, over)

## Acceptance Criteria

- All 15 complexes from the reference document appear under their correct districts
- Expanding a district card shows its complexes below the district stats
- Each complex can be independently expanded/collapsed within its district
- Energy class pills are color-coded correctly (A/B = green, C = amber, D+ = red)
- Status indicators match the reference data
- Over-budget complexes are visually de-emphasized
- The Bayerisches Viertel shows the strategy note as an informational card
- No regressions to existing district card functionality (expand/collapse, budget/school pills)
- Data is static (no localStorage persistence needed for complexes — they are constants)
- Performance: no jank when expanding districts with 3+ complexes

## Open Questions

- Should tapping a complex link out to ImmoScout/developer website if a URL is available? Yes or to Neubau kompass website.
- Should there be a filter to show only "🟢 On sale" complexes across all districts? No
- Should complexes marked "over budget" be hidden by default with a toggle to show them? No.

## Testing Guidelines

Create a test file(s) in the /tests folder for the new feature, and create meaningful tests for the following cases,
without going too heavy:

- Complexes render under the correct district when expanded
- Complexes with status "over" render at reduced opacity
- Energy class pill color mapping is correct for each class
- Districts with no complexes don't render the Wohnquartiere section
- Complex expand/collapse toggling works independently of the district toggle
- The COMPLEXES data array matches expected count (15 entries)
