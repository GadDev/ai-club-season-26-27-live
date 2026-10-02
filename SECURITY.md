# Security policy

## Supported version

This repository publishes a continuously deployed website from the `main` branch. Security fixes are applied to the current version; older commits or forks are not maintained as supported releases.

## Reporting a vulnerability

Please **do not disclose security vulnerabilities in a public issue, pull request, discussion, or social post**.

Preferred reporting path:

1. Open the repository's **Security** tab.
2. If **Report a vulnerability** is available, use GitHub's private vulnerability reporting flow.
3. If private reporting is not available, open a public issue titled `Security contact request` containing no vulnerability details. A maintainer can then establish a private channel.

Include, when possible:

- the affected page, component, workflow, or dependency;
- clear reproduction steps;
- expected and observed impact;
- browser/runtime information when relevant;
- a minimal proof of concept that does not expose real user data or secrets;
- any suggested remediation.

## Response expectations

Maintainers will acknowledge valid reports when they are able to assess them, investigate impact, and coordinate remediation before public disclosure. This is a community project and does not provide a formal SLA.

## Scope

Useful reports include vulnerabilities in the application, deployment workflow, content-processing scripts, dependency configuration, or repository automation.

Please do not submit:

- automated scanner output without evidence of impact;
- reports about unsupported forks or local modifications;
- social-engineering attempts against contributors;
- denial-of-service testing against the public site;
- secrets or credentials obtained from unrelated systems.

If you discover an exposed credential, do not test it. Report it privately and allow the owner to rotate it.

## Client-side configuration

Environment variables prefixed with `VITE_` are embedded into the browser bundle and must be treated as public configuration.

Do not store credentials, API secrets, private tokens, service-account keys, signing keys, or other confidential values in `VITE_*` variables.

Use `.env.example` only to document expected variable names. Local `.env*` files must not contain values intended for source control.
