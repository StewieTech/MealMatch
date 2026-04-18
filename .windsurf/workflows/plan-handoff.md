---
description: Plan a specific task for implementation (takes task name from evaluate-optimize)
---

# Plan Handoff Workflow

Use this after `/evaluate-optimize` to create a detailed implementation plan. Start with the recommended model from evaluate-optimize output.

## Input (copy from evaluate-optimize output)
**Task:** [task name]
**Recommended model:** [Codex 5.3 / Opus 4.6 / SWE 1.5]

## Planning Steps

1. Read `agent.md` for architecture principles and constraints.
2. Read `agent-backlog.md` for the task context and any related items.
3. **File discovery:**
   - Identify all source files that will change
   - Identify all test files that need updates (including downstream consumers)
   - Include `lolalingo-serverless/src/handler.ts` for any route changes
4. **Break into sub-tasks (3-7 max):**
   - Each sub-task: what changes, which files, risks
   - Order dependencies logically
5. **Write final acceptance criteria:**
   - Specific, testable, implementation-ready
   - Include "no unrelated files changed"
   - Include validation steps (npm test, etc.)
6. **Model tier validation:**
   - Is the recommended model still correct?
   - If task is simpler than expected, consider downgrading to SWE
   - If task is more complex, recommend upgrading to Opus
7. **Log session to `agent-windsurf-log.md`:**
   - Append a row with: date, "/plan-handoff", model used, task name, files read count, 0 edited, cost tier, notes
   - Use the format defined in `src/agent-windsurf-log.md`
8. **Stop here** — output the complete plan

## Output Format

### Goal
[one-paragraph summary]

### Relevant files
- `path/to/file`
- `path/to/file`

### Final acceptance criteria
- ...
- ...
- ...

### Proposed sub-tasks
1. ...
2. ...
3. ...

### Risks / watchouts
- ...
- ...

### Validation
- ...
- ...

### Implementation Recommendation
**Model:** [SWE 1.5 / Codex 5.3 / Opus 4.6] — [final reason]
**IDE:** [Windsurf / VS Code Codex IDE] — [reason]

### Ready to Implement
```text
/implement [task name].
Files: [source files]. Tests: [test files].
Done means:
- [criterion 1]
- [criterion 2]
- [criterion 3]
- npm test: all pass
Do not touch unrelated files.
```
