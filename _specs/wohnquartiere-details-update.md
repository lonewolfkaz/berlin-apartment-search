# Spec for Wohnquartiere Details Update
branch: claude/feature/wohnquartiere-details-update

## Summary
Enrich the Wohnquartiere (residential complexes) on the Districts page with data from the updated reference document. Three key additions: (1) travel time to Zoologischer Garten for every complex, (2) multiple project links per complex (filtering out ImmoScout-only entries), and (3) two new Weißensee complexes — Charlie und der Wundergarten and LANGHANS24. Secondary: backfill missing data fields across all existing complexes where the reference provides new information.

## Functional Requirements

### 1. New field: `zoo` (travel time to Zoologischer Garten)
- Add a `zoo` string field to every complex entry in `src/data/complexes.js`
- Format matches existing `hbf` field (e.g., `"~33 min"`, `"~15 min"`)
- Display in ComplexCard expanded body as a new row labeled **"Zoo"**, positioned directly after the **"HBF"** row
- Values come from the reference document's "Zoo" column

### 2. Replace `url` with `links` array
- Replace the current `url: string | null` field with `links: [{name, url}]`
- Each entry is an object: `{name: "Neubau Kompass", url: "https://..."}`
- **Filtering rule**: if a complex's only link is to immobilienscout24.de, set `links` to an empty array `[]` — do not include ImmoScout-only links
- Complexes with multiple links that include ImmoScout among them: keep all links including ImmoScout
- Complexes with no links at all: empty array `[]`

### 3. ComplexCard UI: render links
- In the card header: if `links.length > 0`, show a generic link icon (↗) that opens the first link — replacing the current `c.url` behavior
- In the expanded body: render all links as a row of clickable link names, each opening in a new tab
- Style link names as small pill-like tags matching the existing `eq-tag` class aesthetic, with a subtle underline or distinct color to signal interactivity
- Position the links section after the features tags section and before the verify warning

### 4. Two new complexes in Weißensee district
- Add **Charlie und der Wundergarten** (id: `charlie-wundergarten`, district: `weissensee`)
  - All fields populated from reference document entry #16
  - Status: `sale`, with hard check warning about S-Bahn >15 min walk
- Add **LANGHANS24** (id: `langhans24`, district: `weissensee`)
  - All fields populated from reference document entry #17
  - Status: `sale`, with hard check warning about S-Bahn >15 min walk

### 5. Data backfill for existing complexes
- Fill in `zoo` values for all 15 existing complexes using the reference document
- Populate `links` arrays from reference document — applying the ImmoScout-only filter rule
- Any other missing fields (transit, schools, parks) that the reference provides and current data lacks should be backfilled

## Possible Edge Cases
- Complexes where Zoo time is not listed in reference: derive from HBF time + known S-Bahn connections, mark with `~` prefix
- Bayerisches Viertel strategy entry: has no specific complex, set `zoo: "~12 min"` and `links: []` per reference
- Fasanenstraße 64 has "Developer: Primus Immobilien AG · Architect: Nöfer Architekten" as text-only links — these are not URLs, so `links: []`
- Charlottenbogen reference says "Developer: AMAG Bauten" as link text — same, not a URL, so only include the Neubau Kompass link
- Complexes with `status: "over"` still get links and zoo time for completeness

## Acceptance Criteria
- Every complex in `COMPLEXES` has a `zoo` string field
- Every complex has a `links` array (may be empty) instead of `url`
- No complex has `links` with a single ImmoScout-only entry
- ComplexCard renders Zoo time in expanded view after HBF
- ComplexCard renders clickable links in expanded view
- ComplexCard header link icon uses first entry from `links` array
- Two new Weißensee complexes appear on the Weißensee district card
- New complexes sort by status priority (sale items appear first)
- Existing tests in `/tests/complexes.test.js` pass (update assertions for new schema)
- No regressions on DistrictsTab or other pages

## Open Questions
- Should Zoo travel time use a trophy emoji (🏆) for best-in-class values (≤15 min) as the reference does? (Recommendation: yes, show a small indicator for ≤15 min) NO, just add value in minutes.
- Should links open in a modal/preview or always in a new tab? (Recommendation: new tab, consistent with current behavior) New tab.
- The reference file `_specs/berlin-wohnquartiere-final.md` should be deleted after implementation is complete, per user request

## Testing Guidelines
Create a test file(s) in the /tests folder for the new feature, and create meaningful tests for the following cases,
without going too heavy:
- Every complex has a `zoo` string field that is non-empty
- Every complex has a `links` array (not null, not undefined)
- No complex with `links.length === 1` where the single link URL contains "immobilienscout24"
- New complexes `charlie-wundergarten` and `langhans24` exist with correct district assignment (`weissensee`)
- `links` entries have both `name` and `url` string properties
- The old `url` field no longer exists on any complex
