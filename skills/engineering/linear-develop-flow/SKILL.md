---
name: linear-develop-flow
description: Create a baseline worktree, publish a Linear task graph, implement it with parallel or serial agents, and merge the result into develop.
disable-model-invocation: true
---

# Linear Develop Flow

Run a complete task-graph development flow from a clean Git baseline. This skill is user-invoked because it creates external Linear issues, worktrees, branches, merges, pushes, and deletes branches.

The original working tree is never modified or used as an implementation worktree. Never copy, stash, reset, or discard its uncommitted changes.

## Preflight and baseline

1. Confirm the repository root and verify that the original working tree is clean. If it is dirty, stop and tell the user to handle those changes first.
2. Fetch remote refs without changing the checked-out branch.
3. Choose the baseline in this order:
   - the current branch's latest configured upstream when the current branch is not `develop` or `main`;
   - otherwise `develop` and its configured upstream;
   - otherwise stop if neither baseline can be resolved.
4. Confirm that the baseline is not detached and that the target `develop` branch is available for the final merge.
5. Create an integration branch named `codex/linear-flow/<slug>` and an integration worktree from the selected baseline. Keep a run record outside the repository containing the baseline SHA, worktree paths, branch names, and Linear identifiers.

## Publish the Linear task graph

Use the available Linear MCP or API integration. Do not silently fall back to local Markdown.

1. Resolve the Linear team, project, workflow states, and credentials at runtime. If access, configuration, or permissions are missing, stop before creating anything.
2. Search for an existing parent task with the intended title. Stop on an ambiguous match rather than creating duplicates.
3. Create one parent task and child tasks that are complete vertical slices. Each child must include acceptance criteria, validation commands, the integration branch context, and its blocking children.
4. Create native parent-child relationships and native blocking relationships. Keep the returned identifiers in the run record.
5. Move a child to the active state only when its implementation agent starts. Move it to completed only after its branch is merged and its checks pass.

## Dispatch and implement

Treat the Linear blocking graph as the source of truth:

- Start every agent with a fresh context window and a task-specific worktree and branch based on the current integration tip.
- Run independent ready children in parallel. Serialize children with blockers or overlapping files.
- Each agent reads the child task, explores the codebase, calls the `tdd` skill for implementation, runs the task's checks, and reports its commit, changed paths, and test results.
- An agent must not merge to `develop`, push the final branch, delete branches, or modify another agent's worktree.
- When an agent finishes, merge its branch into the integration branch with a non-fast-forward merge, run the integration checks, and only then release newly unblocked children.

If an agent fails, a check fails, a conflict occurs, or the task graph no longer matches Linear, stop and preserve all worktrees, branches, commits, and the run record.

## Review and integrate

After every child is complete:

1. Call the `code-review` skill on the integration branch.
2. Use a fresh implementation agent to address all review findings, then review the resulting diff again.
3. Check out or attach the target `develop` worktree, update it safely, and merge the integration branch with a non-fast-forward merge.
4. Run the repository's required validation commands on `develop`.
5. Push `develop` without force. If the push fails, do not clean up anything.

## Cleanup and completion

Only after the `develop` push succeeds:

- mark the child tasks complete, then mark the parent task complete in Linear;
- remove every task worktree and the integration worktree;
- delete every local task and integration branch;
- delete the corresponding remote temporary branches;
- retain the original user branch and `develop`.

Report the selected baseline, Linear parent and child identifiers, execution order, merged commits, final `develop` SHA, and cleanup result. If cleanup or Linear updates fail after the code is safely pushed, report the exact remaining resources and continue with no destructive retry.
