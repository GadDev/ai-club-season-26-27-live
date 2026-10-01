# AI Club · Season 2026–2027 

[![CI](https://github.com/GadDev/ai-club-season-26-27/actions/workflows/ci.yml/badge.svg)](https://github.com/GadDev/ai-club-season-26-27/actions/workflows/ci.yml)
[![Deploy](https://github.com/GadDev/ai-club-season-26-27/actions/workflows/pages.yml/badge.svg)](https://github.com/GadDev/ai-club-season-26-27/actions/workflows/pages.yml)
![Node.js 24](https://img.shields.io/badge/Node.js-24.x-339933?logo=node.js&logoColor=white)
[![License: MIT](https://img.shields.io/badge/Code-MIT-blue.svg)](LICENSE)
[![Content: CC BY 4.0](https://img.shields.io/badge/Content-CC%20BY%204.0-lightgrey.svg)](CONTENT_LICENSE.md)

**The public programme and knowledge hub for the SFEIR Luxembourg AI Club — a structured learning season for engineers, from AI foundations to advanced engineering topics.**

October 2026 → June 2027 · Talks · Workshops · Three learning tracks

**[Explore the programme →](https://gaddev.github.io/ai-club-season-26-27/)** · [Browse the season board](docs/SEASON_BOARD.md) · [Contribute](CONTRIBUTING.md)

[![AI Club 2026–2027 season timeline](design/reviews/season-grid/desktop.png)](https://gaddev.github.io/ai-club-season-26-27/)

## About

AI Club gives SFEIR Luxembourg engineers a shared season of practical AI learning while keeping the public programme honest about what is proposed, confirmed, or available.

The repository contains the working V1 programme: a responsive nine-month timeline, public session-detail and About pages, validated YAML content, and the Signal Index design system. The editorial backlog contains **30 candidate topic pairs represented by 60 draft talk/workshop proposals**; those proposals are not commitments to deliver 60 events.

The product evolves in three deliberately small stages: a public **timeline**, then eligible-member **voting**, then approved **materials and replays**.

## Three learning tracks

| Track | Level | Focus |
| --- | --- | --- |
| **Foundations** | Beginner | Build strong AI concepts, vocabulary, and practical confidence. |
| **Engineering** | Practitioner | Apply AI techniques, tools, and workflows to real software engineering problems. |
| **Deep Dive** | Advanced | Explore architecture, internals, evaluation, safety, and emerging engineering techniques. |

## Programme status

| Capability | Status |
| --- | --- |
| Season timeline | ✅ V1 live |
| Public session details | ✅ Available |
| Candidate topics | ✅ 60 draft proposals / 30 pairs |
| Confirmed scheduled events | ⏳ None yet |
| Voting | 🧭 Planned — visual preview only |
| Materials and replays | 🧭 Planned — visual preview only |

Until a session has a verified topic, date, Luxembourg-local time, and public location, it remains a proposal.

## Contributing content

Want to propose or edit a session? You do **not** need to change the React application.

Start with the [content authoring guide](content/README.md) for the YAML model, editorial rules, statuses, and validation workflow. For code, design, or repository changes, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Development

### Requirements

- Node.js 24.19.0 (`.nvmrc`)
- npm

### Install and run

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite under `/ai-club-season-26-27/`. After editing YAML content, restart the development command so generated content is refreshed.

## Quality checks

| Command | Purpose |
| --- | --- |
| `npm run content:validate` | Validate programme YAML and content rules |
| `npm run typecheck` | Validate content and run TypeScript checks |
| `npm run build` | Build the production site |
| `npm test` | Run content/date/status tests with Vitest |
| `npm run test:e2e` | Run Playwright browser, navigation, and accessibility checks |

Install Chromium once before running the browser suite locally:

```sh
npx playwright install chromium
npm run test:e2e
```

CI runs the production build, content tests, production dependency audit, and Playwright checks on pushes and pull requests. See the [CI/CD quality-gate guide](docs/CI_CD.md) for Dependabot, labels, branch rules, and workflow details.

## Technology

**React · TypeScript · Vite · Tailwind CSS · Zod · Vitest · Playwright**

Programme content lives in validated YAML. The application is a static Vite build published through GitHub Pages; architecture and future system boundaries are documented in the [technical stack](docs/TECH_STACK.md).

## Documentation

### Programme and editorial

- [Mission](docs/MISSION.md) — purpose, tracks, and release sequence.
- [Constitution](docs/CONSTITUTION.md) — product and editorial principles.
- [Season board](docs/SEASON_BOARD.md) — tentative topic placement, prior coverage, and confirmed-event lane.
- [Content authoring](content/README.md) — session data model and editing workflow.

### Design

- [Art direction](docs/ART_DIRECTION.md) — explored visual branches and the selected Signal Index direction.
- [Design system](docs/DESIGN_SYSTEM.md) — product-level visual and accessibility principles.
- [Implementation guide](design/README.md) — foundations, typography, components, icons, and tokens.
- [Layout rules](design/LAYOUTS.md) — responsive composition, shared page shell, routing, and page behaviour.
- [Visual references](design/references/README.md) — moodboard, UI specimen, desktop/mobile references, and future concepts.

### Engineering and governance

- [Technical stack](docs/TECH_STACK.md) — V1 architecture and later system boundaries.
- [CI/CD and quality gates](docs/CI_CD.md) — Dependabot, labels, Actions workflows, and branch/PR rules.
- [Contributing](CONTRIBUTING.md) — development and contribution workflow.
- [Code of Conduct](CODE_OF_CONDUCT.md) — community expectations.
- [Security](SECURITY.md) — private reporting process for security issues.
- [Support](SUPPORT.md) — support boundaries and expectations.

## Publishing

GitHub Pages is published by the **Publish programme** workflow after a successful production build, content tests, and browser checks on `main`. The workflow can also be triggered manually.

## License

Application source code is licensed under the [MIT License](LICENSE). Original educational, editorial, and eligible design content is licensed under [CC BY 4.0](CONTENT_LICENSE.md).

Third-party assets, trademarks, fonts, screenshots, and reference material retain their original rights and are not automatically relicensed.
