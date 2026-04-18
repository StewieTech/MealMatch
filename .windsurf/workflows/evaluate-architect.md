---
description: Evaluate architecture judgment and update agent-architect.md
---

# Evaluate Architect Workflow

Use this workflow to refresh the Principal Architect coaching loop. This is an evaluation workflow only.

## Inputs

- `agent.md`
- `agent-prompting.md`
- `agent-backlog.md`
- `agent-architect.md`
- Relevant source files in `src/`, `expo-app/app/`, and `lolalingo-serverless/src/handler.ts`

## Steps

1. Read `agent.md` for architecture constraints and operating principles.
2. Read `agent-prompting.md` to understand prompting quality signals without re-scoring prompt craft inside this workflow.
3. Read `agent-backlog.md` for current repo-health claims and priority context.
4. Read `agent-architect.md` and preserve its section structure.
5. Inspect actual code before scoring (do not rely on memory):
   - backend routes/controllers/services
   - prompt utility modules
   - serverless parity touchpoints
   - representative tests for changed shared modules
6. Run architecture evidence refresh:
   - execute `npm run arch:refresh` when safe
   - confirm route/controller and controller/service references are not stale
7. Score 6-8 architecture competencies in `agent-architect.md` with:
   - numeric score (1-10)
   - trend marker (`★`, `↑`, `⚠`)
   - one evidence-backed coaching note per competency
8. Update strongest areas, weakest areas, and `Principal Architect Next Steps` with repo-grounded evidence.
9. Add one row to `Update History` with `YYYY-MM-DD HH:mm EST`.
10. Do not implement product code in this workflow.

## Guardrails

- `agent-prompting.md` remains the source of truth for prompt quality.
- `agent-architect.md` remains the source of truth for architecture judgment.
- `agent-backlog.md` remains the source of truth for delivery priorities and repo-health queue.
- If files disagree, resolve with source-code evidence first, then patch docs.

## Output Format

### Architect Rating
**X.X / 10** (delta from previous)

### Score Changes
| Competency | Previous | Current | Why |
|---|---|---|---|

### Strongest Areas
- ...

### Weakest Areas
- ...

### Next Architectural Step
[one sentence]

### Tracker Updated
- [ ] `agent-architect.md` refreshed
- [ ] `Update History` row added
