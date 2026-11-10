## What it does

`git-task-worktree` implements one task from the latest `origin/develop` in an isolated worktree, then merges the result into `develop`, pushes it, and removes the temporary branches.

Implementation stays in the task worktree. An original checkout on another branch remains untouched. When the original checkout is on `develop`, final integration first commits only its current-task changes; unrelated changes block merging and remain preserved. A task may have several verifiable implementation steps, all in one task worktree and branch.

## When to reach for it

You invoke this by typing `/git-task-worktree`, and the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own.

- Reach for it when one task needs a clean `develop` baseline and a complete branch-to-merge lifecycle.
- Use [linear-develop-flow](https://aihero.dev/skills-linear-develop-flow) when the work needs Linear parent and child tasks, blocking relationships, or parallel task execution.
- Use [git-split-push](https://aihero.dev/skills-git-split-push) when implementation is already complete and the remaining problem is organizing an existing working tree into commits.

## Prerequisites

The repository must expose a reachable `origin/develop` ref and allow ordinary pushes to `develop`. The task may come from the current conversation or an explicit issue, Linear task, local file, or URL. Missing task details stop the run with a report instead of a follow-up question.

## One isolated task

The skill creates `codex/task/<slug>` from `origin/develop` and keeps implementation and slice checks inside that worktree. Final integration uses local `develop`, reusing a suitable checkout or creating a temporary target worktree. It never copies or cleans the original checkout.

Simple changes go directly to implementation. Larger tasks get a short sequence of observable outcomes and focused checks, shown before implementation and executed without routine approval. Every acceptance outcome has a step and validation method, including outcomes requiring the complete task. Each step keeps the related implementation and tests together, and all steps contribute to one final task implementation commit. Evidence-only work does not create an empty commit. Unrelated tasks are reported as a mismatch; they are not automatically turned into a task graph.

## Local develop before remote synchronization

The task branch merges into local `develop` with a dedicated merge commit before the flow fetches and merges newer `origin/develop` commits. Slice checks prove each behavior, integration checks cover affected interactions, and final acceptance plus all project-required gates cover the candidate that will be pushed. Checks follow the actual risks rather than a fixed list for every task.

- An existing local `develop` keeps its history. Unrelated or unexplained unpushed commits block delivery.
- An original checkout on `develop` can be reused after only current-task changes are committed and the target is clean. Other original branches remain untouched.
- A `develop` checked out elsewhere is located and checked for ownership before reuse; it is never forcibly checked out twice.
- A push rejected because the remote advanced allows up to two additional attempts, each after synchronization and validation. Other failures preserve recovery resources.

Recorded evidence identifies the tested commit, scope, commands, environment, and result. Remote merges and repairs require affected checks again, and required final gates apply to the resulting candidate. Pushing requires a clean target still pointing to the tested commit. Local implementation or check failures can be repaired within scope; unclear conflicts, missing permissions, or shared environment faults pause the affected work.

## Common questions

**What happens to uncommitted changes in my current checkout?**

The task worktree starts from `origin/develop` without copying them. If your original checkout is on another branch, they remain untouched. If it is on `develop`, the flow commits only current-task edits before final integration; unrelated remaining edits block that merge and stay preserved.

**Does it run the whole repository test suite?**

It prefers checks covering the changed behavior, but runs repository-wide checks when project guidance requires them. It avoids unrelated suites and reuses still-valid evidence without skipping required final gates.

**Does it leave the task branch around after merging?**

No. After the `develop` push succeeds, it removes this run's temporary worktrees and merged local task branch. A reused original checkout stays in place. Task branches are not normally pushed; a remote counterpart is removed only if this run created it under explicit authorization and it still points to the recorded delivered commit. Failed deliveries preserve recovery resources.

**Does each implementation step get its own branch or ticket?**

No. Steps belong to one coherent task and stay in its single task worktree and branch. Independently dispatched child tasks belong in the Linear workflow.

## It's working if

- The report names the exact `origin/develop` baseline SHA before implementation starts.
- The task branch contains one clear implementation commit with the task-related changes.
- Larger tasks show verifiable steps that cover the acceptance criteria, with no extra task branches or tickets.
- Focused checks run against the task worktree and, when needed, the integrated branch.
- `develop` receives the task merge before newer remote commits are merged and is pushed without force after final acceptance and required project gates pass.
- Remote competition triggers at most two synchronization-and-validation retries.
- Temporary resources created by the run disappear only after a successful push; reused checkouts and unrelated work remain.

## Where it fits

`git-task-worktree` is the single-task branch of the engineering flow. Use [implement](https://aihero.dev/skills-implement) for direct ticket work, this skill when isolation from `develop` and automatic integration matter, and [linear-develop-flow](https://aihero.dev/skills-linear-develop-flow) for tracker-backed multi-task orchestration. [ask-matt](https://aihero.dev/skills-ask-matt) routes between them.
