---
name: git-split-push
description: Split the current working tree into coherent commits and push them to the current branch's configured upstream.
disable-model-invocation: true
---

# Git Split Push

Organize the current working tree into a sequence of coherent commits, then push those commits to the current branch's configured upstream. This skill is deliberately user-invoked because it mutates Git history and pushes to a remote.

Do not rewrite existing commits. Work only with the current branch's staged, unstaged, and untracked changes. Never use `git push --force`, `--force-with-lease`, history rewriting, or destructive cleanup.

## Preflight

Before changing anything:

1. Confirm the repository root, current branch, and configured upstream.
2. Refuse to run on a detached `HEAD`, without an upstream, or when the branch cannot be pushed without force.
3. Fetch the configured remote when it is safe to do so, then verify that the local tip still has the expected relationship to its upstream.
4. Record the initial status, `HEAD`, upstream, and changed paths so progress can be reported and resumed.
5. Inspect repository guidance, hooks, and the available test or validation commands before choosing batch boundaries.

If preflight fails, stop without staging, committing, or discarding anything.

## Group changes into batches

Read the complete diff, including untracked files. Build the smallest useful set of vertical batches:

- Keep an implementation, its externally visible tests, and required fixtures together.
- Keep a configuration or documentation change separate only when it is independently meaningful and does not make an earlier batch fail.
- Respect dependency order. A batch must leave the repository buildable or testable at its boundary whenever the repository supports that check.
- Do not split one file mechanically unless separate hunks have clearly independent ownership and can be validated independently.
- Keep generated files with the change that generates them, except lockfiles, which stay with the dependency change.

If the changes cannot be assigned to coherent batches without guessing, stop and report the ambiguous paths instead of making a speculative commit plan.

## Execute each batch

For every batch, in dependency order:

1. Verify that no unexpected file changed since the previous batch.
2. Stage only the exact paths and hunks belonging to the batch.
3. Run the narrowest relevant formatter, linter, typecheck, or test command.
4. Create an imperative commit message that describes the behavior or intent, not the file list.
5. Push that commit to the configured upstream.
6. Verify the push result and record the commit hash before continuing.

Do not use `git add -A` or `git commit -a` when unrelated changes exist. If a hook changes files, review the new diff and either include those changes in the current batch or stop for manual resolution.

## Stop conditions and recovery

Stop immediately and leave all completed commits intact when any of these occurs:

- a hook, formatter, test, or validation command fails;
- a push is rejected, authentication is unavailable, or the remote moved unexpectedly;
- Git reports a conflict or a force push would be required;
- an untracked or generated file cannot be attributed safely;
- the working tree no longer matches the recorded batch plan.

Report the batches completed, commit hashes, remaining paths, and the exact command needed to inspect or continue. Never reset, stash, clean, or revert the user's work as part of recovery.
