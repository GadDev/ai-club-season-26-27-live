# Editing the programme

`season.yaml` describes the season. Each `sessions/*.yaml` file is one talk or workshop. The 60 records place all 30 topic pairs from `SEASON_BOARD.md` as **draft proposals**, with the banner controlled by `editorialStatus: draft`. Neither part of a pair inherits a booking from the other.

Run `npm run content:validate` after edits, or restart `npm run dev`. This checks the schema, status/date combinations, duplicate IDs, and Luxembourg-local month boundaries. The generated browser JSON is ignored by Git and rebuilt before development and production builds.

- `proposed`: use `targetMonth: "YYYY-MM"`; do not add a date.
- `scheduled` or `completed`: remove `targetMonth` and provide a verified ISO `startsAt` with offset, for example `2026-10-15T12:00:00+02:00` (illustrative syntax only).
- `cancelled`: retain exactly one of `startsAt` or `targetMonth`, with an optional reason.
- Add `location` when the public venue or online location is verified. Do not publish private meeting links.
- Keep IDs stable, public summaries readable, and formats separate from audience tracks.
- A pair has exactly one talk and one workshop with the same `pairId`, track, and target month while both are proposals. Keep their `editorialOrder` adjacent so they read as a pair in the timeline.
- Presenter fields, private links, and unknown properties are rejected by the strict schema.

All 30 pairs are visible as proposals; this is a programming backlog, not a promise to run 60 events. Prior-coverage notes remain in the editorial board. Changes merged into `main` are published to Firebase Hosting by the deployment workflow after validation and browser checks.

## Season grid labels and symbols

`topics.yaml` stores one short `label` (up to 32 characters) and `symbol` per `pairId`. Use a concise description of the real topic, not the reference image’s sample curriculum. Both parts of a pair share the label; dates and statuses continue to come from their individual session files. The schema lists supported geometric symbols, drawn in `src/TopicSymbol.tsx`.

Add topic metadata when adding a new pair; remove it only when its last session is removed. Validation rejects missing/orphaned pair metadata, unknown symbols and empty labels. Placement is derived from session records, so moving a pair updates the grid automatically. Multiple pairs in the same month/track remain visible. Unpaired sessions use their full title and a neutral circle.
