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

## Live URLs

Staging:
- **Web App:** https://d1jvmkdzx7bn57.cloudfront.net/
- **API:** https://3ijwda2ud0.execute-api.ca-central-1.amazonaws.com

Production:
- **Web App:** https://d17u75e3b48dg2.cloudfront.net/
- **API:** https://qze2fefwm4.execute-api.ca-central-1.amazonaws.com

The web app logs the active frontend API base URL once at startup:
- `[MealMatch] API base URL: ...`

The photo flow also logs browser-side diagnostics during image selection and `/photo/extract` requests:
- selected/upload MIME type
- image dimensions
- original file size
- compressed image dimensions for web uploads
- base64 payload length
- API failure status and `reason`

## Quick Start

1. Install dependencies:
   - `npm install`
2. Create env files from `.env.example` and `api/.env.example`
3. Start local development:
   - `npm run dev`

Local web defaults to:
- `EXPO_PUBLIC_API_BASE_URL=http://localhost:4001`

`npm run deploy:web:staging` and `npm run deploy:web:prod` read the matching CloudFormation stack outputs, set `EXPO_PUBLIC_API_BASE_URL` at build time, run a cache-cleared web export, verify the bundle contains the expected stage API base, sync `mobile/dist` to the stage frontend bucket, and invalidate the matching CloudFront distribution.

## Production Release Flow

Use this command to run the full prod release workflow:
- `npm run release:prod`

What it does:
- requires a clean git worktree (fails if dirty)
- fast-forwards local `master` from `origin/master`
- runs `npm test`, `npm run build`, and `npm run lint`
- deploys API and web to production
- pushes `master` to GitHub
- creates or updates a same-day release branch named `release/YYYY-MM-DD`
- pushes the release branch to GitHub
- leaves local checkout on `master`

If today's release branch already exists remotely, it is only updated when fast-forward safe; diverged history fails intentionally for manual resolution.

## Debugging Phone Web Photo Uploads

For the staging CloudFront web app on a phone (`https://d1jvmkdzx7bn57.cloudfront.net/photo`), debug the photo flow in two places:

1. Phone browser logs
   - iPhone/iPad Safari: enable Web Inspector on the device, connect it to Safari on your Mac, then inspect the CloudFront page.
   - Android Chrome: open `chrome://inspect` on your desktop Chrome and attach to the phone tab.
   - Watch for `[MealMatch][photo]` logs to confirm selected MIME type, payload size, and the `/photo/extract` response status/reason.
2. Backend logs
   - Open AWS CloudWatch Logs for the staging Lambda handling the API.
   - Filter for `/photo/extract`, `extractIngredientsFromImage`, `payload_too_large`, or `unsupported_image_type`.

Common failure signatures:
- `reason: 'payload_too_large'`: the phone browser tried to send too much base64 JSON.
- `reason: 'unsupported_image_type'`: the upload MIME type was not normalized to a supported image format.
- `reason: 'not_configured'`: the staging API is missing vision configuration.
- `reason: 'network_failed'` or Safari `Load failed` with no HTTP status: the phone browser failed before the API responded, usually because the image upload is still too large for mobile web transport.

Current mitigation for phone web:
- web uploads are resized client-side before `/photo/extract`
- uploads are converted to JPEG on web
- if the compressed image is still too large, the app should fail locally with a smaller-photo message instead of attempting the oversized request

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
