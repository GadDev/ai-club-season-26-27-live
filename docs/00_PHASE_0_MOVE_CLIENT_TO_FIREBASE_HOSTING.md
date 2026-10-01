# Phase 0 — Move Client to Firebase Hosting

**Project:** SFEIR Luxembourg AI Club Season 26–27  
**Repository:** `GadDev/ai-club-season-26-27`  
**Phase:** 0  
**Status:** Implementation plan  
**Goal:** Move the existing React/Vite client from GitHub Pages to Firebase Hosting without changing product behavior.

---

# 1. Objective

The first implementation milestone is intentionally narrow:

> Move the existing client from GitHub Pages to Firebase Hosting while preserving the current application behavior and visual output.

This phase does **not** include:

- backend implementation;
- Firebase Authentication integration;
- Firestore usage from the browser;
- voting API integration;
- Cloud Run;
- Cloud Run Jobs;
- backend IAM;
- result publication.

The client should look and behave the same after the move.

---

# 2. Why We Do This First

Firebase Hosting is part of the target production architecture.

Moving the client first gives us:

```text
stable production host
+
security headers
+
root-based routing
+
future same-origin /api routing
+
Firebase project foundation
```

before backend work begins.

This reduces later migration work.

---

# 3. Current State

The application currently deploys to GitHub Pages.

Current production path:

```text
https://gaddev.github.io/ai-club-season-26-27/
```

The Vite configuration currently assumes the GitHub Pages repository subpath:

```ts
base: "/ai-club-season-26-27/"
```

The Playwright configuration and some tests also reference:

```text
/ai-club-season-26-27/
```

The current deployment workflow is:

```text
.github/workflows/pages.yml
```

and deploys the generated:

```text
dist/
```

directory to GitHub Pages.

---

# 4. Target State

After Phase 0:

```text
GitHub
  ↓
CI
  ↓
Vite build
  ↓
Firebase Hosting
```

The application should be served from the site root:

```text
https://<firebase-site>.web.app/
```

or later:

```text
https://<custom-domain>/
```

Vite base path:

```text
/
```

---

# 5. Target Repository State

After the migration:

```text
ai-club-season-26-27/
├── src/
├── content/
├── design/
├── docs/
├── tests/
│
├── firebase.json
├── .firebaserc.example
├── vite.config.ts
├── playwright.config.ts
│
└── .github/
    └── workflows/
        ├── ci.yml
        └── firebase-hosting.yml
```

The old:

```text
.github/workflows/pages.yml
```

is removed only after Firebase Hosting has been validated.

---

# 6. Phase 0 Work Breakdown

```text
C01 — Remove GitHub Pages path coupling
C02 — Add Firebase Hosting configuration
C03 — Create Firebase project and perform first manual deployment
C04 — Add GitHub Actions deployment with Workload Identity Federation
C05 — Cut over from GitHub Pages
```

These can remain separate PRs or be combined where appropriate.

Recommended:

```text
PR 1 → C01 + C02
PR 2 → C04
PR 3 → C05
```

The initial manual deployment happens between PR 1 and PR 2.

---

# 7. C01 — Remove GitHub Pages Path Coupling

## Goal

Make the application deployable at:

```text
/
```

instead of:

```text
/ai-club-season-26-27/
```

---

## 7.1 Update Vite

Current:

```ts
export default defineConfig({
  base: "/ai-club-season-26-27/",
  plugins: [react(), tailwindcss()],
});
```

Target:

```ts
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
});
```

---

## 7.2 Update Playwright

Current local preview URL:

```text
http://127.0.0.1:4173/ai-club-season-26-27/
```

Target:

```text
http://127.0.0.1:4173/
```

Update:

```text
playwright.config.ts
```

Example:

```ts
use: {
  baseURL: "http://127.0.0.1:4173/",
},

webServer: {
  command: "npm run preview -- --port 4173",
  url: "http://127.0.0.1:4173/",
}
```

---

## 7.3 Remove Hard-Coded Path References

Search the repository for:

```text
/ai-club-season-26-27/
gaddev.github.io/ai-club-season-26-27
```

Review references in:

```text
tests/
README.md
docs/
issue templates
screenshots/review documentation
```

Not every historical reference must be replaced.

Update only references that represent:

```text
live application URL
runtime path
test path
canonical deployment
```

