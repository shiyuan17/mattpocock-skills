## What it does

`linear-develop-flow` runs a complete Linear delivery loop: it analyzes readiness and decomposes the work, creates a delivery worktree from the latest `origin/develop` baseline, publishes the appropriate issues, coordinates implementation, and integrates the result into `develop`.

By default, one executor implements the issues serially in the same delivery worktree and branch, with a separate commit and acceptance evidence for each issue. Worktree count follows isolation needs rather than issue count. An original checkout on another branch remains untouched. When the original checkout is on `develop`, final integration first commits only its current-task changes; unrelated changes block merging and remain preserved.

## When to reach for it

You invoke this by typing `/linear-develop-flow`, and the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own.

- Reach for it when Linear is the system of record and the work needs tracked acceptance, explicit dependency phases, and delivery into `develop`.
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

Issues separate the delivery agreement from execution history. Parents describe the goal, scope and boundaries, execution pre-analysis, and overall acceptance. Execution issues describe their goal, scope and boundaries, and acceptance criteria. Each criterion names a prerequisite state, action or trigger, and observable result, with a locatable validation method or existing test. Parent pre-analysis allocates slice and integration evidence only where needed, and children reference relevant decisions instead of copying them. Native child lists avoid duplicate checklists.

Task-specific prerequisites and integration conditions belong in `依赖与集成`; shared writes belong in scope and boundaries. An execution issue adds its own pre-analysis only for independent exploration or a distinct execution arrangement. Routine validation stays linked to project guidance, and detailed specialized methods have their own verification section.

Exploration normally stays as the issue's first step. Independent review, an investment decision, or an input consumed by another task can justify a separate validation issue. Both forms identify a minimum method and paths for positive and negative results; a negative finding can still be useful evidence.

Before publishing, the draft must assign the first delivery, match blockers to actual inputs and phases, resolve shared-write ownership, and map every acceptance outcome to an owner and a validation method. Each execution issue owns its behavior and affected regressions; a parent owns cross-task outcomes. Early parallel work identifies a stable shared contract and its owner. An unresolved contract needs a decision or exploratory step before its consumers start. The checked breakdown is shown before publishing and proceeds without routine approval.

Native blocking relationships name the outputs a child consumes. The default blocks implementation start; an explicit phase allows earlier work:

| Dependency phase | What can proceed |
| --- | --- |
| Start | Implementation waits for the prerequisite's verified integration. |
| Joint validation | Implementation and independent checks can use a stable contract; joint validation waits for verified prerequisites. |
| Merge | The shared delivery branch waits before implementation. An authorized isolated group can implement early, but merging waits for verified prerequisites. |

Serial execution favors prerequisites before consumers. Parallel implementation requires authorization, available tools, stable contracts, and compatible write ownership. An independent execution group can handle several issues in its own worktree and branch, based on the current delivery tip. Edit conflicts affect scheduling without creating artificial dependencies. Wide mechanical refactors use compatible expansion, verifiable migration batches, and final removal of the old form.

## Integration boundary

Issues share the delivery worktree by default, with one writer at a time. Each issue with code changes gets a local commit as soon as its implementation and currently executable slice checks pass, with its Linear identifier in the commit message. Serial issues commit directly to the delivery branch; isolated groups merge into it with non-fast-forward merges once every included issue's merge gates are satisfied. Delivery and group branches are not pushed. Later repairs add commits rather than rewriting recorded evidence. Evidence-only tasks record their findings without empty commits or mandatory dedicated worktrees.

Each executor checks its slice; the coordinator owns cross-issue integration and final acceptance unless another executor is named for a deferred check. Waiting for joint validation does not delay a passing implementation commit. The handoff records pending checks, who runs them, their trigger, and required evidence. A clean worktree can take the next independent issue, recording its actual baseline without inheriting a previous issue's passing status.

Validation covers each slice, affected interactions across commits or merges, and overall acceptance plus all project-required gates on the final candidate. Behavioral evidence distinguishes the baseline from the target; lint and typechecks alone do not prove it. Mock checks cannot replace required real joint validation. Additional checks follow actual risks, such as contracts, failure paths, compatibility, or migration recovery. Pending, missing, unavailable, or failed checks cannot count as a pass.

Evidence links each acceptance outcome to the actual tested contents, scope, commands, relevant inputs, and results. Pre-commit evidence identifies the base and complete tested changes, then links to the resulting commit only if its contents match. An unchanged tested state needs no repeat merely to acquire a commit SHA. Later issues that alter relevant code, configuration, dependencies, or contracts require affected acceptance checks again, including earlier issues, with updated evidence pointers. Required final gates still apply.

A prerequisite unlocks dependent phases once its result is on the delivery branch and required passing checks are recorded. Same-branch issues use their implementation commits; isolated groups record their merge and issue commits. Before gated checks, a consumer's actual tested revision must contain its required prerequisites. An outdated group merges the needed delivery baseline and reruns affected checks without resetting or rebasing recorded history. A committed or merged issue still waiting for required joint validation stays unverified. Implementation committed, integration verified, and delivery complete are separate milestones. Linear tasks remain pending completion until the final `develop` push succeeds.

An evidence-only prerequisite uses its reviewed result instead of a merge SHA and clears only gates that result actually satisfies. A parent's local blocker names the affected work, blocked phase, and clearing evidence; it does not stop every child.

Assignee, existing workflow states, and supported delegation fields identify ownership. Startup comments record actual worktree baselines and each issue's assigned worktree and starting branch SHA, while milestone comments record implementation completion, verified integration, and waiting for the final push. Evidence lives in comments, CI, or an associated PR rather than growing the issue description. A PR is optional because this flow can push directly to `develop`.

