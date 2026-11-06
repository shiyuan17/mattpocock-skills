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

Issues separate the delivery agreement from execution history. Parents describe the goal, scope and boundaries, and overall acceptance. Children describe their goal, scope and boundaries, and acceptance criteria, with specialized verification or dependency notes only when needed. Requirements and decisions stay linked from the parent; children point to the relevant passages. Native child lists and blocking links avoid duplicate checklists.

Each child owns its observable behavior and affected regressions. The parent owns outcomes that only become testable across integrated children. The proposed breakdown is shown before publishing and proceeds without routine approval. Missing critical scope or acceptance decisions stop the flow with a report.

Native blocking relationships name the outputs a child consumes. The default blocks implementation start; an explicit phase allows earlier work:

| Dependency phase | What can proceed |
| --- | --- |
| Start | Implementation waits for the prerequisite's verified integration. |
| Joint validation | Implementation and independent checks can use a stable contract; joint validation waits for verified prerequisites. |
| Merge | Implementation and independent checks can proceed; merging waits for verified prerequisites. |

Edit conflicts affect scheduling instead: children with incompatible edits run serially, while compatible changes can run in parallel even in the same file. Wide mechanical refactors use compatible expansion, verifiable migration batches, and final removal of the old form.

## Integration boundary

Agents work in fresh task worktrees and report commits back to the integration branch. The flow uses non-fast-forward merges, checks each slice, validates affected interactions after integration, and satisfies overall acceptance and all project-required gates on the final candidate. Passing evidence is reusable when the code version, scope, commands, and relevant inputs match; changed inputs require affected checks again. Required gates still apply.

A prerequisite unlocks dependent phases after its merge and required passing checks are recorded. A merge still waiting for joint validation does not unlock them. Linear tasks remain pending completion until the final `develop` push succeeds, so scheduling does not depend on prematurely closing issues. Temporary local and remote branches are deleted only after that push.

Assignee, existing workflow states, and supported delegation fields identify ownership. Startup comments record actual worktree baselines, while milestone comments record implementation completion, verified integration, and waiting for the final push. Evidence lives in comments, CI, or an associated PR rather than growing the issue description. A PR is optional because this flow can push directly to `develop`.

## Common questions

**Does it copy my uncommitted work into the new worktree?**

No. It leaves the original checkout unchanged, and a dirty original worktree does not block the flow.

**What if Linear or the final push is unavailable?**

The flow pauses affected operations and preserves its worktrees, branches, commits, and run record. A failed push leaves issues pending completion and prevents cleanup. During a Linear outage, local work can be preserved, but transitions requiring the authoritative graph or a Linear mutation wait for access to return.

**Does one failed check stop every task?**

No. The executor repairs a local implementation or check failure and reruns affected validation. Shared faults pause the tasks and dependency phases they affect. Conflicts pause the shared merge boundary while independent implementation can continue. Missing authority or unresolved scope and contract decisions are reported without expanding the assignment.

**Does it run the whole repository test suite?**

It follows the repository's required gates. Routine methods reference actual project guidance; specialized checks state the necessary method, environment, and data. Broader checks run when required, without adding unrelated suites or repeating a check already covered by another command on the same version and scope.

**Will a small change become a long list of layer-by-layer tickets?**

No. A single child can own the entire change. Fragments that share one acceptance outcome and cannot be verified separately stay together; the split follows deliverable behavior rather than technical layers.

## It's working if

- Startup comments identify the actual worktree starting SHAs.
- Linear contains concise parent and child issues, native relationships, and specific outputs for real dependencies.
- Each child has an observable result and acceptance criteria; the parent covers cross-task outcomes.
- Each child has its own worktree and branch, and early parallel work names its stable input and the later phase it must wait for.
- Dependencies unlock after verified integration, while Linear tasks close only after the successful `develop` push.
- Milestone comments link implementation, integration, and validation evidence without requiring a PR.
- Local failures are repaired without stopping independent work, and final acceptance includes every required gate.
- Temporary local and remote branches disappear only after a successful `develop` push.

## Where it fits

`linear-develop-flow` is the Linear-backed orchestration step for independently verifiable child tasks, using the vertical-slice approach of [to-tickets](https://aihero.dev/skills-to-tickets) within its own delivery lifecycle. It can replace the task-graph execution part of [implement-spec](https://aihero.dev/skills-implement-spec); use [code-review](https://aihero.dev/skills-code-review) separately when a review is needed. [ask-matt](https://aihero.dev/skills-ask-matt) routes to it when task tracking, worktrees, and `develop` integration must be handled together.
