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
- `staging`
- `prod`

Uploads buckets:
- `mealmatch-uploads-dev`
- `mealmatch-uploads-staging`
- `mealmatch-uploads-prod`

Frontend buckets:
- `mealmatch-frontend-staging`
- `mealmatch-frontend-prod`

## Live Staging URLs

- **Web App:** https://d1jvmkdzx7bn57.cloudfront.net/
- **API:** https://3ijwda2ud0.execute-api.ca-central-1.amazonaws.com

The web app logs the active frontend API base URL once at startup:
- `[MealMatch] API base URL: ...`

## Quick Start

1. Install dependencies:
   - `npm install`
2. Create env files from `.env.example` and `api/.env.example`
3. Start local development:
   - `npm run dev`

Local web defaults to:
- `EXPO_PUBLIC_API_BASE_URL=http://localhost:4001`

`npm run deploy:web:staging` overrides `EXPO_PUBLIC_API_BASE_URL` at build time so deployed web points to the staging API endpoint.

## Root Scripts

- `npm run dev` - Start API + mobile development
- `npm run build` - Build API + typecheck mobile
- `npm run typecheck` - Typecheck API + mobile
- `npm run test` - Run API + mobile tests
- `npm run deploy:dev` - Deploy API to dev
- `npm run deploy:staging` - Deploy API to staging
- `npm run deploy:prod` - Deploy API to production
- `npm run deploy:web:staging` - Build and deploy web app to staging
- `npm run deploy:web:prod` - Build and deploy web app to production
- `npm run arch:refresh` - Refresh architecture map