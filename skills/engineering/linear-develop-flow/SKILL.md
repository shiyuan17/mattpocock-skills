---
name: linear-develop-flow
description: Create a baseline worktree, publish a Linear task graph, implement it with parallel or serial agents, and merge the result into develop.
disable-model-invocation: true
---

# Linear Develop Flow

Run a complete task-graph development flow from the latest `develop` baseline. This skill is user-invoked because it creates external Linear issues, worktrees, branches, merges, pushes, and deletes branches.

The original working tree is never modified or used as an implementation worktree. Its uncommitted changes remain untouched.

## Resolve the request

Use the current conversation unless the user supplies a spec, issue, local file, or URL. Read the complete referenced request, including relevant issue comments. Extract the requested behaviors, acceptance criteria, constraints, and out-of-scope work. If the source is unavailable or a critical scope or acceptance decision is missing, stop before creating resources and report the blocking detail without asking follow-up questions.

## Preflight and baseline

1. Fetch remote refs without changing the checked-out branch.
2. Confirm that the latest `origin/develop` resolves to a commit. If it does not, stop and report the blocking detail without asking follow-up questions.
3. Create an integration branch named `codex/linear-flow/<slug>` and an integration worktree from the latest `origin/develop`. Keep a run record outside the repository containing the baseline SHA, worktree paths, branch names, and Linear identifiers.

## Decompose into deliverable slices

Explore the relevant implementation and repository guidance in the integration worktree before drafting children. Use the project's domain vocabulary and existing validation commands.

- Split by the smallest complete, observable behavior, not by database, API, UI, or test layer. A slice crosses only the layers its behavior actually needs and owns its implementation, tests, fixtures, and required configuration.
- Size each child for one fresh context window with a focused acceptance check. Do not target a task count or split small work merely to create parallelism: one child is valid. Merge fragments that share an acceptance outcome and cannot be verified separately.
- Separate prerequisite refactoring only when it is necessary to enable the requested change. For a wide mechanical refactor, expand with a compatible form, migrate callers in verifiable batches, then contract after all migrations. Each batch must keep its focused checks passing.
- Add a blocking edge only when a child needs a specific result from another child. Name that result. Record edit conflicts separately in the run record: inspect overlapping edit regions and shared interfaces, rather than serializing everything that touches the same file.

Each child must contain:

- **Outcome and scope:** the observable result and what this child does not own.
- **Acceptance criteria and evidence:** observable conditions and the evidence that proves them. For new or changed behavior, distinguish the baseline from the target; record already-working behavior as regression constraints.
- **Focused validation:** actual commands and the behavior they verify, or explicit manual evidence when no automated check applies.
- **Blocked by:** direct prerequisite children and the specific outputs consumed, or none.
- **Context pointers:** the source request, relevant decisions or interfaces, and the integration branch context.

Before publishing, check that every requested behavior has an acceptance owner, no outcome is duplicated, all prerequisites are included, and the graph is acyclic. A child must be verifiable once its own prerequisites have landed, without waiting for downstream work. Split oversized children and combine fragments that fail this check.

Show the proposed children, their outcomes, blocking reasons, and any scheduling constraints, then continue without routine approval. If a critical scope or acceptance decision remains unresolved, stop and report it rather than inventing requirements.

## Publish the Linear task graph

Use the available Linear MCP or API integration. Do not silently fall back to local Markdown.

1. Resolve the Linear team, project, workflow states, and credentials at runtime. If access, configuration, or permissions are missing, stop before creating anything.
2. Search for an existing parent task with the intended title. Stop on an ambiguous match rather than creating duplicates.
3. Create one parent task and the drafted children in dependency order, including the outcome, scope, acceptance criteria and evidence, validation, prerequisites, and context pointers above.
4. Create native parent-child relationships and native blocking relationships. Map the draft children to returned Linear identifiers in the run record, including their scheduling constraints.
5. Move a child to the active state only when its implementation agent starts. Record its merge SHA and passing checks in the run record after integration; leave its Linear completion state unchanged until the final `develop` push succeeds.

## Dispatch and implement

Treat the Linear blocking graph as the source of truth for dependencies. A child is ready when every prerequisite has merged into the integration branch and passed its required focused checks, even though its final Linear completion state is still pending:

- Start every agent with a fresh context window and a task-specific worktree and branch based on the current integration tip.
- Run independent ready children in parallel when their edits and shared interfaces are compatible. Apply the scheduling constraints in the run record to conflicting edits without adding artificial Linear blocking edges.
- Each agent reads the child task, explores the codebase, runs only the checks required by that child, and reports its commit, changed paths, and focused check results.
- An agent must not merge to `develop`, push the final branch, delete branches, or modify another agent's worktree.
- When an agent finishes, merge its branch into the integration branch with a non-fast-forward merge. Run the focused checks needed to verify the merged result, record the merge and evidence, and release newly unblocked children without running unrelated integration-wide checks.

If an agent fails, a focused check fails, a conflict occurs, or the task graph no longer matches Linear, stop and preserve all worktrees, branches, commits, and the run record.

## Review and integrate

After every child has merged into the integration branch and its required focused checks have passed:

1. Fetch again. If `origin/develop` advanced, merge its latest tip into the integration branch with a normal merge, never a rebase, and stop on conflicts.
2. Check out or attach the target `develop` worktree from the latest fetched `origin/develop` baseline, then merge the integration branch with a non-fast-forward merge.
3. Run only focused checks directly related to the completed Linear tasks.
4. Push `develop` without force. If the push fails, do not clean up anything.

## Cleanup and completion

Only after the `develop` push succeeds:

- mark the child tasks complete, then mark the parent task complete in Linear;
- remove every task worktree and the integration worktree;
- delete every local task and integration branch;
- delete the corresponding remote temporary branches;
- retain the original user branch and `develop`.

Report the selected baseline, Linear parent and child identifiers, execution order, merged commits, focused checks, final `develop` SHA, and cleanup result. If cleanup or Linear updates fail after the code is safely pushed, report the exact remaining resources and continue with no destructive retry.
