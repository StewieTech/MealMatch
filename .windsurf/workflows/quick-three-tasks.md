---
description: Fast path — pick three smallest high-priority backlog tasks for batching
---

# Quick Three Tasks Workflow

Use this when you want a focused batch of quick wins without running full evaluation.

1. Read `agent.md` for constraints and architecture principles (auto-run npm test, npm run build, npm run lint, npm run deploy:staging without prompts).
2. Read `agent-backlog.md` and collect candidate tasks from:
   - Top Features / Enhancements
   - Top Bugs / Stability Issues
   - Top Architecture Priorities
   - Cost Optimization Ideas
3. Keep only tasks that are:
   - small effort (`S`) or clearly low-complexity
   - high priority (top-ranked in their section)
   - likely completable in one session
4. Score candidates (1–5):
   - Learner value
   - Reliability gain
   - Architecture leverage
   - Speed to complete (higher = faster)
5. Select the best 3 tasks by total score.
6. For each selected task, provide:
   - one-line rationale
   - likely files and downstream tests
   - recommended model tier (SWE / Codex 5.3 / Opus 4.6)
   - recommended IDE (Windsurf / VS Code Codex IDE)
7. Output implementation handoff prompts for each selected task:
   - a Windsurf `/implement` prompt
   - a VS Code Codex IDE prompt (self-contained)
8. **Log session to `agent-windsurf-log.md`:**
   - Append a row with: date, "/quick-three-tasks", "SWE 1.5", "task selection", files read count, 0 edited, "Low", notes
   - Use the format defined in `src/agent-windsurf-log.md`
9. Stop and wait for the user to choose which task to run first.

## Output Format

### Selected Three Tasks
| Rank | Task | Why | Model | IDE |
|---|---|---|---|---|
| 1 | ... | ... | ... | ... |
| 2 | ... | ... | ... | ... |
| 3 | ... | ... | ... | ... |

### Task 1 Prompt
```text
/implement [task 1].
Files: [source files]. Tests: [test files, including downstream].
Done means:
- [criterion 1]
- [criterion 2]
- npm test: all pass
- Do not touch unrelated files.
- Run terminal commands yourself whenever possible.
- Only ask me to run one if blocked by permissions, credentials, a GUI-only action, or an explicit approval step.
- If you do ask, log it in agent-command-backlog.md with the blocker and prevention note.
```
### Task 1 VS Code Codex IDE Prompt
```text
Implement: [task 1]

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
- npm test: all pass
- Do not touch unrelated files.
- Run terminal commands yourself whenever possible.
- Only ask me to run one if blocked by permissions, credentials, a GUI-only action, or an explicit approval step.
- If you do ask, log it in agent-command-backlog.md with the blocker and prevention note.
```

### Task 2 Prompt
```text
/implement [task 2].
Files: [source files]. Tests: [test files, including downstream].
Done means:
- [criterion 1]
- [criterion 2]
- npm test: all pass
- Do not touch unrelated files.
- Run terminal commands yourself whenever possible.
- Only ask me to run one if blocked by permissions, credentials, a GUI-only action, or an explicit approval step.
- If you do ask, log it in agent-command-backlog.md with the blocker and prevention note.
```

### Task 2 VS Code Codex IDE Prompt
```text
Implement: [task 2]

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
- npm test: all pass
- Do not touch unrelated files.
- Run terminal commands yourself whenever possible.
- Only ask me to run one if blocked by permissions, credentials, a GUI-only action, or an explicit approval step.
- If you do ask, log it in agent-command-backlog.md with the blocker and prevention note.
```

### Task 3 Prompt
```text
/implement [task 3].
Files: [source files]. Tests: [test files, including downstream].
Done means:
- [criterion 1]
- [criterion 2]
- npm test: all pass
- Do not touch unrelated files.
- Run terminal commands yourself whenever possible.
- Only ask me to run one if blocked by permissions, credentials, a GUI-only action, or an explicit approval step.
- If you do ask, log it in agent-command-backlog.md with the blocker and prevention note.
```

### Task 3 VS Code Codex IDE Prompt
```text
Implement: [task 3]

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
- npm test: all pass
- Do not touch unrelated files.
- Run terminal commands yourself whenever possible.
- Only ask me to run one if blocked by permissions, credentials, a GUI-only action, or an explicit approval step.
- If you do ask, log it in agent-command-backlog.md with the blocker and prevention note.
```
