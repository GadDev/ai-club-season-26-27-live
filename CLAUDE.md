# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The public programme site for the SFEIR Luxembourg AI Club (Oct 2026 – Jun 2027): a static React/Vite site built from validated YAML content and published to Firebase Hosting. V1 is a read-only season timeline plus a topic catalog; voting and materials/replays are labelled design previews only (no backend, login, or database exist yet — see `docs/TECH_STACK.md` for the V2/V3 boundaries).

## Commands

```sh
nvm use                       # Node 24.19.0, pinned in .nvmrc
npm ci
npm run dev                   # validates content, then starts Vite on 127.0.0.1
npm run content:validate      # Zod-validate YAML, regenerate src/content/generated.json
npm run typecheck             # content:validate + tsc --noEmit
npm run build                 # typecheck + vite build (this is what CI treats as the source of truth)
npm test                      # vitest run tests/content.test.ts
npx vitest run tests/catalog.test.ts   # the other unit suite isn't wired into `npm test`; run it directly
npx playwright install chromium        # one-time browser install
npm run test:e2e              # Playwright: tests/catalog.spec.ts, tests/timeline.spec.ts
```

To run one Playwright test: `npx playwright test tests/timeline.spec.ts -g "test name"`.

There is no lint script; formatting is via Prettier (`npx prettier --check .` / `--write .`).

`src/content/generated.json` is build output (git-ignored). It's produced by `content:validate` and imported directly by `src/App.tsx` and the test suites — regenerate it (`npm run content:validate`) after editing anything in `content/`, or tests/dev server will see stale data.

## Content pipeline (the core architecture)

Programme data flows one way: **YAML in `content/` → Zod validation/derivation in `src/content/schema.ts` → generated JSON → React reads at runtime.**

- `content/season.yaml` — one season record (id/date range/editorial status).
- `content/sessions/*.yaml` — one file per talk/workshop. 60 files currently, forming 30 topic pairs (`pairId: P01`..`P30`), one talk + one workshop per pair, per `content/README.md`.
- `content/topics.yaml` — one label + geometric symbol per `pairId`, rendered by `src/TopicSymbol.tsx`. Every `pairId` referenced by a session must have topic metadata and vice versa (enforced by `validateTopics`).
- `scripts/validate-content.ts` reads all of the above, runs `seasonSchema` / `validateSessions` / `validateTopics` from `src/content/schema.ts`, and writes `src/content/generated.json`. This script is what `npm run dev`, `typecheck`, `build`, and `test` all depend on transitively.
- `src/content/model.ts` has the derived helpers consumed by the UI: `sessionMonth` (computes a session's Europe/Luxembourg month from `startsAt` or `targetMonth`), `nextEvent` (earliest future `scheduled` session), `monthLabel`/`dateLabel` formatters, and the fixed `tracks`/`months` lists.

Key schema rules to preserve when touching `src/content/schema.ts` or session YAML (also documented in `content/README.md`):
- Status is a discriminated union: `proposed` needs `targetMonth` only; `scheduled`/`completed` need a `startsAt` ISO instant with explicit UTC offset (never a bare month); `cancelled` needs exactly one of the two, optionally with a `reason`.
- All session objects are `z.strictObject` — unknown properties (e.g. presenter names, private links) are rejected by design. Presenter identity is intentionally out of the V1 schema.
- IDs must be unique across sessions; a pair's two sessions share `track` and (while both are proposals) the same target month, with adjacent `editorialOrder`.
- Month placement is always derived (`sessionMonth`), never hand-maintained as a second field.

## Two independent "catalog" systems — don't conflate them

The repo has two unrelated things both called "catalog":

1. **Programme content** (`content/`, `src/content/schema.ts`, `src/content/model.ts`) — the real, editorially-governed season data described above. This drives the season timeline (`src/App.tsx`, `src/SeasonGrid.tsx`, `src/Pages.tsx`).
2. **Topic catalog page data** (`src/content/catalog-types.ts`, `src/content/catalog.ts`, `src/content/catalog-data-{1..4}.ts`) — a much larger, procedurally-expanded reference library (`CatalogTopic[]`) rendered by `src/CatalogPage.tsx` at `?page=catalog`. Titles/descriptions/statuses here are deterministically generated from compact `Concept` records (a packed hex `meta` string is decoded per-field via `decode()` in `catalog.ts` to pick format/curriculum_status/voting_status/durability). If you add or edit a concept, edit the `catalog-data-*.ts` source records and the encoded `meta` string together — don't hand-edit derived `CatalogTopic` fields, they're computed, not stored.

`docs/ai_club_reference_curricula/` (untracked in git status as of this writing) holds the source curricula/topic research that `catalog-data-*.ts` was derived from — treat it as reference material, not something the app reads at runtime.

## Editorial/content conventions (see `content/README.md` and `CONTRIBUTING.md`)

- Never present a tentative date, venue, or topic as confirmed. `proposed` sessions must not get a fabricated day.
- Run `npm run content:validate` after any YAML edit — it catches duplicate IDs, orphaned topic metadata, invalid status/date combinations, and unknown symbols.
- PR titles are enforced by CI as Conventional Commits: `type(scope): description` with types `feat|fix|docs|chore|refactor|test|ci|build|perf|revert`.

## CI gate (`docs/CI_CD.md`)

The required check is named `check` and covers: PR title lint, build+typecheck+content-validate+unit tests, Playwright in Chromium, and `npm audit --omit=dev --audit-level=high`. GitHub Actions are pinned to commit SHAs. Don't bypass or weaken a failing required check — fix the cause, or change the check itself in its own PR with rationale.

## Routing

No router dependency: `src/App.tsx` reads `?page=` and `?session=` query params directly, so `page`/`sessionId` state and `sessionHref()` (`src/Pages.tsx`) are the whole navigation model. Vite `base` is `/` because Firebase Hosting serves the application from the domain root.

`firebase.json` rewrites unmatched requests to `/index.html`, preserving SPA navigation and direct refreshes.
