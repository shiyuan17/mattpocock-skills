---
name: git-task-worktree
description: Implement one task from the latest origin/develop baseline in an isolated worktree, then merge and push it back to develop.
disable-model-invocation: true
---

# Git Task Worktree

Implement one task in an isolated worktree based on the latest `origin/develop`, then merge the task branch back into `develop`, push it, and clean up the temporary resources. This skill is deliberately user-invoked because it creates branches, commits, worktrees, merges, pushes, and deletes remote branches.

Implementation stays in the task worktree. An original checkout on another branch remains untouched. If the original checkout is on `develop`, final integration may use it after committing only current-task changes under the target preparation rules below.

## Resolve the task

Use the current conversation as the task source unless the user supplies an issue, Linear task, local file, or URL. Read the complete referenced task, including relevant issue comments, before creating a worktree. Extract the requested behavior, acceptance criteria, scope boundaries, constraints, and validation commands. Do not create Linear tasks or split the work into a task graph.

If the task reference is unavailable, ambiguous, or does not contain enough detail to implement safely, stop before creating a worktree and report the blocking detail without asking follow-up questions.

If the input contains unrelated tasks rather than one coherent deliverable, report the mismatch before creating a worktree. Do not automatically publish tickets or invoke another user-invoked skill.

## Create the worktree

1. Run `git fetch --prune` without changing the original checkout.
2. Confirm that `origin/develop` resolves to a commit and record that initial baseline SHA. If it does not, stop without creating branches.
3. Derive a short slug and create `codex/task/<slug>` from `origin/develop`.
4. Create a task worktree outside the original checkout. Record the baseline SHA, task branch, worktree path, and task source in a recovery note outside the repository.
5. Do not copy, stash, reset, clean, or discard the original checkout's changes.

## Plan verifiable steps

Explore the relevant code and repository guidance in the task worktree. For a simple change, proceed directly to implementation without manufacturing a step list.

For a larger task, show a short sequence of steps, each naming an observable outcome and how to verify it, then continue without routine approval. Order steps by actual prerequisites. Keep the implementation, tests, fixtures, and required configuration for each behavior together, rather than making separate steps for each technical layer.

Map every acceptance outcome to a step and a locatable validation method, including outcomes that require the complete task. Check coverage without duplicate work or unrelated deliverables. Use evidence that distinguishes the baseline from the target for new or changed behavior, and preserve already-working behavior as regression constraints. Resolve uncertain shared contracts before implementing against them. If exploration exposes a critical scope or acceptance ambiguity, stop and report it rather than guessing.

These are implementation steps within one task, not independently dispatched tickets. Keep every step in the same task worktree and branch, verify each outcome as it is implemented, and retain one final task implementation commit after its applicable checks pass when there are task changes.

## Implement and verify

Work only in the task worktree:

- Keep implementation, tests, fixtures, and required configuration in the same task branch.
- Prefer checks directly covering the changed behavior, and also run project-required gates, including repository-wide tests, lint, or typechecks when explicitly required. Do not add unrelated suites or reviews.
- Verify each slice as implemented, affected interactions after integration, and overall acceptance plus required gates on the final candidate before pushing.
- Choose additional checks from actual risks, such as shared-interface contracts, failure paths, state consistency, compatibility, or migration and recovery. Use explicit manual evidence where automation does not apply.
- Create one clear task implementation commit after its applicable checks pass. Evidence-only work records its result without an empty commit. Later integration repairs use additional commits rather than rewriting recorded evidence.

Record the tested commit SHA, changed paths, validation scope, commands and working directory, relevant environment/data, results, and evidence references in the recovery note. Resolve commands and scope options from actual project guidance. Avoid redundant commands when a broader check already supplies the same evidence. Reuse evidence only when the tested code, scope, commands, and relevant inputs still match; failed, unavailable, or missing evidence is not a pass. Final project-required gates apply to the final candidate. Do not push the task branch unless the user explicitly asks for it.

## Integrate into develop

### Prepare local develop

- Inspect `git worktree list --porcelain`. Reuse the original checkout when it is on `develop`; otherwise attach an unoccupied local `develop` in a temporary target worktree. If another worktree holds it, inspect that checkout and reuse it only when its ownership and use for this run are established. Never force a second checkout or change the original checkout's other branch.
- Keep an existing local `develop` at its current tip. If absent, create it from the recorded initial baseline SHA, not a newly fetched tip. Record the target path, starting SHA, and whether this run created the worktree.
- In an original checkout on `develop`, inspect staged, unstaged, and untracked changes before committing only changes attributable to the current task. Stage explicit paths or hunks, inspect the staged diff, and validate those changes. Never use a blanket add or include unrelated staged changes. If unrelated changes remain, stop before merging and preserve them; do not stash, reset, clean, or discard them to make room. Other reused target worktrees must already be clean.
- Review `git log origin/develop..develop` against the recovery note and initial baseline. Confirm those local-only commits belong to the authorized delivery; unknown or unrelated unpushed commits block integration. Record any pre-merge task commit and include its behavior in final validation.

### Merge locally, synchronize, validate, and push

1. In the clean local `develop` worktree, merge `codex/task/<slug>` with `git merge --no-ff`, preserving and recording the dedicated task merge commit.
2. Only after that local merge, fetch `origin` and resolve `origin/develop`. Check `git merge-base --is-ancestor origin/develop develop`: exit 0 means no remote commits need merging, exit 1 requires a normal `git merge --no-edit origin/develop` in the target worktree, and any other error stops the operation. Use explicit fetch and merge rather than a pull that might rebase. Never rebase or force-push.
3. Revalidate affected behavior after remote merges, conflict resolutions, or repairs. Complete overall acceptance and all final project-required gates on the resulting candidate, using the evidence rules above. Record the tested SHA and results; failed or pending checks block pushing.
4. Confirm the target is clean and local `develop` still equals the tested SHA; unexpected local changes pause delivery. Push explicitly with `git push origin develop:develop`, without force. A rejection caused by new remote commits returns to step 2, including validation of the new candidate. Allow at most two additional push attempts (three total). Permission, network, branch-policy, fetch, or unsafe conflict failures are not race retries. On those failures or exhausted retries, preserve all recovery resources and report the blocker.

## Clean up only after success

After the `develop` push succeeds:

- remove only the task and temporary target worktrees created by this run; never remove a reused or original checkout;
- delete only this run's merged local task branch;
- delete a remote task counterpart only if the run record proves this run created it under explicit authorization and it still points to the recorded delivered commit, otherwise leave it untouched;
- retain the user's original branch, `develop`, and the recovery note;
- report the baseline SHA, task commit, merge commit, final `develop` SHA, checks, and cleanup result.

## Recover within scope

Repair local implementation or check failures within the task scope and rerun affected checks. Revisit the remaining steps when a hypothesis fails or a step becomes too large, retaining completed evidence and updating acceptance coverage before continuing. A newly discovered set of independent deliverables is a task-shape mismatch to report, not authority to create Linear issues.

Shared environment failures pause the checks they affect. Resolve merge conflicts only when intent is clear and within scope, then validate; preserve unsafe or ambiguous conflict states. Missing permissions or critical decisions stop affected work. Do not repeat a failed attempt without new evidence or a plausible repair, and never lower acceptance gates.

When no safe in-scope repair remains, or a push or cleanup failure cannot be resolved under the rules above, preserve remaining worktrees, branches, commits, and the recovery note without reset, clean, revert, or destructive retry. Report the failing version, command, scope, diagnostics, attempted repairs, exact resource status, and condition for resuming.
