---
description: Update Windsurf prompt cost log manually or catch up missed sessions
---

# Update Agent Logs Workflow

Use this to manually log a session or catch up on missed logging. Also updates cost strategy if new patterns emerge.

## Steps

1. **Read current log:**
   - Open `src/agent-windsurf-log.md`
   - Review recent entries for context

2. **Recall session details:**
   - What workflow did you run? (`/implement`, `/evaluate-optimize`, etc.)
   - Which model tier was used? (SWE 1.5, Codex 5.3, Opus 4.6)
   - What was the task? (brief description)
   - How many files did you read? (estimate from tool calls)
   - How many files did you edit?
   - Any notable patterns or surprises?

3. **Determine cost tier:**
   - **Low:** SWE 1.5 + <5 files
   - **Med:** Codex 5.3 + 5-15 files
   - **High:** Opus 4.6 + 15+ files or multi-pass

4. **Append to log:**
   - Add a new row to the markdown table
   - Fill all columns: Date, Workflow, Model, Task, Files Read, Files Edited, Cost Tier, Notes

5. **Update cost strategy (if needed):**
   - Did you discover a new cost pattern?
   - Should any task routing be updated in `agent-backlog.md`?
   - Add to "What Costs the Most" or "Cost Reduction Strategies" if applicable

6. **Optional: Archive old data**
   - If table > 50 rows, move rows older than 3 months to an "Archive" section at bottom

## Example Entry

```markdown
| 2026-04-04 | /implement | SWE 1.5 | Fix auth middleware typo | 2 | 1 | Low | Quick fix, no test impact |
```

## Output Format

### Log Updated
- Added entry for [workflow] on [date]
- Cost tier: [Low/Med/High]
- Notes: [any observations]

### Cost Strategy Updates
- [ ] No changes needed
- [ ] Updated agent-backlog.md: [what changed]

### Next Actions
- Continue with current task
- Or run another workflow
