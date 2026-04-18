# Agent Guidelines - MealMatch

> See also: `agent-blueprint.md`, `agent-prompting.md`, `agent-architect.md`, `agent-backlog.md`, `agent-command-backlog.md`, `.windsurf/workflows/`

## Product Context

MealMatch helps users turn fridge ingredients into recipes through three input paths:
- text
- photo
- voice

V1 priority:
- fully working text recipe generation
- working upload/presign path for image input
- scaffolded image and voice recipe endpoints

## Architecture

- `mobile/` = Expo Go compatible app
- `api/` = single TypeScript backend codebase
- `api/src/server.ts` = local Express entrypoint
- `api/src/lambda.ts` = AWS Lambda entrypoint
- MongoDB via Mongoose
- OpenAI-first AI layer
- S3 uploads buckets only:
  - `mealmatch-uploads-dev`
  - `mealmatch-uploads-prod`

## Critical Rules

1. Keep one backend codebase for local and AWS paths.
2. Keep controllers thin and push logic into services.
3. Treat text as the reference flow before expanding photo and voice.
4. Upload buckets are for fridge images only, not web hosting.
5. Keep scripts as the main DevOps entrypoint.