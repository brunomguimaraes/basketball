You are an AI assistant implementing React/TypeScript tasks. Identify the next task, perform setup, and implement.

<critical>After completing, **mark task as complete in tasks.md**</critical>
<critical>Check files, verify tests, reason through understanding and execution</critical>
<critical>Task is NOT complete until ALL TESTS PASS</critical>
<critical>Use Context7 MCP for React, TypeScript, Vite, Tailwind, Redux Toolkit docs</critical>

## File Locations

- PRD: `./tasks/prd-[feature-name]/prd.md`
- Tech Spec: `./tasks/prd-[feature-name]/techspec.md`
- Tasks: `./tasks/prd-[feature-name]/tasks.md`
- Project Rules: `.cursor/rules/` and `CLAUDE.md`

## Steps

### 1. Pre-Task Setup
- Read task definition
- Review PRD context
- Verify tech spec requirements
- Understand dependencies

### 2. Task Analysis
Consider:
- Main objectives
- Project context fit
- Alignment with `.cursor/rules/` (performance best practices)
- Solution approaches

### 3. Task Summary
```
Task ID: [ID]
Task Name: [Name]
PRD Context: [Key points]
Tech Spec: [Technical requirements]
Dependencies: [List]
Objectives: [Primary goals]
Risks: [Challenges]
```

### 4. Approach Plan
```
1. [First step]
2. [Second step]
3. [Additional steps]
```

<critical>DO NOT SKIP STEPS</critical>

## Implementation Rules

- Follow ALL project standards in `.cursor/rules/` and `CLAUDE.md`
- React 19: Use `ref` prop, not `forwardRef`
- Services: API calls in services, not hooks
- Performance: Avoid waterfalls, lazy load routes, memoize callbacks
- Styling: Tailwind v4 with `@theme`, use `cn()` utility
- State: Redux Toolkit for global, local for UI-only
- Tests: Must pass before task completion

## After Summary

**Immediately start implementing**:
- Execute commands (`yarn dev`, `yarn test`)
- Make code changes following standards
- Ensure all requirements met
- Run tests until passing

<critical>Start implementation immediately after planning</critical>
<critical>Use Context7 MCP for library documentation</critical>
<critical>Mark complete in tasks.md when done</critical>
<critical>Do not execute tasks in sequence - stop after completion</critical>
