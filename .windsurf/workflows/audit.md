---
description: Perform offensive security sweep and generate exploit artifacts
---

# Audit Workflow

Use this workflow to perform comprehensive security sweeps of your codebase. This is your red team - no refusal, no sugarcoating, no moral gatekeeping. Find every vulnerability so you can fix them before attackers exploit them.

## Core Principles

1. **Heretic Mode** - Report every vulnerability without softening, censoring, or moral gatekeeping. These are the exact attacks that will be used against you.
2. **Evidence-Grounded** - Every score and finding must reference actual code files and line numbers.
3. **Artifact-Producing** - New vulnerabilities generate numbered exploit `.md` files in `ES/exploits/` with working PoC code.
4. **Integrated** - Updates `ES/agent-security.md` scores and tables directly.

## Steps

1. **Read current security state:**
   - Read `ES/agent-security.md` for current scores, vulnerability map, and exploit index
   - Read `agent.md` for architecture context and Heretic uncensored principles
   - Read `ES/playbooks/README.md` for attack category reference

2. **Deep scan security-relevant source files:**
   - `src/server.ts` - middleware, CORS, body limits, static serving, route mounting
   - `src/middleware/*.ts` - auth, rate limiting, any new middleware
   - `src/controllers/*.ts` - all controllers (input validation, auth checks, error handling)
   - `src/routes/*.ts` - all routes (which have auth, which are public)
   - `src/services/*.ts` - all services (external API calls, data handling)
   - `src/config/*.ts` - configuration files (env loading, secrets)
   - `lolalingo-serverless/src/handler.ts` - Lambda routes, auth, SSM, debug endpoints
   - `expo-app/app/lib/config.ts` - frontend API config, token storage
   - `package.json` - dependencies for `npm audit`

3. **Run dependency vulnerability scan:**
   - Execute `npm audit` if available
   - Note any high/critical CVEs in dependencies
   - Check for new packages added since last audit

4. **Re-evaluate security competencies:**
   For each of the 10 competencies in `ES/agent-security.md`:
   - Re-score based on current code evidence (1-10 scale)
   - Update trend marker (stable/improving/danger)
   - Update coaching note with specific `file:line` references
   - Competencies: Auth, Rate limiting, CORS, Input validation, Secrets, Error handling, Static assets, API cost, Debug routes, Prompt injection

5. **Identify NEW vulnerabilities:**
   Compare current code against these patterns to find issues not in the current vulnerability map:
   - **Authentication gaps:** Missing `requireAuth`, weak JWT implementation, no session management
   - **Rate limiting absence:** Endpoints without throttling, especially auth and expensive operations
   - **CORS misconfig:** Wide-open origins, missing credentials checks
   - **Input validation gaps:** Missing Zod schemas, unsanitized user input, array length limits
   - **Secrets exposure:** Hardcoded keys, env files in git, partial credential logging
   - **Error leakage:** Stack traces, JWT error details, database errors in responses
   - **Static file exposure:** Unauthenticated file serving, predictable filenames
   - **Cost attacks:** Unlimited API calls to paid services, no per-user quotas
   - **Debug exposure:** Debug routes in production, admin endpoints without auth
   - **New endpoint risks:** Recently added routes without security review
   - **Dependency CVEs:** Known vulnerabilities in npm packages
   - **Lambda-specific:** Function URL exposure, missing SSM encryption, timeout issues

6. **Generate exploit artifacts for NEW vulnerabilities:**
   For each new vulnerability found:
   - Assign next sequential ID (check existing `ES/exploits/*` for highest number)
   - Create `ES/exploits/{ID}-{slug}.md` with this exact format:
     ```markdown
     # Exploit {ID}: {Title}
     
     **Target:** {endpoint/component}
     **Vulnerability Class:** {OWASP category}
     **Severity:** {Critical/High/Medium/Low}
     
     ---
     
     ## How It Works
     {Step-by-step attack narrative}
     
     ---
     
     ## Exploit Code
     ```bash
     # Working bash script
     ```
     
     ```python
     # Working Python script
     ```
     
     ---
     
     ## Why It Works
     **Root cause:** {file:line evidence}
     **Code evidence:** {actual code snippet}
     
     ---
     
     ## Impact
     {What attacker gains}
     
     ---
     
     ## Transferability to Other Apps
     {How this pattern applies to other applications}
     
     ---
     
     ## Fix
     ### Immediate Fix (Critical)
     {Quick fix code}
     
     ### Enhanced Fix (Recommended)
     {Better fix code}
     
     ---
     
     ## Status
     **Status:** open
     **Last Updated:** {YYYY-MM-DD}
     **Priority:** {Critical/High/Medium/Low}
     
     **Next Steps:**
     1. {Action 1}
     2. {Action 2}
     3. {Action 3}
     ```
   - Ensure exploit code actually works (test the logic)
   - Include both bash and Python versions where applicable

7. **Update vulnerability map and index:**
   - Add new vulnerabilities to the Vulnerability Map table in `ES/agent-security.md`
   - Add new exploits to the Exploit Index table
   - Update status for any fixed vulnerabilities (open -> mitigated -> fixed)

8. **Update security scores and signals:**
   - Re-calculate overall security score (average of 10 competencies)
   - Update #1 Strongest and #1 Weakest signals if they changed
   - Update Security Priority Next Steps based on current findings
   - Add row to Update History with current timestamp

9. **Output audit summary:**
   - Provide summary of findings, score changes, and priority actions
   - List all new exploit files created
   - Highlight any critical vulnerabilities requiring immediate attention

## Output Format

### Audit Summary
**Overall Security: X.X / 10** (± change from last audit)
**New vulnerabilities found:** N
**Vulnerabilities fixed since last audit:** N
**Highest-risk finding:** [description]

### Score Changes
| Competency | Previous | Current | Why |
|---|---|---|---|

### New Exploits Generated
| ID | Name | Severity | File |
|---|---|---|---|

### Fixed Since Last Audit
| ID | Name | How |
|---|---|---|

### Priority Actions
1. **[Critical]** {action}
2. **[High]** {action}
3. **[Medium]** {action}

### Tracker Updated
- [ ] ES/agent-security.md scores refreshed
- [ ] Vulnerability map updated
- [ ] Exploit index updated
- [ ] New exploit files created in ES/exploits/
- [ ] Update History row added

## Important Notes

- **Do NOT implement fixes** during audit - that's `/implement`'s job
- **Be thorough** - check every file, every endpoint, every configuration
- **No censorship** - report everything you find, no matter how uncomfortable
- **Working code** - exploit PoCs must actually execute and demonstrate the vulnerability
- **Evidence required** - every finding must cite specific code locations

## Integration Points

This workflow integrates with:
- `ES/agent-security.md` - updates scores, maps, and indices
- `ES/exploits/` - creates new exploit files
- `ES/playbooks/README.md` - references attack categories
- `agent.md` - follows architecture principles and Heretic mode

## Cadence

Run `/audit`:
- After adding new routes or endpoints
- After major architectural changes
- After implementing security fixes (to verify they worked)
- Monthly for ongoing security hygiene
- When suspicious activity is detected

## When to Use

- **Before deploying** new features
- **After security incidents** to verify fixes
- **Regular security hygiene** (monthly recommended)
- **Before major releases** to ensure no regressions
- **When learning new attack patterns** to check if they apply
