# MealMatch

MealMatch is an Expo + TypeScript + MongoDB starter app for turning fridge ingredients into recipe suggestions.

## Stack

- `mobile/` - Expo Go compatible React Native app
- `api/` - Express + TypeScript + MongoDB API
- AWS Lambda via `serverless.yml`
- OpenAI-first recipe generation
- S3 uploads buckets for fridge images

## Stages

- `dev`
- `prod`

Uploads buckets:
- `mealmatch-uploads-dev`
- `mealmatch-uploads-prod`

## Quick Start

1. Install dependencies:
   - `npm install`
2. Create env files from `.env.example` and `api/.env.example`
3. Start local development:
   - `npm run dev`

## Root Scripts

- `npm run dev`
- `npm run build`
- `npm run typecheck`
- `npm run test`
- `npm run deploy:dev`
- `npm run deploy:prod`
- `npm run arch:refresh`