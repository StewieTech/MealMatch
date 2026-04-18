---
description: Implement a planned change safely
---

# Implementation Workflow

1. Read `agent.md` and `agent-command-backlog.md` for coding principles, command preferences, and known command-friction patterns.
2. Confirm which approved sub-task is being implemented.
3. Re-open the relevant files before editing.
4. Implement only the scoped change.
5. Follow existing repo conventions and keep changes reviewable.
6. Run the most relevant validation after each meaningful change.
   - Auto-run standard validation commands without asking: npm test, npm run build, npm run lint, npm run deploy:staging.
   - Only ask the user if blocked by permissions, credentials, a GUI-only step, or an explicit approval decision.
7. Run terminal commands yourself whenever possible.
8. If validation fails, fix before moving on.
9. Avoid unrelated refactors unless they are necessary for correctness.
10. After completing the work:
   - summarize changes
   - note validation performed
   - note any follow-up work
11. **Backlog Sweep (mandatory after every implementation):**
    - Add the completed item to the `## Completed` section.
    - Search `agent-backlog.md` for the task name and mark it ~~DONE~~ in **every** section where it appears:
      - Top Features / Enhancements
      - Top Bugs / Stability Issues
      - Top Architecture Priorities
      - Cost Optimization Ideas
      - Current Backlog Items — Model Assignment
    - Update **area scores** that referenced the completed item (e.g. if a bug fix improved Voice loop quality, bump that score).
    - Update **Weakest Areas** if the completed item was listed there.
    - Update **test count** in the Test coverage score if tests were added.
    - If the #1 item in any section is now DONE, promote the next open item to #1.
12. If new prompt patterns were observed, update `agent-prompting.md`.
13. If TPO-related decisions or tradeoffs were made, consider updating `agent-tpo.md`.
14. If you asked the user to run a terminal command, update `agent-command-backlog.md` with the exact command, blocker, and the best prevention addition.
14. **Post-implementation reflection:**
    - Did the plan list all affected files and downstream tests?
    - Any repeatable pattern to codify in backlog or prompting docs?
15. **Model optimization assessment:**
    - What model was used for this implementation?
    - Was it the right choice? Evaluate against:
      - **Over-powered?** — Could a cheaper model (SWE or Codex) have handled this? Signs: task was mechanical, single-file, no reasoning required.
      - **Under-powered?** — Did the model struggle, produce errors, or need multiple retries? Signs: complex cross-file reasoning, architecture decisions mid-implementation.
      - **Just right?** — Completed in one pass with minimal retries.
    - Rate: ✅ optimal / ⬆️ should use higher tier / ⬇️ should use lower tier
    - One-line reason why.
16. **Update `agent-backlog.md`** with any learnings:
    - If the model tier was wrong, update the "Current Backlog Items — Model Assignment" table.
    - If a new cost pattern was discovered, add it to "What Costs the Most" table.
    - If a new cost-saving strategy was found, add it to "Cost Reduction Strategies" table.
    - If no learnings, skip this step.
17. **Log session to `agent-windsurf-log.md`:**
    - Append a row with: date, "/implement", model used, task name, files read count, files edited count, cost tier, notes
    - Use the format defined in `src/agent-windsurf-log.md`

## Implementation Output Format

### Implemented
- ...

### Files changed
- `path/to/file`
- `path/to/file`

### Validation run
- ...

### Notes
- ...

### Follow-up
- ...

### Command Friction
- [none / what command was requested and why]
- If you asked me to run a terminal command, log it in `agent-command-backlog.md` with the blocker and the smallest prompt addition that would prevent it next time.

### Model Optimization
- **Model used:** [model name]
- **Verdict:** [✅ optimal / ⬆️ should use higher tier / ⬇️ should use lower tier]
- **Why:** [one line]
- **Backlog updated:** [yes — what changed / no — no new learnings]
