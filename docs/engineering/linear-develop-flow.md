## What it does

`linear-develop-flow` runs a complete task-graph delivery loop: it creates an isolated worktree from the latest `origin/develop` baseline, publishes a parent and child task graph in Linear, coordinates implementation work across task worktrees, and integrates the result into `develop`.

The original checkout is never used as an implementation area. Dirty working-tree changes are left untouched and do not block the flow.

## When to reach for it

You invoke this by typing `/linear-develop-flow`, and the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own.

- Reach for it when Linear is the system of record and the work benefits from explicit blocking relationships and parallel execution.
- Use [git-task-worktree](https://aihero.dev/skills-git-task-worktree) for one coherent task whose implementation steps can stay in a single task worktree and branch.
- Use [implement-spec](https://aihero.dev/skills-implement-spec) when you already have tickets and want an integration branch without this flow's Linear and `develop` lifecycle.

## Prerequisites

The repository must have a resolvable `origin/develop` baseline, a usable Git remote, and credentials for a Linear MCP or API integration. Missing task details stop the flow with a report instead of a follow-up question.

## The task graph

The flow creates one parent task and complete vertical child tasks, each small enough for a fresh [context window](https://www.aihero.dev/ai-coding-dictionary/context-window). A child delivers an observable behavior through the layers it needs, with its implementation and checks together. One child is enough for small work; there is no target task count.

Every child owns acceptance evidence and names the outputs it needs from its prerequisites. The proposed breakdown is shown before publishing and proceeds without routine approval. Missing critical scope or acceptance decisions stop the flow with a report.

Native blocking relationships express real dependencies. Edit conflicts affect scheduling instead: children with incompatible edits run serially, while compatible changes can run in parallel even in the same file. Wide mechanical refactors use compatible expansion, verifiable migration batches, and final removal of the old form.

## Integration boundary

Agents work in fresh task worktrees and report commits back to the integration branch. The flow uses non-fast-forward merges without unrelated integration-wide validation. It only deletes local and remote temporary branches after the final `develop` push succeeds.

A prerequisite unlocks its dependents after its merge into the integration branch and passing focused checks are recorded. Linear tasks remain pending completion until the final `develop` push succeeds, so scheduling does not depend on prematurely closing issues.

## Common questions

**Does it copy my uncommitted work into the new worktree?**

No. It leaves the original checkout unchanged, and a dirty original worktree does not block the flow.

**What if Linear or the final push is unavailable?**

The flow stops before the affected mutation and preserves its worktrees, branches, commits, and run record for recovery.

**Does it run the whole repository test suite?**

No. It runs only checks directly tied to the completed Linear tasks, not unrelated repository-wide validation.

**Will a small change become a long list of layer-by-layer tickets?**

No. A single child can own the entire change. Fragments that share one acceptance outcome and cannot be verified separately stay together; the split follows deliverable behavior rather than technical layers.

## It's working if

- The run reports the selected baseline SHA before creating the integration worktree.
- Linear contains one parent, complete child tasks, and native blocking edges.
- Each child has an observable result and acceptance evidence it can satisfy after its own prerequisites land.
- Only ready children are dispatched, and each child has its own worktree and branch.
- Dependencies unlock after verified integration, while Linear tasks close only after the successful `develop` push.
- Focused checks pass for each relevant task and, when needed, before the `develop` push.
- Temporary local and remote branches disappear only after a successful `develop` push.

## Where it fits

`linear-develop-flow` is the Linear-backed orchestration step for independently verifiable child tasks, using the vertical-slice approach of [to-tickets](https://aihero.dev/skills-to-tickets) within its own delivery lifecycle. It can replace the task-graph execution part of [implement-spec](https://aihero.dev/skills-implement-spec); use [code-review](https://aihero.dev/skills-code-review) separately when a review is needed. [ask-matt](https://aihero.dev/skills-ask-matt) routes to it when task tracking, worktrees, and `develop` integration must be handled together.