Historical documentation can remain unchanged where context requires it.

---

# 8. C01 Validation

Run:

```bash
npm ci
npm run build
npm test
npm run test:e2e
```

Then:

```bash
npm run preview
```

Verify:

```text
http://127.0.0.1:4173/
```

---

## Done When

- [x] app builds;
- [x] unit/content tests pass;
- [x] Playwright tests pass;
- [x] assets load correctly;
- [x] no runtime request depends on the GitHub Pages path;
- [x] deep links still behave correctly with SPA routing.

---

# 9. C02 — Firebase Hosting Configuration

Add:

```text
firebase.json
```

Initial configuration:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

The SPA rewrite ensures application routes return:

```text
index.html
```

instead of a Hosting 404.

---

# 10. Security Headers

One major reason for moving away from GitHub Pages is control over response headers.

Add Firebase Hosting headers deliberately.

Suggested starting point:

```json
{
  "source": "**",
  "headers": [
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "key": "Referrer-Policy",
      "value": "strict-origin-when-cross-origin"
    },
    {
      "key": "Permissions-Policy",
      "value": "camera=(), microphone=(), geolocation=()"
    }
  ]
}
```

---

# 11. Content Security Policy

Do not deploy a speculative strict CSP immediately.

The client does not yet use Firebase Authentication.

Recommended Phase 0 approach:

### Step 1

Deploy a basic CSP compatible with the current static application.

Example starting point:

```text
default-src 'self';
base-uri 'self';
object-src 'none';
frame-ancestors 'none';
img-src 'self' data:;
font-src 'self';
style-src 'self' 'unsafe-inline';
script-src 'self';
connect-src 'self';
```

### Step 2

Test locally and on Firebase Hosting.

### Step 3

When Firebase Auth is added later, update:

```text
connect-src
frame-src
script-src
```

only for the exact Google/Firebase endpoints required by the chosen auth flow.

---

# 12. Suggested `firebase.json`

Initial example:

```json
{
  "hosting": {
    "public": "dist",

    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],

    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],

    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          },
          {
            "key": "Permissions-Policy",
            "value": "camera=(), microphone=(), geolocation=()"
          },
          {
            "key": "Content-Security-Policy",
            "value": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self';"
          }
        ]
      }
    ]
  }
}
```

This must be validated against the actual application before merge.

---

# 13. Cache Strategy

Static hashed Vite assets may use long cache lifetimes.

Example future rule:

```text
/assets/**
Cache-Control:
public, max-age=31536000, immutable
```

HTML should remain short-lived:

```text
/index.html
Cache-Control:
no-cache
```

This is optional for the first deployment.

Do not block the migration on advanced cache tuning.

---

# 14. `.firebaserc`

Avoid committing environment-specific project IDs unless there is a clear reason.

Options:

## Option A — committed aliases

```json
{
  "projects": {
    "default": "sfeir-ai-club-client-prod"
  }
}
```

Simple, but binds the repository directly to one project.

## Option B — CI uses explicit project ID

Preferred for our environment strategy.

Use:

```bash
firebase deploy --project "$GCP_PROJECT_ID"
```

Then keep only:

```text
.firebaserc.example
```

or no `.firebaserc` at all.

---

# 15. C03 — Create Firebase Project

Create a dedicated Firebase/GCP project for the client deployment.

Recommended naming:

```text
sfeir-ai-club-client-prod
```

or:

```text
sfeir-ai-club-voting-prod
```

If frontend + backend will eventually share the same GCP/Firebase production project, prefer:

```text
sfeir-ai-club-voting-prod
```

This keeps:

```text
Hosting
Authentication
Firestore
Cloud Run
```

inside one production project.

---

# 16. Recommended Project Decision

Use **one production Firebase/GCP project** for the whole voting platform:

```text
sfeir-ai-club-voting-prod
```

The client repo deploys only Firebase Hosting.

The backend repo later manages:

```text
Firestore
Cloud Run
Secret Manager
backend IAM
Cloud Run Jobs
```

within the same project.

This avoids unnecessary cross-project authentication and routing.

---

# 17. Firebase Project Bootstrap

One-time manual steps:

```text
1. Create Google Cloud/Firebase project
2. Add Firebase
3. Enable Firebase Hosting
4. Create Hosting site
5. Record project ID
6. Record Hosting URL
```

Do not enable Firebase Authentication yet unless needed.

