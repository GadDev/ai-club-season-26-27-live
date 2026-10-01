# Technical stack

**Decision status:** V1 development slice implemented, 29 September 2026. The application builds locally and has CI checks; public deployment is not enabled.

## V1: season timeline

| Concern | Choice | Reason |
| --- | --- | --- |
| Interface | React + TypeScript | A small interactive timeline that the current engineering community can maintain; the next phase also adds account-based interaction. |
| Build | Vite | Fast local iteration and a static production bundle. |
| Styling | Tailwind CSS plus a few purpose-built components | Responsive editorial layout. Add a component library only when repeated interaction warrants it. |
| Content | One YAML file per session in Git | Reviewable programme edits without a CMS or runtime API. |
| Validation | Zod and cross-record checks at build time | Prevent invalid statuses, dates, and duplicate IDs from reaching the site. |
| Hosting | GitHub Pages via GitHub Actions | The programme and session details are public; static delivery from this repository is suitable. |
| Backend, login, database | None for V1 | Browsing the season requires no personal data or server state. |

This choice favors contributor familiarity and the planned voting phase. For a single read-only timeline, Astro would also work well; it can be reconsidered before scaffolding if the team prefers a content-first framework. Avoid introducing Astro and React together merely for this one view.

### V1 content model

The primary axes are **October 2026–June 2027 × audience track**. A month/track cell may contain several sessions or none. A stable session ID survives title changes and can later identify a vote or replay. Subject domain and teaching format remain separate metadata.

```text
content/
  season.yaml
  sessions/
    agent-evaluation.yaml
src/
  content/
    schema.ts
    load.ts
  features/
    timeline/
scripts/
  validate-content.ts
```

```yaml
# Illustrative proposal, not an announced event or ballot choice
id: agent-evaluation
title: Evaluating AI Agents
track: engineering
domain: operate-ai
format: [workshop]
status: proposed
targetMonth: "2027-03"
summary: Design an evaluation set and inspect agent failure modes.
editorialOrder: 2
```

Tracks: `foundations`, `engineering`, `deep-dive`. Draft domains: `understand-ai`, `build-with-ai`, `develop-with-ai`, `operate-ai`, `frontier`; test these against the real session inventory before freezing them. Formats: `talk`, `workshop`, `demo`, `lab`, `discussion`. Editorial statuses: `proposed`, `scheduled`, `completed`, `cancelled`.

A proposal has a target month, without a fabricated day. A scheduled session needs a confirmed `startsAt` instant with an explicit offset; format it for `Europe/Luxembourg`. Derive its displayed month from that instant instead of maintaining a second month field. `completed` is an editorial update, while past/upcoming is computed from time. A cancelled session retains its record and, when appropriate, a reason. Do not infer dates from a brainstorm. Presenter names, biographies, and IDs are not part of the V1 content schema or public page.

The page can calculate the next confirmed scheduled session in a small browser function using the current clock, so the highlight does not become stale between static builds. The rest of the timeline remains a static bundle. The site uses query-based views for public session details and About, without a router dependency; GitHub Pages can serve direct links and refreshes. Voting and materials views are labelled design previews only. On mobile, use month sections that retain the three track labels; provide semantic list markup alongside any visual grid.

CI checks the content schema, duplicate IDs, status-specific fields, TypeScript, and the production build. Test the date/status logic and keyboard access where errors would affect navigation. Dependencies are recorded in package-lock.json; Node 24.19.0 is pinned in .nvmrc for local work and CI.

For the project Pages URL, set Vite `base` to `/`. This repository is public. The programme and session details are intended for public reading, but editorial approval still precedes publication. Internal meeting links, client details, private contact information, presenter identity, and unpublished material stay out of both source files and build output. Pages is a static host, not an authorization boundary.

## V2: SFEIR-account voting

Voting changes the system boundary. Keep the timeline content and stable session IDs. Add an identity flow using the SFEIR-approved account provider, a server-side API, and durable storage for eligibility and votes. The server must enforce one effective choice per eligible SFEIR account; a disabled UI button or local storage is insufficient. Define the ballot, voting window, change/retraction policy, tie handling, audit needs, and how the result becomes a final selection before selecting a provider or database.

A static frontend may remain on Pages while calling an authenticated API if the organization approves that deployment and origin model. Alternatively, move the application to a host with integrated server rendering. GitHub Pages itself cannot process protected votes. Do not prebuild authentication or a database for V1.

## V3: presentations and replays

Store links to approved slides and recordings in session content first. If the application must host media, choose storage, delivery, access control, retention, and publication rights based on actual file sizes and SFEIR policy. Do not put replay video in Git or assume a public Pages URL can restrict it to SFEIR accounts.

## Implementation references

- [React: build an app from scratch](https://react.dev/learn/build-a-react-app-from-scratch)
- [Vite: deploy a static site](https://vite.dev/guide/static-deploy)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Zod basics](https://zod.dev/basics)
