---
description: Choose the single highest-leverage next task from the backlog
---

# Optimization Workflow

1. Read `agent.md` for project context and operating principles (auto-run npm test, npm run build, npm run lint, npm run deploy:staging without prompts).
2. Read `agent-backlog.md` for current scores, priorities, and candidate tasks.
3. Collect candidate tasks from these backlog sections:
   - Top Features / Enhancements
   - Top Bugs / Stability Issues
   - Top Architecture Priorities
   - Cost Optimization Ideas
4. Score each candidate across these dimensions (1–5 each):
   - **Learner value** — does it visibly improve the language-learning experience?
   - **Implementation effort** — how many files, how complex, how long? (invert: lower effort = higher score)
   - **Reliability gain** — does it fix data loss, crashes, or silent failures?
   - **Architecture leverage** — does completing it unblock or simplify future work?
   - **Speed to meaningful progress** — can it ship in one focused session?
5. Build a comparison table:

   | Task | Learner | Effort | Reliability | Architecture | Speed | Total |
   |---|---|---|---|---|---|---|

6. Choose the single highest-scoring task.
7. Write a one-paragraph justification explaining why it beats the runner-up.
8. For the chosen task, draft a **Planning Seed**:
   - likely affected source files
   - likely affected test files (include downstream consumers for shared modules)
   - include `lolalingo-serverless/src/handler.ts` if route-related
   - 3–5 draft acceptance criteria (**draft only; final criteria are set during `/plan`**)
9. Assign the recommended Windsurf model tier (Opus / Codex / SWE) per the routing guide in `agent-backlog.md`.
10. Update `agent-backlog.md` if the recommendation changed:
   - Move the chosen task to position #1 in Top Features or Top Architecture
   - Add or update a "Current Recommendation" note at the top of the backlog
11. Do **not** implement code during optimization.

## Post-Implementation Reflection (run after `/implement`)

After any implementation session, briefly assess:
- **Plan accuracy** — did the plan list all affected files and downstream tests?
- **Model fit** — was the assigned model tier correct, or was it over/under-powered?
- **Surprise cost** — were there unexpected reads, edits, or test-fix cycles?
- **Pattern to codify** — is there a repeatable mistake or win worth adding to `agent-backlog.md` or `agent-prompting.md`?

> **Key learning (from message.repo migration):** When swapping a shared dependency's implementation, the plan must enumerate ALL downstream consumers and their tests — not just the direct unit tests. Shared-dependency changes fan out.

## Optimization Output Format

### Candidate Ranking

| Task | Learner | Effort | Reliability | Architecture | Speed | Total |
|---|---|---|---|---|---|---|

### Recommendation
**[Task name]** — [one-paragraph justification]

### Planning Seed (for `/plan`)

**Likely files**
- `path/to/source-file`
- `path/to/test-file`

**Draft acceptance criteria**
- ...
- ...
- ...

### Model Tier
**[Opus / Codex / SWE]** — [reason]

### Backlog Updated
- [ ] `agent-backlog.md` recommendation refreshed
