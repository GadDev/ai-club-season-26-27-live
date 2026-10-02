# Artistic direction — The Signal Index

**Selected direction:** AI Club / SFEIR Luxembourg, Season 2026–2027. This is a design direction for the timeline-first product; the reference images use illustrative content, not a confirmed programme.

## Decision

The application should feel like a bold editorial signal for an engineering community: oversized compressed type, a precise season grid, strong colour-coded track bands, and a few sharp cut-paper gestures. The season remains the main event.

The earlier [Season Index exploration](https://github.com/GadDev/ai-club-season-26-27-live/commits/main/ART_DIRECTION.md) tested conference programme, research index, transit map, and mission control. Additional visual explorations tested Swiss grid, dark observatory, library catalogue, and open workshop. The chosen Signal Index keeps the editorial discipline of the Season Index and adds a more distinctive public identity.

## Visual character

- **Name:** The Signal Index.
- **Brand line:** AI CLUB / SFEIR LUXEMBOURG. Use text until an official logo asset and its usage are approved.
- **Voice:** curious, direct, practical; energetic without hype.
- **Typography:** towering condensed display type for the season and month headings; calm sans-serif reading text; monospaced metadata.
- **Palette:** deep navy, warm cream, electric cobalt, vermilion, and acid citron. Track colour is always paired with a written label.
- **Shape:** strict rectangular grid, occasional diagonal paper cut and directional arrow. These are accent marks, never the only navigation cue.
- **Texture:** sparse print-like irregularity in nonessential surfaces. Text and controls sit on clean flat colour.

## Layout family

| Phase | Reference | Purpose |
| --- | --- | --- |
| V1 | [Desktop season](design/references/season-desktop.webp) | Nine-month index, three tracks, next confirmed event, readable session cards |
| V1 | [Mobile season](design/references/season-mobile.webp) | Three-by-three month jump grid and stacked track sections |
| V2 concept | [SFEIR voting](design/references/voting-concept.webp) | One choice per eligible account, clear selection and submission |
| V3 concept | [Session materials](design/references/session-replay-concept.webp) | Replay and approved presentation links after a completed session |

The [original Signal Index concept](design/references/signal-index-concept.webp) is kept as a mood reference. It overfills the 9 × 3 grid with topic labels. The implemented V1 index should use compact counts or presence marks; full titles belong in the readable month sections.

## Rules that protect usability

1. The desktop season index may span nine months, but each cell holds a count or compact marker, not a paragraph. A blank cell is an honest gap.
2. On mobile, the index becomes a month jump grid and the three tracks stack inside each month. Never shrink a desktop matrix to phone width.
3. The bold masthead must yield quickly to the season. Limit heavy texture to the masthead or card corner, with no texture behind small text.
4. Proposed, scheduled, completed, and cancelled are written states. A proposed month does not pretend to be a confirmed date. Presenter names visible in a concept image are placeholders, not V1 content.
5. Do not put voting or replay controls on the V1 timeline before those capabilities exist.
6. Keep sample titles and counts in these images clearly separate from the real programme data.

## Brand and production note

The design is for AI Club at SFEIR Luxembourg. It does not claim that these colours or typefaces are SFEIR corporate brand standards. Use an official SFEIR logo only from an approved asset and have the final public use reviewed by the relevant team. SFEIR offers logo variants in its [press resources](https://www.sfeir.com/sfeir/presse/).

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for tokens, components, and responsive rules. The images are visual references rather than pixel-perfect specifications.

The [moodboard](design/references/signal-index-moodboard.webp) captures the material and typography, while the [UI specimen](design/references/signal-index-ui-sheet.webp) collects components on one sheet. Their exact implementation rules live in the [design guide](design/README.md).
