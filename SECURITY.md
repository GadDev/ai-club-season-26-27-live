# Security policy

## Supported version

This repository publishes a continuously deployed website from the `main` branch.

Security fixes are applied to the current production version. Older commits, branches, forks, and independently deployed copies are not maintained as supported releases.

## Reporting a vulnerability

Please **do not disclose security vulnerabilities in a public issue, pull request, discussion, commit message, or social post**.

Preferred reporting path:

1. Open the repository's **Security** tab.
2. If **Report a vulnerability** is available, use GitHub's private vulnerability reporting flow.
3. If private reporting is unavailable, open a public issue titled `Security contact request` containing **no vulnerability details**. A maintainer can then establish a private communication channel.

Include, when possible:

- the affected page, component, workflow, dependency, or infrastructure area;
- clear reproduction steps;
- expected and observed impact;
- browser or runtime information when relevant;
- a minimal proof of concept that does not expose real user data or secrets;
- any suggested remediation.

If you discover an exposed credential, token, or private key, **do not test it**. Report it privately so the credential can be revoked or rotated.

## Scope

Useful reports include vulnerabilities affecting:

- the public AI Club application;
- frontend application code;
- repository automation;
- GitHub Actions workflows;
- Firebase Hosting deployment;
- content-processing or validation scripts;
- dependency configuration;
- authentication or authorization flows introduced by future features;
- accidental exposure of credentials, tokens, or sensitive configuration.

Please do not submit:

- automated scanner output without evidence of meaningful impact;
- reports about unsupported forks or local modifications;
- social-engineering attempts against contributors;
- denial-of-service or load testing against the public site;
- secrets or credentials obtained from unrelated systems;
- speculative reports without a reproducible security impact.

## Client-side configuration

Environment variables prefixed with `VITE_` are embedded into the browser bundle and must be treated as **public configuration**.

Do not store credentials, API secrets, private tokens, service-account keys, signing keys, privileged Firebase credentials, or other confidential values in `VITE_*` variables.

Use `.env.example` only to document expected environment-variable names and safe example values. Local `.env*` files must not contain values intended for source control.

Public Firebase client configuration may be exposed to the browser when appropriate, but privileged Firebase Admin credentials, Google Cloud service-account material, backend secrets, and other server-side credentials must never be included in client-side environment variables or committed to the repository.

## Repository and deployment secrets

Secrets required by GitHub Actions or deployment workflows must be stored using the appropriate GitHub repository or environment configuration rather than committed to source control.

Production deployment uses short-lived authentication where possible. Long-lived cloud service-account credentials or Firebase deployment tokens should not be stored in the repository.

Changes to authentication, deployment permissions, security-sensitive workflows, or secret handling should be reviewed carefully and follow least-privilege principles.

## Response expectations

Maintainers will acknowledge valid reports when they are able to assess them, investigate the impact, and coordinate remediation before public disclosure.

This is a community project and does not provide a formal response or remediation SLA.

Where appropriate, maintainers may:

- request additional reproduction information;
- temporarily disable or restrict affected functionality;
- rotate exposed credentials;
- patch dependencies or application code;
- coordinate a responsible disclosure timeline.

## Disclosure

Please allow maintainers reasonable time to investigate and remediate a confirmed vulnerability before publishing technical details.

Once a fix is available and deployed, security information may be disclosed in a way that helps contributors understand the issue without exposing unnecessary operational or user-sensitive information.
