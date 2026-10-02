# CI/CD and repository quality gates

This repository uses GitHub Actions, Dependabot, GitHub repository rules, and a declarative label catalog to keep changes reviewable and the published programme reproducible.

## Pull request quality gate

Every pull request to `main` runs the `CI` workflow. The required status remains named `check` so the repository ruleset has one stable gate even if the internal jobs evolve.

The gate succeeds only when all of these jobs succeed:

- **PR metadata** — validates a Conventional Commit-style pull request title, for example `feat(schedule): add session filters`.
- **Build and unit tests** — installs from the lockfile, validates content and TypeScript through the production build, and runs the test suite.
- **Browser tests** — builds the site and runs the Playwright end-to-end suite in Chromium.
- **Dependency audit** — runs `npm audit --omit=dev --audit-level=high` against production dependencies and blocks high/critical known vulnerabilities.

CI is intentionally triggered for pull requests rather than every feature-branch push. A pull request update already triggers the same validation, avoiding duplicate runs. The Firebase Hosting deployment workflow performs the production build and tests again on `main` immediately before deployment.

GitHub Actions are pinned to immutable commit SHAs. Dependabot is responsible for proposing reviewed updates to those pins.

### Dependency Review upgrade path

GitHub's Dependency Review action provides a better PR-diff-aware dependency gate, but it requires GitHub Dependency Graph to be enabled for the repository. Dependency Graph is currently disabled here, so using the action would make every pull request fail before any dependency analysis could occur.

If Dependency Graph is enabled later under repository security settings, replace or supplement the npm audit job with `actions/dependency-review-action` and fail on high severity. Keep the action pinned to an immutable commit SHA.

## Dependabot

`.github/dependabot.yml` checks two ecosystems every Monday in the Luxembourg timezone:

- npm dependencies at 06:00;
- GitHub Actions at 06:30.

Minor and patch updates are grouped to reduce pull-request noise. Major updates remain separate so breaking changes receive explicit review.

Dependabot pull requests go through the same CI and branch rules as human-authored changes.

## Repository labels

`.github/labels.json` is the source of truth for repository-managed labels.

`Sync repository labels` runs when the catalog changes on `main` and creates or updates labels using GitHub CLI. It does **not** delete labels that are absent from the catalog, which makes the sync safe for manually managed or GitHub-provided labels.

`Label pull requests` applies area/type labels from `.github/labeler.yml` based on changed files. It uses `pull_request_target` without checking out or executing pull-request code.

## Default-branch rules

The active `Protect main` repository ruleset protects the default branch.

It:

- blocks branch deletion;
- blocks non-fast-forward updates and force pushes;
- requires changes through a pull request;
- requires review conversations to be resolved;
- allows squash merging only;
- requires `GitGuardian Security Checks`;
- requires the `check` CI status;
- requires pull request branches to be up to date with `main` before merging.

For a single-maintainer repository, the approval count remains **0**. If another regular maintainer joins, revisit required approvals and code-owner review.

## Deployment

`Deploy Firebase Hosting` runs only for `main` or through manual dispatch. It:

1. installs dependencies from `package-lock.json`;
2. builds and validates the application;
3. runs unit/content tests;
4. runs Playwright browser tests;
5. requests a short-lived GitHub OIDC token;
6. authenticates to Google Cloud through Workload Identity Federation;
7. impersonates the dedicated `ai-club-client-deployer` service account;
8. deploys `dist/` to Firebase Hosting.

The workflow receives only:

- `contents: read` to check out the repository;
- `id-token: write` to request the GitHub OIDC token.

No long-lived Google Cloud service-account key or Firebase deployment token is stored in GitHub.

The Workload Identity provider is restricted to the production repository and `main` branch. The deployer service account has only the permissions required for Firebase Hosting deployment.

The production site is:

`https://ai-club-lux.web.app`

## Failure policy

Do not bypass or weaken a failing required check to merge a change. Fix the cause, or if the check itself is incorrect, change the check in a dedicated pull request with the reason documented.
