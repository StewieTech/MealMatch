---
description: Scope and plan a task before implementing
---

# Planning Workflow

1. Read `agent.md` for project context, principles, and architecture (auto-run npm test, npm run build, npm run lint, npm run deploy:staging without prompts).
2. Read `agent-backlog.md` for current priorities and project health.
3. If available, read the `/optimize` **Planning Seed** (likely files + draft acceptance criteria).
4. Read the relevant source files before proposing changes.
5. If the request is ambiguous, ask concise clarifying questions.
6. Validate (or correct) the Planning Seed:
   - remove false-positive files
   - add missing files (`handler.ts` for route changes, downstream test consumers for shared modules)
   - keep a final, implementation-ready file list
7. Break the work into numbered sub-tasks (usually 3–7 max).
8. For each sub-task, identify:
   - files likely affected
   - what changes
   - risks
   - validation steps
9. Convert draft acceptance criteria into **final acceptance criteria**:
   - specific, testable, and implementation-ready
   - include any API/route parity requirements
   - include "no unrelated files changed"
10. Recommend the best execution order.
11. Present the plan clearly and wait for approval.
12. Do **not** implement during planning.

## Planning Output Format

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

### Recommendation
[best next step]
