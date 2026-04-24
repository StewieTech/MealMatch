# MealMatch Backlog

## Current Recommendation

Implement image-to-ingredients after the text flow is stable and the upload path is proven in dev.

## Top Priorities

1. Harden `POST /recipes/from-text` with better prompt shaping and persistence checks.
2. Implement real fridge-photo ingredient extraction in `vision.service.ts`.
3. ~~Implement speech-to-ingredients flow in `transcription.service.ts`.~~ DONE
4. Add authentication only after the three input paths are stable.
5. Add filter re-generation on RecipeResultsScreen (deferred from v1).
6. Add `GET /recipes/:id` endpoint for persistent recipe lookup.
7. Add `POST /ingredients/normalize` for manual ingredient normalization.

## Completed

- 2026-04-08: Fixed localhost web bootstrap flow and blank-screen startup path (Expo web entrypoint, web bundler config, `dev:live` script, and passing validation).
- 2026-04-18: Set up SSM parameters for dev and prod stages (MONGODB_URI, MONGODB_DB, OPENAI_API_KEY). Deployment blocked by IAM permissions.
- 2026-04-18: Implemented full Voice-to-Recipe 4-screen flow (VoiceInput → ConfirmIngredients → RecipeResults → RecipeDetail) with React Navigation, real Whisper transcription, GPT ingredient extraction, multi-recipe generation with match scores, editable chips, filter pills, and full error/loading/empty states. All typecheck + tests pass (12/12).
- 2026-04-18: Voice flow follow-up fixes — (1) surfaced empty-ingredient root cause by returning 503 with `reason: 'not_configured'` when OPENAI_API_KEY is missing (no more silent fallback), (2) added root `.env` fallback loading in `api/src/config/env.ts`, (3) added `<RecordingPlayer>` component (web `<audio>` + native `expo-av` Sound) on VoiceInput + ConfirmIngredients screens, (4) configured React Navigation `linking` so each voice step has its own URL (`/voice`, `/voice/confirm`, `/voice/results`, `/voice/recipe`) with auto-redirect to `/voice` when required params missing, (5) added jest.setup.js to force tests into unconfigured mode. All 13 tests pass.
- 2026-04-18: Fixed AWS deployment blocker by removing reserved Lambda env var (`AWS_REGION`) from `serverless.yml`; `dev` deploy now succeeds.
- 2026-04-18: Created `deploy:staging` script and deployed to staging environment at https://3ijwda2ud0.execute-api.ca-central-1.amazonaws.com
- 2026-04-18: Deployed web app to separate S3 frontend bucket with `deploy:web:staging` script. Accessible at http://mealmatch-frontend-staging.s3-website.ca-central-1.amazonaws.com/
- 2026-04-18: Migrated staging frontend hosting to CloudFront + private S3 (OAC) with HTTPS, SPA fallback routing, and deploy-time CloudFront invalidation. Live URL: https://d1jvmkdzx7bn57.cloudfront.net/
- 2026-04-18: Fixed frontend API base split by environment (local localhost vs staging API in deploy build), centralized API base usage for voice/text, and added one-time runtime API base logging in web console.
- 2026-04-18: Fixed staging voice transcription CORS failure by centralizing backend CORS config (`serverless.yml` + runtime env), adding explicit Lambda `OPTIONS` handling and CORS header passthrough, adding preflight tests, deploying `staging`, and verifying live `OPTIONS` + `POST` responses now include `Access-Control-Allow-Origin: https://d1jvmkdzx7bn57.cloudfront.net`.
- 2026-04-18: Added in-memory voice recipe-results cache scoped to `VoiceFlow` navigation so unchanged Confirm → Results resubmits reuse cached recipes instantly (no extra `/recipes/generate` call), with shared request-signature normalization and mobile cache tests.
- 2026-04-23: Added parallel staging/prod CloudFront frontend deployment. `deploy:web:staging` and `deploy:web:prod` now read stack outputs for API base, bucket, distribution invalidation, and prod is live at https://d17u75e3b48dg2.cloudfront.net/ with API https://qze2fefwm4.execute-api.ca-central-1.amazonaws.com.
- 2026-04-23: Fixed prod photo CORS break caused by stale Expo web bundler cache retaining staging API URL in prod bundle. Updated web deploy script to run `expo export --clear` and fail deploy if exported bundle does not embed the expected stage API base URL. Redeployed prod web and verified preflight CORS succeeds for `POST /photo/extract` from https://d17u75e3b48dg2.cloudfront.net.
- 2026-04-23: Fixed deployed CloudFront video search 503 by creating `/mealmatch/staging/YOUTUBE_API_KEY` and `/mealmatch/prod/YOUTUBE_API_KEY` in SSM and redeploying both APIs. Verified `GET /videos/search` now returns 200 on staging and prod and CORS allow-origin matches each CloudFront URL.
