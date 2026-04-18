# MealMatch Agent Blueprint

MealMatch uses a portable agent system built around root context files, workflow-driven planning, and script-first operations.

## Core Files

- `agent.md`
- `agent-prompting.md`
- `agent-architect.md`
- `agent-backlog.md`
- `agent-command-backlog.md`
- `agent-blueprint.md`

## Operating Pattern

- keep project context in root agent files
- plan before multi-file implementation
- use package scripts instead of hidden manual steps
- keep architecture decisions explicit in docs
- use backlog files as durable memory between sessions

## Repo Shape

- `mobile/` owns UI and device capabilities
- `api/` owns HTTP, AI orchestration, persistence, and uploads
- `.windsurf/workflows/` owns planning and execution prompts