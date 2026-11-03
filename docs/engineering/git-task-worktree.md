## What it does

`git-task-worktree` implements one task from the latest `origin/develop` in an isolated worktree, then merges the result into `develop`, pushes it, and removes the temporary branches.

The original checkout remains untouched, including any uncommitted changes. This is a single-task lifecycle, not a Linear task graph or a multi-agent orchestration flow.

## When to reach for it

You invoke this by typing `/git-task-worktree`, and the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own.

- Reach for it when one task needs a clean `develop` baseline and a complete branch-to-merge lifecycle.
- Use [linear-develop-flow](https://aihero.dev/skills-linear-develop-flow) when the work needs Linear parent and child tasks, blocking relationships, or parallel task execution.
- Use [git-split-push](https://aihero.dev/skills-git-split-push) when implementation is already complete and the remaining problem is organizing an existing working tree into commits.

## Prerequisites

The repository must expose a reachable `origin/develop` ref and allow ordinary pushes to `develop`. The task may come from the current conversation or an explicit issue, Linear task, local file, or URL.

## One isolated task

The skill creates `codex/task/<slug>` from `origin/develop`, keeps implementation and validation inside that worktree, and uses a temporary integration worktree for the final non-fast-forward merge. It never copies or cleans the original checkout.

## Common questions

**What happens to uncommitted changes in my current checkout?**

Nothing. They stay where they are while the task worktree starts from `origin/develop`.

**Does it leave the task branch around after merging?**

No. After the `develop` push succeeds, it removes the task worktree and deletes the task branch locally and remotely. Failed runs preserve them for recovery.

## It's working if

- The report names the exact `origin/develop` baseline SHA before implementation starts.
- The task branch contains one clear implementation commit with its tests.
- Review and validation run against the fixed develop baseline and the integrated branch.
- `develop` receives a dedicated merge commit and is pushed without force.
- Temporary worktrees and task branches disappear only after a successful push.

## Where it fits

`git-task-worktree` is the single-task branch of the engineering flow. Use [implement](https://aihero.dev/skills-implement) for direct ticket work, this skill when isolation from `develop` and automatic integration matter, and [linear-develop-flow](https://aihero.dev/skills-linear-develop-flow) for tracker-backed multi-task orchestration. [ask-matt](https://aihero.dev/skills-ask-matt) routes between them.
