---
name: git-task-worktree
description: Implement one task from the latest origin/develop baseline in an isolated worktree, then merge and push it back to develop.
disable-model-invocation: true
---

# Git Task Worktree

Implement one task in an isolated worktree based on the latest `origin/develop`, then merge the task branch back into `develop`, push it, and clean up the temporary resources. This skill is deliberately user-invoked because it creates branches, commits, worktrees, merges, pushes, and deletes remote branches.

Implementation stays in the task worktree. An original checkout on another branch remains untouched. Final integration can set aside unrelated edits in an authorized `develop` checkout under the target preparation rules below.

## Resolve the task

Use the current conversation as the task source unless the user supplies an issue, Linear task, local file, or URL. Read the complete referenced task, including relevant issue comments, before creating a worktree. Extract the requested behavior, acceptance criteria, scope boundaries, constraints, and validation commands. Do not create Linear tasks or split the work into a task graph.

If the task reference is unavailable, ambiguous, or does not contain enough detail to implement safely, stop before creating a worktree and report the blocking detail without asking follow-up questions.

If the input contains unrelated tasks rather than one coherent deliverable, report the mismatch before creating a worktree. Do not automatically publish tickets or invoke another user-invoked skill.

## Create the worktree

1. Run `git fetch --prune` without changing the original checkout.
2. Confirm that `origin/develop` resolves to a commit and record that initial baseline SHA. If it does not, stop without creating branches.
3. Derive a short slug and create `codex/task/<slug>` from `origin/develop`.
4. Create a task worktree outside the original checkout. Record the baseline SHA, task branch, worktree path, and task source in a recovery note outside the repository.
5. Leave the original checkout's changes untouched during setup and implementation.

## Plan verifiable steps

Explore the relevant code and repository guidance in the task worktree. For a simple change, proceed directly to implementation without manufacturing a step list.

For a larger task, show a short sequence of steps, each naming an observable outcome and how to verify it, then continue without routine approval. Order steps by actual prerequisites and exercise the first complete behavior in its required real environment early. Keep the implementation, tests, fixtures, and required configuration for each behavior together, rather than making separate steps for each technical layer.

Map every acceptance outcome to a step and a locatable validation method, including outcomes that require the complete task. Check coverage without duplicate work or unrelated deliverables. Use evidence that distinguishes the baseline from the target for new or changed behavior, and preserve already-working behavior as regression constraints. Resolve uncertain shared contracts before implementing against them. If exploration exposes a critical scope or acceptance ambiguity, stop and report it rather than guessing.

These are implementation steps within one task, not independently dispatched tickets. Keep every step in the same task worktree and branch, verify each outcome as it is implemented, and retain one final task implementation commit after its applicable checks pass when there are task changes. Update the external recovery note after each large vertical slice, including its tested content identity, passed checks, pending checks, logs, and live resources. If the task outgrows one focused context window or crosses an unplanned domain boundary, pause and reassess the remaining steps before continuing; this checkpoint does not grant permission to create other tasks or intermediate commits.

Resolve validation commands and their inclusion relationships from project scripts before scheduling them. A gate or command name is not proof of coverage: never assume a name such as `standard`, `test`, or `full` means the whole repository. Read the actual script definitions, classify direct, affected, aggregate, and complete-final checks, and choose the smallest combination covering acceptance and required gates. Do not run a wrapper and its constituent checks again on the same tested contents. Use a supported supplementary check with matching prior evidence when appropriate, without treating that check alone as complete acceptance.

Before implementation depends on an environment, check the required tools, dependencies, credential availability, account roles, service ports, and allowed origins. Record availability without secret values. If unavailable, name the affected acceptance and recovery condition and continue independent work.

## Implement and verify

Work only in the task worktree:

- Keep implementation, tests, fixtures, and required configuration in the same task branch.
- Prefer checks directly covering the changed behavior, and also run project-required gates, including repository-wide tests, lint, or typechecks when explicitly required. Do not add unrelated suites or reviews.
- Verify each slice as implemented, affected interactions after integration, and overall acceptance plus required gates on the final candidate before pushing. Run formatting, lint, affected tests, and contract consistency checks before expensive broad suites; synchronize generated artifacts and affected contract assertions first.
- Before a long check, inspect its input paths, included and excluded files, expansion reasons, command, arguments, and working directory using supported previews or command/scope output. Keep temporary artifacts outside automatic discovery where supported, preserving genuine source changes and unknown-path safeguards. A preview is not passing evidence.
- For required browser acceptance, stabilize identities, fixtures, and individual interactions before the complete multi-account journey. Use run-specific data identifiers and wait for the actual transaction response before asserting final state.
- Choose additional checks from actual risks, such as shared-interface contracts, failure paths, state consistency, compatibility, or migration and recovery. Use explicit manual evidence where automation does not apply.
- Create one clear task implementation commit after its applicable checks pass. Evidence-only work records its result without an empty commit. Later integration repairs use additional commits rather than rewriting recorded evidence.

Record the tested content identity, changed paths, validation scope, commands and working directory, relevant environment/data, results, logs, and evidence references in the recovery note. For a clean candidate, record the Git tree; for pre-commit checks, identify the base SHA, `headTree`, and a digest of every included input. Associate tests with the implementation commit only after its contents match. Keep the current step, code state, passed and pending checks, log locations, live process/session identifiers, and services started by this run current. After context compaction or resumption, reconcile that record with the checkout and running checks before continuing; reuse valid findings instead of repeating full exploration.

Reuse evidence only when the tested content identity, scope, commands, and relevant inputs still match. A changed commit SHA with the same tested tree does not invalidate exact evidence by itself; a changed tree or relevant input requires affected checks to run again. Failed, unavailable, or missing evidence is not a pass. Final project-required gates apply to the final candidate. Do not push the task branch unless the user explicitly asks for it.

