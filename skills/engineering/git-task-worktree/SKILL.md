---
name: git-task-worktree
description: Implement one task from the latest origin/develop baseline in an isolated worktree, then merge and push it back to develop.
disable-model-invocation: true
---

# Git Task Worktree

Implement one task in an isolated worktree based on the latest `origin/develop`, then merge the task branch back into `develop`, push it, and clean up the temporary resources. This skill is deliberately user-invoked because it creates branches, commits, worktrees, merges, pushes, and deletes remote branches.

The original checkout is never an implementation area. Leave its current branch and uncommitted changes exactly as they are, whether or not the worktree is clean.

## Resolve the task

Use the current conversation as the task source unless the user supplies an issue, Linear task, local file, or URL. Read the complete referenced task, including relevant issue comments, before creating a worktree. Extract the requested behavior, acceptance criteria, scope boundaries, constraints, and validation commands. Do not create Linear tasks or split the work into a task graph.

If the task reference is unavailable, ambiguous, or does not contain enough detail to implement safely, stop before creating a worktree and report the blocking detail without asking follow-up questions.

If the input contains unrelated tasks rather than one coherent deliverable, report the mismatch before creating a worktree. Do not automatically publish tickets or invoke another user-invoked skill.

## Create the worktree

1. Run `git fetch --prune` without changing the original checkout.
2. Confirm that `origin/develop` resolves to a commit. If it does not, stop without creating branches.
3. Derive a short slug and create `codex/task/<slug>` from `origin/develop`.
4. Create a task worktree outside the original checkout. Record the baseline SHA, task branch, worktree path, and task source in a recovery note outside the repository.
5. Do not copy, stash, reset, clean, or discard the original checkout's changes.

## Plan verifiable steps

Explore the relevant code and repository guidance in the task worktree. For a simple change, proceed directly to implementation without manufacturing a step list.

For a larger task, show a short sequence of steps, each naming an observable outcome and how to verify it, then continue without routine approval. Order steps by actual prerequisites. Keep the implementation, tests, fixtures, and required configuration for each behavior together, rather than making separate steps for each technical layer.

Check that the steps cover the task's acceptance criteria without duplicate work or unrelated deliverables. Use evidence that distinguishes the baseline from the target for new or changed behavior, and preserve already-working behavior as regression constraints. If exploration exposes a critical scope or acceptance ambiguity, stop and report it rather than guessing.

These are implementation steps within one task, not independently dispatched tickets. Keep every step in the same task worktree and branch, verify each outcome as it is implemented, and retain one final implementation commit after the task's focused checks pass.

## Implement and verify

Work only in the task worktree:

- Keep implementation, tests, fixtures, and required configuration in the same task branch.
- Run only the checks required by the task acceptance criteria or directly covering the changed behavior.
- Do not run repository-wide tests, formatters, linters, typechecks, or unrelated reviews.
- Create one clear implementation commit after the focused checks pass.

Record the commit SHA, changed paths, and focused check commands. Do not push the task branch unless the user explicitly asks for it.

## Integrate into develop

1. Fetch again.
2. Create a temporary `develop` integration worktree from the latest fetched `origin/develop` baseline.
3. If `origin/develop` advanced, merge its latest tip into the integration worktree with a normal merge and stop on conflicts.
4. Merge `codex/task/<slug>` into that worktree with `git merge --no-ff`, preserving a dedicated merge commit.
5. Run only the task-related focused checks needed after integration.
6. Push `develop` without force. If the push is rejected or the remote moved, stop and preserve every worktree, branch, and commit.

## Clean up only after success

After the `develop` push succeeds:

- remove the task worktree and temporary `develop` worktree;
- delete the local task branch;
- delete the remote `codex/task/<slug>` branch;
- retain the user's original branch and `develop`;
- report the baseline SHA, task commit, merge commit, final `develop` SHA, checks, and cleanup result.

On any implementation, focused check, conflict, merge, push, or cleanup failure, stop without reset, clean, revert, or destructive retry. Leave all recovery resources intact and report their paths and exact status.
