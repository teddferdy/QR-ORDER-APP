# Release Runbook — BISA-MAKAN-APP

This repo does **not** deploy via GitHub Actions. Disabling that no-op `deploy`
job removed a fake release gate; the real release flow is the Vercel Git
integration below (Vite framework preset — there is no local `vercel.json`).

## Release flow

1. **Push / open a PR** against `master`. CI (`.github/workflows/ci.yml`)
   runs `lint`, a production `build` (with
   `VITE_API_BASE_URL=https://api-bisa-nota.vercel.app`), and an artifact
   guard that fails the build if the dev API URL (`localhost:5001`) leaks into
   the bundle.
2. **Wait for CI checks to PASS.** Nothing goes out otherwise.
3. **Merge the PR to `master`.** The Vercel Git integration detects the push
   and runs a production build + deployment automatically (production branch
   `master`).
4. **Post-deploy health check** (production):
   - Load the customer app URL (Vercel project domain) and confirm it renders.
5. **Smoke test**: open the customer self-order app for a real table (QR),
   add items, place an order, and confirm it appears in the FE POS order queue.

## Prerequisites on the platform

- Production env var `VITE_API_BASE_URL` must be set in the Vercel project
  to the real backend (`https://api-bisa-nota.vercel.app`). A production
  build fails if it is missing or points to `localhost` (see `vite.config.ts`).
- Only merge to `master` after CI is green; rollback is available from the
  Vercel dashboard.