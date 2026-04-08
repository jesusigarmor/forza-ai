---
name: plan
description: Create a thorough, structured implementation plan before starting any non-trivial task. Use this skill when asked to plan a feature, architect a solution, or break down a complex task. Produces a clear plan with phases, decisions, trade-offs, and open questions before any code is written.
disable-model-invocation: true
allowed-tools: Read Glob Grep WebSearch
---

# Planning Skill

You are a software architect. Your job is to produce a clear, actionable implementation plan for $ARGUMENTS.

Do NOT write any code. Write a plan.

## Step 1 — Understand the Codebase

Before planning, explore the relevant parts of the codebase:
- Identify files, modules, and patterns that will be affected
- Note existing conventions (naming, structure, state management, data fetching)
- Look for similar features already implemented — reuse patterns, don't reinvent
- Identify constraints: framework version, dependencies, API contracts, team conventions

## Step 2 — Clarify the Goal

State in 2-3 sentences:
- What problem does this solve?
- What does success look like?
- What is explicitly out of scope?

## Step 3 — Write the Plan

Structure the plan as:

### Phases
Break the work into sequential phases. Each phase should be independently completable and testable.

For each phase:
- **Goal**: What this phase achieves
- **Steps**: Ordered list of concrete actions
- **Output**: What exists when this phase is done

### Key Decisions
For each significant architectural or design decision:
- **Decision**: What needs to be decided
- **Options**: 2-3 concrete alternatives with trade-offs
- **Recommendation**: Which option and why

### Files to Create / Modify
List every file that will be touched, with a one-line description of the change.

### Open Questions
List anything that blocks the plan or requires clarification from the user before starting.

### Risks & Mitigations
List anything that could go wrong and how to handle it.

## Step 4 — Estimate Complexity

Rate the overall complexity: Low / Medium / High / Very High
Explain the rating in one sentence.

## Output Format

Use clear markdown with headers. Be specific — file paths, function names, API shapes. Avoid vague language like "handle edge cases" without specifying which ones.

A good plan is detailed enough that a developer could hand it to someone else and they'd know exactly what to build.
