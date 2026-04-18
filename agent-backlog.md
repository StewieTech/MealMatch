# MealMatch Backlog

## Current Recommendation

Implement image-to-ingredients after the text flow is stable and the upload path is proven in dev.

## Top Priorities

1. Harden `POST /recipes/from-text` with better prompt shaping and persistence checks.
2. Implement real fridge-photo ingredient extraction in `vision.service.ts`.
3. Implement speech-to-ingredients flow in `transcription.service.ts`.
4. Add authentication only after the three input paths are stable.

## Completed

- 2026-04-08: Fixed localhost web bootstrap flow and blank-screen startup path (Expo web entrypoint, web bundler config, `dev:live` script, and passing validation).