## What it does

`git-task-worktree` implements one task from the latest `origin/develop` in an isolated worktree, then merges the result into `develop`, pushes it, and removes the temporary branches.

The original checkout remains untouched, including any uncommitted changes. A dirty original worktree does not block the flow. A task may have several verifiable implementation steps, all in one task worktree and branch.

## When to reach for it

You invoke this by typing `/git-task-worktree`, and the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own.

- Reach for it when one task needs a clean `develop` baseline and a complete branch-to-merge lifecycle.
- Use [linear-develop-flow](https://aihero.dev/skills-linear-develop-flow) when the work needs Linear parent and child tasks, blocking relationships, or parallel task execution.
- Use [git-split-push](https://aihero.dev/skills-git-split-push) when implementation is already complete and the remaining problem is organizing an existing working tree into commits.

## Prerequisites

The repository must expose a reachable `origin/develop` ref and allow ordinary pushes to `develop`. The task may come from the current conversation or an explicit issue, Linear task, local file, or URL. Missing task details stop the run with a report instead of a follow-up question.

## One isolated task

The skill creates `codex/task/<slug>` from `origin/develop`, keeps implementation and task-focused checks inside that worktree, and uses a temporary integration worktree for the final non-fast-forward merge. It never copies or cleans the original checkout.

Simple changes go directly to implementation. Larger tasks get a short sequence of observable outcomes and focused checks, shown before implementation and executed without routine approval. Each step keeps the related implementation and tests together, and all steps contribute to one final implementation commit. Unrelated tasks are reported as a mismatch before creating a worktree; they are not automatically turned into a task graph.

## Common questions

**What happens to uncommitted changes in my current checkout?**

Nothing. They stay where they are while the task worktree starts from `origin/develop`.

**Does it run the whole repository test suite?**

No. It runs only checks required by the task or directly covering the changed behavior. Repository-wide checks and unrelated reviews are out of scope.

**Does it leave the task branch around after merging?**

No. After the `develop` push succeeds, it removes the task worktree and deletes the task branch locally and remotely. Failed runs preserve them for recovery.

**Does each implementation step get its own branch or ticket?**

No. Steps belong to one coherent task and stay in its single task worktree and branch. Independently dispatched child tasks belong in the Linear workflow.

## It's working if

- The report names the exact `origin/develop` baseline SHA before implementation starts.
- The task branch contains one clear implementation commit with the task-related changes.
- Larger tasks show verifiable steps that cover the acceptance criteria, with no extra task branches or tickets.
- Focused checks run against the task worktree and, when needed, the integrated branch.
- `develop` receives a dedicated merge commit and is pushed without force.
- Temporary worktrees and task branches disappear only after a successful push.

## Where it fits

`git-task-worktree` is the single-task branch of the engineering flow. Use [implement](https://aihero.dev/skills-implement) for direct ticket work, this skill when isolation from `develop` and automatic integration matter, and [linear-develop-flow](https://aihero.dev/skills-linear-develop-flow) for tracker-backed multi-task orchestration. [ask-matt](https://aihero.dev/skills-ask-matt) routes between them.
