---
description: Evaluate repo health and update agent-backlog.md
---

# Evaluation Workflow

1. Read `agent.md` for project context, architecture, and coding principles (auto-run npm test, npm run build, npm run lint, npm run deploy:staging without prompts).
2. Read `agent-backlog.md` for current scores and priorities.
3. Inspect relevant source files — do not rely on memory alone. At minimum check:
   - backend services and controllers (`src/services/`, `src/controllers/`)
   - frontend screens, hooks, and components (`expo-app/app/`)
   - serverless handler (`lolalingo-serverless/src/handler.ts`)
   - tests (`src/__tests__/`)
   - models and repositories (`src/models/`, `src/repositories/`)
4. Score the project across these areas (1–10 each):
   - **Core conversation experience** — does Lola remember context, respond naturally, handle all modes?
   - **Voice loop quality** — STT→LLM→TTS latency, error handling, provider switching
   - **Frontend UX** — polish, responsiveness, learner clarity
   - **Backend / API design** — service boundaries, controller size, input validation
   - **Reliability / error handling** — retry logic, graceful degradation, data loss risk
   - **Deployment safety** — secrets management, build hygiene, serverless/local parity
   - **Test coverage / validation** — suite size, mock quality, confidence level
   - **Documentation** — agent.md, README, inline comments
   - **Prompt / AI maintainability** — prompt centralization, cost observability, model routing
   - **Architecture clarity** — separation of concerns, DRY, naming conventions
5. Identify **strongest areas** (top 2–3) with evidence.
6. Identify **weakest areas** (top 2–3) with evidence.
7. **Staleness check (run before updating scores):**
   - Compare the `## Completed` list against every open section (Features, Bugs, Architecture, Cost Optimization, Model Assignment).
   - Any item in Completed that still appears as open → mark it ~~DONE~~ immediately.
   - Any area score or Weakest Areas narrative that references a completed item → update it.
   - Update the test count in the Test coverage score to match actual `npm test` output.
8. Update the following sections of `agent-backlog.md`:
   - Overall Project Rating
   - Area score table
   - Strongest Areas
   - Weakest Areas
   - Top Features / Enhancements
   - Top Bugs / Stability Issues
   - Top Architecture Priorities
   - Current Backlog Items — Model Assignment
   - Recommended next task (if one is clearly highest-leverage)
9. Do **not** implement code during evaluation.

## Evaluation Output Format

### Overall Rating
**X.X / 10** (± change from last evaluation)

### Score Changes
| Area | Previous | Current | Why |
|---|---|---|---|

### Strongest Areas
- ...

### Weakest Areas
- ...

### Recommended Next Task
[one sentence — or "no change" if current recommendation still holds]

### Backlog Updated
- [ ] `agent-backlog.md` scores refreshed
- [ ] Priorities re-ordered if needed
