---
description: Analyze your question to recommend optimal model, IDE, and workflow choice
---

# /ask Workflow

Analyzes your question to determine if you chose the right model tier and workflow. Provides recommendations for future similar questions.

## Steps

1. **Analyze the question characteristics:**
   - Is it a simple factual lookup? (SWE 1.5)
   - Does it require code implementation or multi-file reasoning? (Codex 5.3)
   - Does it need architectural design or deep analysis? (Opus 4.6)
   - Is it a planning task that should use `/plan` instead?

2. **Evaluate model-appropriate factors:**
   - **Complexity:** Single file vs multiple files vs system-wide
   - **Reasoning type:** Mechanical vs creative vs analytical
   - **Context needs:** Is existing codebase context required?
   - **Output type:** Quick answer vs code vs detailed plan

3. **Assess IDE choice:**
   - **Windsurf:** For discovery, cross-cutting coordination, or when you don't know which files are involved
   - **VS Code Codex IDE:** For scoped implementation with clearly identified files (lower cost)
   - **Terminal/CLI:** For simple commands or documentation

4. **Determine workflow fit:**
   - `/ask` - Quick questions, clarifications, simple fixes
   - `/plan` - Feature implementation, multi-file changes, architectural decisions
   - `/evaluate-optimize` - When you need task selection or backlog analysis
   - `/implement` - When you have a clear task and files list

5. **Calculate confidence score:**
   - 90-100%: Clear model match, no ambiguity
   - 70-89%: Good match with minor considerations
   - 50-69%: Could work but not optimal
   - <50%: Wrong model choice for this question type

6. **Provide recommendations:**
   - Your chosen model: [Right/Too Low/Too High]
   - Recommended model: [SWE 1.5 / Codex 5.3 / Opus 4.6]
   - Recommended IDE: [Windsurf / VS Code Codex IDE / Terminal]
   - Recommended workflow: [/ask / /plan / /implement / other]
   - Confidence: [XX]%
   - Reasoning: [Brief explanation]

7. **Log session to `agent-windsurf-log.md`:**
   - Append a row with: date, "/ask", your model, "question analysis", 0 files read, 0 edited, cost tier, notes
   - Include the model recommendation in notes
8. If the question reveals vision, strategy, or reasoning gaps, consider updating `agent-tpo.md`.

## Output Format

### Question Analysis
**Your model:** [model you used]
**Complexity:** [Low/Med/High]
**Context needed:** [Minimal/Moderate/Extensive]
**Output type:** [Answer/Code/Plan]

### Recommendation
**Model choice:** [✅ Right / ⬆️ Too Low / ⬇️ Too High]
**Should have used:** [SWE 1.5 / Codex 5.3 / Opus 4.6]
**Better IDE:** [Windsurf / VS Code Codex IDE / Terminal]
**Better workflow:** [/ask / /plan / /implement / other]
**Confidence:** [XX]%

### Why
[1-2 sentences explaining the reasoning]

### For next time
[Tip for identifying similar questions]

## Example

**Input:** User asks "How do I fix the auth middleware bug?" with SWE 1.5

**Output:**
```
### Question Analysis
**Your model:** SWE 1.5
**Complexity:** Medium
**Context needed:** Moderate (need to read auth files)
**Output type:** Code

### Recommendation
**Model choice:** ⬆️ Too Low
**Should have used:** Codex 5.3
**Better IDE:** Windsurf
**Better workflow:** /ask
**Confidence:** 75%

### Why
Bug fixes often require reading multiple files and understanding code flow, which Codex handles better than SWE.

### For next time
If the question mentions "bug" or "fix" and you don't know the exact file, use Codex.
```
