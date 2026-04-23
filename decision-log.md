# Decision Log

## 2026-04-18 - Frontend HTTPS on Staging via CloudFront + S3 (OAC)

### Decision
Serve the staging frontend from CloudFront over HTTPS using S3 as a private REST origin with Origin Access Control (OAC).

### Why
- Browser microphone access requires a secure context (HTTPS).
- CloudFront default domain (`*.cloudfront.net`) provides HTTPS without ACM or DNS setup.
- OAC keeps the frontend bucket private and avoids public website bucket exposure.
- This is the fastest low-maintenance fix for staging.

### Alternatives considered
- CloudFront to S3 website endpoint: rejected (public website endpoint pattern, weaker security posture).
- Amplify Hosting: rejected for now (would change current deployment pipeline).
- Custom domain + ACM now: deferred (extra setup not required for staging).

### Follow-up
- Add CloudFront invalidation to web deploy script.
- Reuse the same pattern for production, then optionally add custom domain + ACM later.
