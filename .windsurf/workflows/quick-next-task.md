---
description: Fast path — pick #1 from agent-backlog and prepare implementation handoff
---

# Quick Next Task Workflow

Use this when `agent-backlog.md` is already current and you want to move straight to planning.

1. Read `agent.md` for constraints, architecture principles, and command-execution preferences (auto-run npm test, npm run build, npm run lint, npm run deploy:staging without prompts).
2. Read `agent-backlog.md` and `agent-command-backlog.md`.
3. Locate the current #1 task in:
   - Top Features / Enhancements, and
   - Top Architecture Priorities
4. Choose the highest-priority #1 task with the best effort/impact tradeoff.
5. Run planning for that task (no implementation yet):
   - identify likely affected source files
   - identify downstream test files
   - include `lolalingo-serverless/src/handler.ts` for route changes
   - define 2–4 acceptance criteria
6. Recommend model tier and IDE for implementation:
   - **SWE** for mechanical/single-file/config/docs
   - **Codex 5.3** for scoped multi-file features/tests
   - **Opus 4.6** only for deep cross-cutting implementation
   - **Windsurf** for tasks needing discovery, cross-cutting coordination, or workflow-driven iteration
   - **VS Code Codex IDE** for scoped implementation with clearly identified files (lower-cost execution)
7. Output implementation handoff prompts:
   - a Windsurf `/implement` prompt
   - a VS Code Codex IDE prompt (self-contained)
8. In both prompts, tell the implementation agent to run terminal commands itself whenever possible and to log any unavoidable user-run command in `agent-command-backlog.md`.
9. **Log session to `agent-windsurf-log.md`:**
   - Append a row with: date, "/quick-next-task", "SWE 1.5", task name, files read count, 0 edited, "Low", notes
   - Use the format defined in `src/agent-windsurf-log.md`
10. Stop and wait for the user to select the model and run `/implement`.

## Output Format

### Selected Task
**[task name]** — [one-line why now]

### Plan Snapshot
| Sub-task | Files | Tests | Risk |
|---|---|---|---|
| 1. ... | ... | ... | ... |

### Ready to Implement
**Recommended model:** [SWE / Codex 5.3 / Opus 4.6] — [one-line reason]
**Recommended IDE:** [Windsurf / VS Code Codex IDE] — [one-line reason]

### Windsurf Prompt
```text
/implement [task name].
Files: [source files]. Tests: [test files, including downstream].
Done means:
- [criterion 1]
- [criterion 2]
- [criterion 3]
- npm test: all pass
Do not touch unrelated files.
Run terminal commands yourself whenever possible.
Only ask me to run one if blocked by permissions, credentials, a GUI-only action, or an explicit approval step.
If you do ask, log it in `agent-command-backlog.md` with the blocker and prevention note.
```

### VS Code Codex IDE Prompt
```text
Implement: [task name]

Before coding, read:
- .github/copilot-instructions.md
- .github/codex-implement.md

Files:
- [source files]

Tests:
- [test files, including downstream]

Done means:
- [criterion 1]
- [criterion 2]
- [criterion 3]
- npm test: all pass
- Do not touch unrelated files.
- Run terminal commands yourself whenever possible.
- Only ask me to run one if blocked by permissions, credentials, a GUI-only action, or an explicit approval step.
- If you do ask, log it in agent-command-backlog.md with the blocker and prevention note.
```
