## What it does

`linear-develop-flow` runs a complete Linear delivery loop: it analyzes readiness and decomposes the work, creates isolated worktrees from the latest `origin/develop` baseline, publishes the appropriate issues, coordinates implementation, and integrates the result into `develop`.

Implementation stays in isolated task worktrees. An original checkout on another branch remains untouched. When the original checkout is on `develop`, final integration first commits only its current-task changes; unrelated changes block merging and remain preserved.

## When to reach for it

You invoke this by typing `/linear-develop-flow`, and the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own.

- Reach for it when Linear is the system of record and the work benefits from explicit blocking relationships and parallel execution.
- Use [git-task-worktree](https://aihero.dev/skills-git-task-worktree) for one coherent task that needs isolation and merge-back without this flow's Linear publication and tracking.
- Use [implement-spec](https://aihero.dev/skills-implement-spec) when you already have tickets and want an integration branch without this flow's Linear and `develop` lifecycle.

## Prerequisites

The repository must have a resolvable `origin/develop` baseline, a usable Git remote, and credentials for a Linear MCP or API integration. Missing task details stop the flow with a report instead of a follow-up question.

## The task graph

Task decomposition is an internal stage, not another skill. Read-only exploration first establishes readiness, the smallest first delivery or evidence, and a suitable execution arrangement. Missing decisions about the overall goal, scope, or acceptance are reported before creating branches, worktrees, or issues.

The issue shape follows the delivery:

- One coherent deliverable uses one execution issue, without a wrapper parent. Pre-analysis can be one sentence about readiness and the first step, with the issue's own acceptance criteria supplying completion evidence.
- Multiple independently verifiable deliverables use a parent and complete vertical children, each small enough for a fresh [context window](https://www.aihero.dev/ai-coding-dictionary/context-window). A child includes the layers, implementation, and checks its behavior needs.
- An explicit existing parent keeps its context and ownership; the flow does not create another wrapper.

Issues separate the delivery agreement from execution history. Parents describe the goal, scope and boundaries, execution pre-analysis, and overall acceptance. Execution issues describe their goal, scope and boundaries, and acceptance criteria. Parent pre-analysis allocates slice and integration evidence only where needed, and children reference relevant decisions instead of copying them. Native child lists avoid duplicate checklists.

Task-specific prerequisites and integration conditions belong in `依赖与集成`; shared writes belong in scope and boundaries. An execution issue adds its own pre-analysis only for independent exploration or a distinct execution arrangement. Routine validation stays linked to project guidance, and detailed specialized methods have their own verification section.

Exploration normally stays as the issue's first step. Independent review, an investment decision, or an input consumed by another task can justify a separate validation issue. Both forms identify a minimum method and paths for positive and negative results; a negative finding can still be useful evidence.

Before publishing, the draft must assign the first delivery, match blockers to actual inputs and phases, resolve shared-write ownership, and map every acceptance outcome to an owner and a validation method. Each execution issue owns its behavior and affected regressions; a parent owns cross-task outcomes. Early parallel work identifies a stable shared contract and its owner. An unresolved contract needs a decision or exploratory step before its consumers start. The checked breakdown is shown before publishing and proceeds without routine approval.

Native blocking relationships name the outputs a child consumes. The default blocks implementation start; an explicit phase allows earlier work:

| Dependency phase | What can proceed |
| --- | --- |
| Start | Implementation waits for the prerequisite's verified integration. |
| Joint validation | Implementation and independent checks can use a stable contract; joint validation waits for verified prerequisites. |
| Merge | Implementation and independent checks can proceed; merging waits for verified prerequisites. |

Edit conflicts affect scheduling instead: children with incompatible edits run serially, while compatible changes can run in parallel even in the same file. Wide mechanical refactors use compatible expansion, verifiable migration batches, and final removal of the old form.

## Integration boundary

Agents work in fresh task worktrees. Each execution issue with code changes gets a local commit as soon as its implementation and currently executable slice checks pass, with its Linear identifier in the commit message. Task and integration branches are not pushed. Waiting for joint validation does not delay saving the implementation, and later repairs add commits rather than rewriting recorded evidence. Evidence-only tasks record their findings without empty commits.

The flow uses non-fast-forward merges, checks each slice, validates affected interactions after integration, and satisfies overall acceptance and all project-required gates on the final candidate. Additional checks follow actual risks, such as contracts, failure paths, compatibility, or migration recovery. Passing evidence is reusable when the code version, scope, commands, and relevant inputs match; changed inputs require affected checks again. Missing or failed checks cannot count as a pass. Required gates still apply.

A prerequisite unlocks dependent phases after its merge and required passing checks are recorded. A merge still waiting for joint validation does not unlock them. Implementation committed, integration verified, and delivery complete are separate milestones. Linear tasks remain pending completion until the final `develop` push succeeds, so scheduling does not depend on prematurely closing issues.

An evidence-only prerequisite uses its reviewed result instead of a merge SHA and clears only gates that result actually satisfies. A parent's local blocker names the affected work, blocked phase, and clearing evidence; it does not stop every child.

Assignee, existing workflow states, and supported delegation fields identify ownership. Startup comments record actual worktree baselines, while milestone comments record implementation completion, verified integration, and waiting for the final push. Evidence lives in comments, CI, or an associated PR rather than growing the issue description. A PR is optional because this flow can push directly to `develop`.

When a task grows too large or new evidence changes the plan, affected transitions pause until current conclusions, issue fields, dependency phases, native relations, validation responsibilities, and the run record agree again. Remaining work can be split or recombined while retaining existing issue identifiers and completed evidence. Acceptance coverage and graph acyclicity are checked again. Descriptions hold effective conclusions; comments retain reasons for major changes. Shared-write serialization changes scheduling constraints rather than creating artificial blocking edges. Scope and acceptance changes still need authority.

## Local develop before remote synchronization

The result merges into local `develop` before the flow fetches and merges any newer `origin/develop` commits. Final validation covers the combined candidate, and pushing requires a clean target still pointing to the tested commit. A push rejected because the remote advanced permits up to two additional attempts, each after synchronization and validation. Other push failures preserve the recovery resources.

- An existing local `develop` keeps its history. Unrelated or unexplained unpushed commits block delivery.
- An original checkout on `develop` can be reused after only current-task changes are committed and the target is clean. Other original branches remain untouched.
- A `develop` checked out elsewhere is located and checked for ownership before reuse; it is never forcibly checked out twice.
- Cleanup follows a successful push and removes only this run's temporary worktrees and merged branches. Reused checkouts remain. A remote temporary branch is removed only when the record proves this run created it under separate authorization and it still points to the recorded delivered commit.

## Common questions

**Does it copy my uncommitted work into the new worktree?**

No. Task worktrees start from the recorded baseline, without copying local edits. If your original checkout is on another branch, its edits stay untouched. If it is on `develop`, the flow commits only current-task edits before final integration; unrelated remaining edits block that merge and stay preserved.

**Does finishing a child task push its branch or close the Linear issue?**

No. Finishing implementation and available slice checks saves a local commit immediately. Joint validation can still be pending. The issue closes only after verified integration and the final successful `develop` push.

**What if Linear or the final push is unavailable?**

The flow pauses affected operations and preserves its worktrees, branches, commits, and run record. A remote-advance rejection allows two synchronization-and-validation retries; an unresolved push failure leaves issues pending completion and prevents cleanup. During a Linear outage, local work can be preserved, but transitions requiring the authoritative graph or a Linear mutation wait for access to return.

**Does one failed check stop every task?**

No. The executor repairs a local implementation or check failure and reruns affected validation. Shared faults pause the tasks and dependency phases they affect. Conflicts pause the shared merge boundary while independent implementation can continue. Missing authority or unresolved scope and contract decisions are reported without expanding the assignment.

**Does it run the whole repository test suite?**

It follows the repository's required gates. Routine methods reference actual project guidance; specialized checks state the necessary method, environment, and data. Broader checks run when required, without adding unrelated suites or repeating a check already covered by another command on the same version and scope.

**Will a small change become a long list of layer-by-layer tickets?**

No. A simple change uses one execution issue with a brief pre-analysis and no unnecessary parent. Fragments that share one acceptance outcome and cannot be verified separately stay together; the split follows deliverable behavior rather than technical layers. It still follows the same isolation, integration, checks, and final push lifecycle.

## It's working if

- Startup comments identify the actual worktree starting SHAs.
- A simple change has one execution issue; larger work has a parent and independently verifiable children.
- The first delivery has an owning task, and exploratory validation names both follow-up paths.
- Every acceptance outcome has an owner and a validation method; a parent covers cross-task outcomes.
- Each execution issue has its own worktree and branch, and early parallel work names its stable contract, contract owner, shared-write ownership, and the later phase it must wait for.
- Each issue with code changes records a local implementation commit without a task-branch push, even when joint validation must wait.
- Dependencies unlock after verified integration, while Linear tasks close only after the successful `develop` push.
- Milestone comments link implementation, integration, and validation evidence without requiring a PR.
- Local failures are repaired without stopping independent work, and final acceptance includes every required gate.
- Reassessment updates actual execution conditions before affected work resumes, not just the prose describing them.
- Local `develop` receives the task merge before newer remote commits are merged, and the pushed SHA has final acceptance evidence.
- Temporary resources created by the run disappear only after a successful `develop` push; reused checkouts and unrelated work remain.

## Where it fits

`linear-develop-flow` is the Linear-backed orchestration step for one execution issue or a graph of independently verifiable tasks, using the vertical-slice approach of [to-tickets](https://aihero.dev/skills-to-tickets) within its own delivery lifecycle. It can replace the task-graph execution part of [implement-spec](https://aihero.dev/skills-implement-spec); use [code-review](https://aihero.dev/skills-code-review) separately when a review is needed. [ask-matt](https://aihero.dev/skills-ask-matt) routes to it when task tracking, worktrees, and `develop` integration must be handled together.
