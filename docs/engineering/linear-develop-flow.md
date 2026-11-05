## What it does

`linear-develop-flow` runs a complete task-graph delivery loop: it creates an isolated worktree from the latest `origin/develop` baseline, publishes a parent and child task graph in Linear, coordinates implementation work across task worktrees, and integrates the result into `develop`.

The original checkout is never used as an implementation area. Dirty working-tree changes are left untouched and do not block the flow.

## When to reach for it

You invoke this by typing `/linear-develop-flow`, and the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own.

- Reach for it when Linear is the system of record and the work benefits from explicit blocking relationships and parallel execution.
- Use [implement-spec](https://aihero.dev/skills-implement-spec) when you already have tickets and want an integration branch without this flow's Linear and `develop` lifecycle.

## Prerequisites

The repository must have a resolvable `origin/develop` baseline, a usable Git remote, and credentials for a Linear MCP or API integration. Missing task details stop the flow with a report instead of a follow-up question.

## The task graph

The flow creates one parent task and complete vertical child tasks. Native parent-child and blocking relationships make the ready frontier visible in Linear. Independent children can run in parallel, while blockers or overlapping file ownership are serialized. Each child runs only its own focused checks.

## Integration boundary

Agents work in fresh task worktrees and report commits back to the integration branch. The flow uses non-fast-forward merges without unrelated integration-wide validation. It only deletes local and remote temporary branches after the final `develop` push succeeds.

## Common questions

**Does it copy my uncommitted work into the new worktree?**

No. It leaves the original checkout unchanged, and a dirty original worktree does not block the flow.

**What if Linear or the final push is unavailable?**

The flow stops before the affected mutation and preserves its worktrees, branches, commits, and run record for recovery.

**Does it run the whole repository test suite?**

No. It runs only checks directly tied to the completed Linear tasks, not unrelated repository-wide validation.

## It's working if

- The run reports the selected baseline SHA before creating the integration worktree.
- Linear contains one parent, complete child tasks, and native blocking edges.
- Only ready children are dispatched, and each child has its own worktree and branch.
- Focused checks pass for each relevant task and, when needed, before the `develop` push.
- Temporary local and remote branches disappear only after a successful `develop` push.

## Where it fits

`linear-develop-flow` is the Linear-backed orchestration step for work that needs more than one implementation session. It can replace the task-graph execution part of [implement-spec](https://aihero.dev/skills-implement-spec); use [code-review](https://aihero.dev/skills-code-review) separately when a review is needed. [ask-matt](https://aihero.dev/skills-ask-matt) routes to it when task tracking, worktrees, and `develop` integration must be handled together.