That belongs to a later phase.

---

# 18. First Manual Deployment

Install/use Firebase CLI.

Build:

```bash
npm ci
npm run build
```

Deploy:

```bash
firebase deploy \
  --project <PROJECT_ID> \
  --only hosting
```

---

# 19. Manual Deployment Validation

Compare Firebase and GitHub Pages side by side.

Check:

```text
hero
navigation
catalogue
programme page
voting preview page
responsive layout
fonts
images
SVGs
links
hash/query navigation
mobile menu
footer
404 behavior
```

---

# 20. Header Validation

Use browser DevTools or:

```bash
curl -I https://<firebase-site>.web.app/
```

Verify:

```text
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
```

Also verify CSP does not break:

```text
fonts
scripts
images
styles
```

---

# 21. C03 Gate

Do not replace GitHub Pages until:

- [ ] Firebase build matches current deployment;
- [ ] mobile tested;
- [ ] desktop tested;
- [ ] Playwright passes;
- [ ] no CSP violation breaks functionality;
- [ ] headers are present;
- [ ] SPA deep links work;
- [ ] asset loading is clean;
- [ ] browser console has no new deployment-related errors.

---

# 22. C04 — Firebase Hosting CI/CD

After the manual deployment succeeds, automate it.

Target:

```text
GitHub Actions
    ↓
OIDC
    ↓
Google Workload Identity Federation
    ↓
Hosting deploy identity
    ↓
Firebase Hosting
```

---

# 23. Why WIF

Do not store:

```text
service-account JSON
FIREBASE_TOKEN
```

in GitHub.

Use short-lived credentials obtained at workflow runtime.

---

# 24. Client Deployment Identity

Create a service account such as:

```text
ai-club-client-deployer@PROJECT_ID.iam.gserviceaccount.com
```

Its responsibilities:

```text
deploy Firebase Hosting only
```

It must not receive:

```text
Firestore data access
Secret Manager access
Cloud Run Admin
Owner
Editor
```

---

# 25. GitHub WIF Trust

The trust must be restricted to:

```text
GadDev/ai-club-season-26-27
main branch
production environment
```

Prefer numeric:

```text
repository_id
repository_owner_id
```

claims rather than mutable repository names where practical.

---

# 26. GitHub Environment

Create:

```text
production
```

Use it for Hosting deployment.

Later the backend repository will have separate environments for backend deploy and privileged operations.

---

# 27. Deployment Workflow Skeleton

Target:

```yaml
name: Deploy client to Firebase Hosting

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  id-token: write

concurrency:
  group: ai-club-client-production
  cancel-in-progress: false

jobs:
  deploy:
    environment: production
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@<PINNED_SHA>

      - name: Set up Node
        uses: actions/setup-node@<PINNED_SHA>
        with:
          node-version-file: .nvmrc
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Validate
        run: |
          npm run build
          npm test

      - name: Install Playwright
        run: npx playwright install --with-deps chromium

      - name: End-to-end tests
        run: npm run test:e2e

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@<PINNED_SHA>
        with:
          project_id: ${{ vars.GCP_PROJECT_ID }}
          workload_identity_provider: ${{ vars.GCP_WIF_PROVIDER }}
          service_account: ${{ vars.GCP_CLIENT_DEPLOYER_SERVICE_ACCOUNT }}

      - name: Install Firebase CLI
        run: npm install --global firebase-tools@<PINNED_VERSION>

      - name: Deploy
        run: |
          firebase deploy \
            --project "${{ vars.GCP_PROJECT_ID }}" \
            --only hosting \
            --non-interactive
```

---

# 28. Keep Existing CI

Do not move every validation concern into the deploy workflow.

Keep:

```text
ci.yml
```

as the required PR gate.

Deployment workflow may repeat the critical build/tests for safety, but CI remains the review gate.

---

# 29. C05 — Cutover

After CI/CD deployment is stable:

```text
Firebase Hosting becomes canonical
```

Actions:

```text
update README
update badges/links if needed
update documentation
update issue templates
remove GitHub Pages deployment workflow
disable GitHub Pages in repository settings when appropriate
```

---

# 30. Do Not Delete GitHub Pages Immediately

Recommended migration:

```text
GitHub Pages live
        +
Firebase Hosting live
        ↓
compare
        ↓
Firebase validated
        ↓
switch links/canonical URL
        ↓
disable GitHub Pages workflow
```

