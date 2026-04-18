---
description: Evaluate repo health and optimize task selection (SWE-friendly)
---

# Evaluate & Optimize Workflow

Use this to refresh backlog scores and pick the highest-leverage next task. Designed for SWE 1.5 when the backlog is already current. For stale backlogs or major architectural shifts, use `/next-task` with Opus 4.6.

1. Read `agent.md` for project context and constraints (auto-run npm test, npm run build, npm run lint, npm run deploy:staging without prompts).
2. Read `agent-backlog.md` and `agent-command-backlog.md` for current state.
3. **Staleness check:**
   - Compare `## Completed` list against all open sections
   - Mark any completed items as ~~DONE~~ in Features, Bugs, Architecture, Cost Optimization, Model Assignment
   - Update area scores and Weakest Areas if they reference completed items
   - Update test count if needed
4. **Evaluation (light):**
   - Check if area scores still reflect current state
   - Update Strongest/Weakest areas if evidence has changed
   - No deep architectural analysis — just surface validation
5. **Optimization:**
   - Collect candidates from Top Features, Bugs, Architecture, Cost Optimization
   - Score each candidate (1-5): learner value, effort, reliability, architecture, speed
   - Build comparison table
   - Select highest-scoring task
6. **Model recommendation for planning:**
   - **Codex 5.3** for standard features, multi-file edits, test creation
   - **Opus 4.6** only if: task is architectural, requires cross-cutting changes, or backlog is stale
   - **SWE 1.5** only for: single-file fixes, config/docs, running tests
7. Update `agent-backlog.md`:
   - Refresh Overall Project Rating if scores changed
   - Move chosen task to #1 position
   - Update "Current Recommendation" at top
8. If prioritization or metrics patterns shifted, consider updating `agent-tpo.md`.
9. **Log session to `agent-windsurf-log.md`:**
   - Append a row with: date, "/evaluate-optimize", "SWE 1.5", task name, files read count, 0 edited, "Low", notes
   - Use the format defined in `src/agent-windsurf-log.md`
9. **Stop here** — output the chosen task and recommended model for `/plan-handoff`

## Output Format

### Evaluation Summary
**Project health:** X.X / 10 (± change)
Key changes: [1–2 sentences]

### Optimization Result
**Chosen task:** [name]
**Why:** [one paragraph]
**Runner-up:** [name] — [why it lost]

### Recommended Model for Planning
**[Codex 5.3 / Opus 4.6 / SWE 1.5]** — [reason]

### Ready for /plan-handoff
Copy this output and run `/plan-handoff` with the recommended model.
