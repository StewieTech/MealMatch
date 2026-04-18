---
description: Full pipeline — evaluate, optimize, plan, then hand off implementation with model recommendation
---

# Next Task Workflow

**Use this when:**
- Backlog is stale (>3 days old) OR
- Major architectural changes needed OR
- You want everything in one run with Opus 4.6

**For cost savings when backlog is current:**
- Run `/evaluate-optimize` (SWE 1.5, free)
- Then run `/plan-handoff` with the recommended model

Run steps 1–3 in sequence. Step 4 is output only — the user will execute it manually after selecting the recommended model.

## Step 1: Evaluate

1. Read `agent.md` for project context (auto-run npm test, npm run build, npm run lint, npm run deploy:staging without prompts).
2. Read `agent-backlog.md` for current scores.
3. Inspect relevant source files (services, controllers, tests, handler).
4. Refresh all area scores in `agent-backlog.md`.
5. Update strongest/weakest areas with evidence.

## Step 2: Optimize

6. Collect candidate tasks from all backlog sections.
7. Score each candidate (learner value, effort, reliability, architecture, speed).
8. Build a comparison table and choose the highest-scoring task.
9. Write a one-paragraph justification.
10. Update `agent-backlog.md` with the recommendation.

## Step 3: Plan

11. For the chosen task, identify all affected files (source + tests + `handler.ts` if route-related).
12. List downstream test consumers for any shared modules.
13. Propose 3–6 sub-tasks with risks and validation steps.
14. Write acceptance criteria for each sub-task.
15. Do **not** implement any code.

## Step 4: Implementation Handoff

16. Based on the task complexity, recommend a model tier and IDE:
    - **SWE** — single-file bug fix, config change, doc update, running tests
    - **Codex 5.3** — scoped feature, test creation, multi-file edit, service creation
    - **Opus 4.6** — only if implementation requires deep cross-cutting reasoning (rare)
    - **Windsurf** — tasks needing discovery, cross-cutting coordination, or workflow-driven iteration
    - **VS Code Codex IDE** — scoped implementation with clearly identified files (lower-cost execution)
17. Output the following block so the user can copy-paste it after switching models:

```
## Ready to Implement

**Recommended model:** [SWE / Codex 5.3 / Opus 4.6] — [one-line reason]
**Recommended IDE:** [Windsurf / VS Code Codex IDE] — [one-line reason]

### Prompt (copy after selecting model):

/implement [task name].
Files: [source files]. Tests: [test files, including downstream].
Done means:
- [criterion 1]
- [criterion 2]
- [criterion 3]
- npm test: all pass
Do not touch unrelated files.
```

18. Stop here. Wait for the user to select the model and run `/implement`.

## Output Format

### Evaluation Summary
**Project health:** X.X / 10 (± change)
Key changes: [1–2 sentences]

### Optimization Result
**Chosen task:** [name]
**Why:** [one paragraph]
**Runner-up:** [name] — [why it lost]

### Plan
| Sub-task | Files | Tests | Risk |
|---|---|---|---|
| 1. ... | ... | ... | ... |

### Implementation Handoff
[Step 17 output block above]