This gives us a straightforward rollback during migration.

---

# 31. Rollback During Phase 0

If Firebase Hosting deployment has a major issue:

```text
keep / re-enable GitHub Pages workflow
```

because the application remains static.

No data migration exists yet.

No voter data can be lost.

This makes Phase 0 extremely low-risk.

---

# 32. Custom Domain

Custom domain is optional for Phase 0.

Do not block migration on DNS.

Start with:

```text
<site>.web.app
```

Later move to something like:

```text
ai-club.sfeir.com
```

or the final agreed domain.

Firebase Hosting manages TLS certificates for connected custom domains.

---

# 33. Future `/api/**` Rewrite

Do **not** add the Cloud Run rewrite yet.

The backend does not exist.

Later:

```text
/api/**
→ Cloud Run ai-club-voting-api
```

will be added as a dedicated client PR.

Phase 0 keeps only:

```text
SPA fallback
```

---

# 34. Firebase Authentication

Do not integrate Auth in Phase 0.

Later client phase:

```text
Firebase Web SDK
Google provider
AuthProvider
```

Doing Hosting first keeps migration risk isolated.

---

# 35. Firestore

Do not add browser Firestore logic in Phase 0.

The future architecture explicitly requires:

```text
browser
✕
voting Firestore data
```

The backend will be the data boundary.

---

# 36. Phase 0 Test Plan

## Automated

```text
npm run content:validate
npm run typecheck
npm run build
npm test
npm run test:e2e
```

## Manual desktop

```text
Chrome
navigation
catalogue
programmes
voting preview
responsive layout
asset loading
```

## Manual mobile

```text
mobile viewport
navigation
typography
cards
scrolling
touch targets
```

## Hosting

```text
root URL
deep links
refresh on deep link
headers
404 behavior
asset caching
```

---

# 37. Security Test Plan

Verify:

```text
no service-account JSON in repository
no Firebase deployment token in repository
no secrets in Vite environment
CSP present
frame embedding blocked
nosniff present
Referrer-Policy present
Permissions-Policy present
```

---

# 38. Performance Check

Compare:

```text
Firebase Hosting
vs
current GitHub Pages
```

At minimum:

```text
first page load
asset load failures
font loading
image loading
layout shift
```

The move should not introduce a noticeable regression.

---

# 39. Documentation Updates

Update:

```text
README.md
docs/TECH_STACK.md
docs/CI_CD.md
CONTRIBUTING.md
```

where they describe:

```text
GitHub Pages
base path
production URL
deployment workflow
```

Do not rewrite unrelated documentation during the migration.

---

# 40. Phase 0 Definition of Done

Phase 0 is complete when:

```text
[ ] application runs from /
[ ] Vite no longer depends on GitHub Pages base path
[ ] Playwright runs against /
[ ] Firebase Hosting project exists
[ ] firebase.json committed
[ ] Hosting headers validated
[ ] first Firebase deployment validated
[ ] WIF deployment works
[ ] GitHub stores no GCP static key
[ ] Firebase URL is canonical
[ ] README/docs point to Firebase
[ ] GitHub Pages deployment disabled
[ ] current CI remains green
```

---

# 41. Phase 0 Exit Architecture

At the end of this phase:

```text
GitHub
   │
   │ PR / merge
   ▼
CI
   │
   ▼
GitHub Actions
   │
   │ OIDC
   ▼
Workload Identity Federation
   │
   ▼
Client deploy service account
   │
   ▼
Firebase Hosting
   │
   ▼
React / Vite AI Club application
```

There is still:

```text
no backend
no Firestore voting data
no authentication flow
```

That is intentional.

---

# 42. What Happens Next

After Phase 0 is stable:

```text
create:
GadDev/ai-club-voting-backend
```

Then begin:

```text
B01 — Fastify backend skeleton
```

The backend roadmap starts only after the client hosting migration is complete.

---

# 43. Recommended Immediate Work

Start with one focused PR:

```text
chore(hosting): prepare client for Firebase Hosting
```

Scope:

```text
vite base path
Playwright paths
hard-coded deployment URLs
firebase.json
security headers
documentation note
```

Do not include WIF or production cutover in the same PR unless the Firebase project already exists.

This keeps the first change easy to review and easy to revert.