When a task grows too large or new evidence changes the plan, affected transitions pause until current conclusions, issue fields, dependency phases, native relations, validation responsibilities, and the run record agree again. Remaining work can be split or recombined while retaining existing issue identifiers and completed evidence. Acceptance coverage and graph acyclicity are checked again. Descriptions hold effective conclusions; comments retain reasons for major changes. Shared-write serialization changes scheduling constraints rather than creating artificial blocking edges. Scope and acceptance changes still need authority.

## Local develop before remote synchronization

The result merges into local `develop` before the flow fetches and merges any newer `origin/develop` commits. Final validation covers the combined candidate, and pushing requires a clean target still pointing to the tested commit. A push rejected because the remote advanced permits up to two additional attempts, each after synchronization and validation. Other push failures preserve the recovery resources.

- An existing local `develop` keeps its history. Unrelated or unexplained unpushed commits block delivery.
- An original checkout on `develop` can be reused after only current-task changes are committed and the target is clean. Other original branches remain untouched.
- A `develop` checked out elsewhere is located and checked for ownership before reuse; it is never forcibly checked out twice.
- Cleanup follows a successful push and removes only this run's temporary worktrees and merged branches. Reused checkouts remain. A remote temporary branch is removed only when the record proves this run created it under separate authorization and it still points to the recorded delivered commit.

## Common questions

**Does it copy my uncommitted work into the new worktree?**

No. The delivery worktree starts from the recorded baseline, without copying local edits. If your original checkout is on another branch, its edits stay untouched. If it is on `develop`, the flow commits only current-task edits before final integration; unrelated remaining edits block that merge and stay preserved.

**Does each child issue create another worktree?**

No. One or many issues use the same delivery worktree by default. Additional worktrees serve authorized independent execution groups, each of which can handle several issues. Final integration may also need a temporary `develop` worktree. Existing runs keep their recorded branches, worktrees, and evidence rather than automatically consolidating them.

**How does another executor take over the shared worktree?**

The current executor saves the issue's changes after available checks pass and confirms the worktree is clean. The next executor reads the issue, linked context, run record, actual branch SHA, and pending checks before taking the sole writer role. A new agent starts with a fresh context window and reuses the assigned worktree. Failed checks with unsaved changes keep that worktree occupied until repaired.

**Can an issue be committed while joint validation is pending?**

Yes. Finishing implementation and available slice checks saves a local commit immediately, with pending checks, their executor, trigger, and evidence recorded. This does not mark acceptance as passed, release gates requiring that evidence, push a branch, or close the issue. The issue closes only after verified integration and the final successful `develop` push.

**What if Linear or the final push is unavailable?**

The flow pauses affected operations and preserves its worktrees, branches, commits, and run record. A remote-advance rejection allows two synchronization-and-validation retries; an unresolved push failure leaves issues pending completion and prevents cleanup. During a Linear outage, local work can be preserved, but transitions requiring the authoritative graph or a Linear mutation wait for access to return.

**Does one failed check stop every task?**

No. The executor repairs a local implementation or check failure and reruns affected validation. Unsaved changes occupy that worktree, so another issue cannot start there; independent work can continue in other authorized worktrees or after a clean handoff. Shared faults pause the tasks and dependency phases they affect. Conflicts pause the shared merge boundary while independent implementation can continue elsewhere. Missing authority or unresolved scope and contract decisions are reported without expanding the assignment.

**Does it run the whole repository test suite?**

It follows the repository's required gates. Routine methods reference actual project guidance; specialized checks state the necessary method, environment, and data. Broader checks run when required, without adding unrelated suites or repeating a check already covered by another command on the same version and scope.

**Will a small change become a long list of layer-by-layer tickets?**

No. A simple change uses one execution issue with a brief pre-analysis and no unnecessary parent. Fragments that share one acceptance outcome and cannot be verified separately stay together; the split follows deliverable behavior rather than technical layers. It still follows the same isolation, integration, checks, and final push lifecycle.

## It's working if

- Startup comments identify worktree baselines and each issue's assigned worktree and starting branch SHA.
- A simple change has one execution issue; larger work has a parent and independently verifiable children.
- The first delivery has an owning task, and exploratory validation names both follow-up paths.
- Every acceptance outcome points to a validation method and actual evidence; a parent covers cross-task outcomes.
- Multiple serial issues share one delivery worktree with one writer; extra worktrees correspond to authorized independent groups rather than issue count.
- Each issue with code changes records its own local implementation commit without a branch push, even when joint validation must wait.
- Handoffs name pending checks, their executor, and the condition for running them; failed checks never appear as acceptance passes.
- Dependencies unlock after verified results enter the delivery branch, and consumer checks contain required prerequisite commits; Linear tasks close only after the successful `develop` push.
- Changes affecting earlier acceptance have refreshed evidence before final delivery.
- Milestone comments link implementation, integration, and validation evidence without requiring a PR.
- Local failures are repaired without stopping independent work, and final acceptance includes every required gate.
- Reassessment updates actual execution conditions before affected work resumes, not just the prose describing them.
- Local `develop` receives the task merge before newer remote commits are merged, and the pushed SHA has final acceptance evidence.
- Temporary resources created by the run disappear only after a successful `develop` push; reused checkouts and unrelated work remain.

## Where it fits

`linear-develop-flow` is the Linear-backed orchestration step for one execution issue or a graph of independently verifiable tasks, using the vertical-slice approach of [to-tickets](https://aihero.dev/skills-to-tickets) within its own delivery lifecycle. It can replace the task-graph execution part of [implement-spec](https://aihero.dev/skills-implement-spec); use [code-review](https://aihero.dev/skills-code-review) separately when a review is needed. [ask-matt](https://aihero.dev/skills-ask-matt) routes to it when task tracking, worktrees, and `develop` integration must be handled together.