## Integrate into develop

### Prepare local develop

- Inspect `git worktree list --porcelain`. Reuse the original checkout when it is on `develop`; otherwise attach an unoccupied local `develop` in a temporary target worktree. If another worktree holds it, inspect that checkout and reuse it only when its ownership and use for this run are established. Never force a second checkout or change the original checkout's other branch.
- Keep an existing local `develop` at its current tip. If absent, create it from the recorded initial baseline SHA, not a newly fetched tip. Record the target path, starting SHA, and whether this run created the worktree.
- Before changing the target, check for unmerged entries or an in-progress Git operation. If present, stop and preserve that state. Check `git log origin/develop..develop` against the recovery note and initial baseline; unknown or unrelated local-only commits block integration before stashing.
- In the original `develop` checkout, inspect staged, unstaged, and untracked changes. Commit only current-task changes using explicit paths or hunks, verifying and validating exactly what will be committed. Never use a blanket add or include unrelated staged changes. If required task edits cannot be safely separated from unrelated edits, stop without committing or stashing them. Record any pre-merge task commit and include its behavior in final validation.
- In the authorized target only, check `git status --porcelain --untracked-files=all`. If there are remaining edits outside the delivery, run `git stash push --include-untracked -m "<unique delivery label>"` in that checkout. Do not include ignored files. Find the new entry by its unique label in `git stash list --format="%H %gs"` because worktrees share the stash list. Record its full SHA, label, and worktree path in the recovery note before merging, including any entry created by a failed stash command. Proceed only if the command succeeded, the new entry is verified, and the status check is now clean. If status started clean, skip the stash. Never reset or clean the checkout to force progress.

### Merge locally, synchronize, validate, and push

Before each target merge, if `git ls-files -z --others --ignored --exclude-standard` finds ignored files, preview the result with `git merge-tree --write-tree HEAD <incoming>`. Stop if a new or changed path in the result would overwrite an ignored path (including file/directory collisions and case aliases on case-insensitive filesystems), or if safety cannot be verified. Do not rely on `--no-overwrite-ignore` alone for non-fast-forward merges.

1. In the clean local `develop` worktree, merge `codex/task/<slug>` with `git merge --no-ff --no-autostash --no-overwrite-ignore`, preserving and recording the dedicated task merge commit.
2. Only after that local merge, fetch `origin` and resolve `origin/develop`. Check `git merge-base --is-ancestor origin/develop develop`: exit 0 means no remote commits need merging, exit 1 requires `git merge --no-edit --no-autostash --no-overwrite-ignore origin/develop` in the clean target worktree, and any other error stops the operation. Use explicit fetch and merge rather than a pull that might rebase. Never rebase or force-push.
3. Revalidate affected behavior after remote merges, conflict resolutions, or repairs. Complete overall acceptance and all final project-required gates on the resulting candidate, using the evidence rules above. Record the tested SHA and results; failed or pending checks block pushing.
4. Confirm the target is clean and local `develop` still equals the tested SHA; unexpected local changes pause delivery. Push explicitly with `git push origin develop:develop`, without force. A rejection caused by new remote commits returns to step 2, including validation of the new candidate. Allow at most two additional push attempts (three total). Permission, network, branch-policy, fetch, or unsafe conflict failures are not race retries. On those failures or exhausted retries, preserve all recovery resources and report the blocker.

## Clean up only after success

After the `develop` push succeeds:

- remove only the task and temporary target worktrees created by this run; never remove a reused or original checkout;
- delete only this run's merged local task branch;
- delete a remote task counterpart only if the run record proves this run created it under explicit authorization and it still points to the recorded delivered commit, otherwise leave it untouched;
- retain the user's original branch, `develop`, and the recovery note;
- report the baseline SHA, task commit, merge commit, final `develop` SHA, checks, and cleanup result.

On success or failure, leave any delivery stash untouched. Report its recorded SHA and worktree path, with `git stash apply --index <SHA>` for manual recovery in that checkout when it is ready.

## Recover within scope

Repair local implementation or check failures within the task scope and verify the failed check first, then choose reruns from the actual impact and project requirements. Distinguish business assertion failures, command compatibility problems, tool or dependency faults, and unavailable environments. For a tool or dependency fault, preserve the command, scope, complete log or report location, and resource state, identify the cause, and rerun only after obtaining new evidence or applying a plausible repair. Record why a whole-suite rerun is needed, such as changed relevant contents, invalidated evidence, or a required final gate; do not automatically restart every command. Revisit the remaining steps when a hypothesis fails or a step becomes too large, retaining completed evidence and updating acceptance coverage before continuing. A newly discovered set of independent deliverables is a task-shape mismatch to report, not authority to create Linear issues.

When a check exceeds its historical duration, inspect process activity, log progress, and resource contention. Continue a normally progressing check; elapsed time alone is not failure or permission to lower gates. Do not impose a universal timeout or start concurrent checks that contend for the same build directory.

Shared environment failures pause the checks they affect. Resolve merge conflicts only when intent is clear and within scope, then validate; preserve unsafe or ambiguous conflict states. Missing permissions or critical decisions stop affected work. Do not repeat a failed attempt without new evidence or a plausible repair, and never lower acceptance gates.

When no safe in-scope repair remains, or a push or cleanup failure cannot be resolved under the rules above, preserve remaining worktrees, branches, commits, and the recovery note without reset, clean, revert, or destructive retry. Report the failing version, command, scope, diagnostics, attempted repairs, exact resource status, and condition for resuming.
