---
name: release-prod
description: Run the production release workflow that deploys API+web, pushes master, creates/pushes release/YYYY-MM-DD, and finishes on master.
---

## Purpose
Use this skill when promoting current `master` to production and enforcing the date-based release branch policy.

## Workflow
1. Ensure local changes are committed first.
2. Run:
   - `npm run release:prod`
3. Confirm:
   - prod API + web deploy completed,
   - `origin/master` pushed,
   - `origin/release/YYYY-MM-DD` pushed for today's date,
   - local branch is `master`.

## Guardrails
- Script intentionally fails on dirty worktree.
- Script requires fast-forward-safe update if same-day release branch already exists remotely.
- Script always finishes on `master` by design.
