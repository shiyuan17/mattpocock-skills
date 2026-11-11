---
name: linear-develop-flow
description: Publish a Linear task graph, implement its issues serially in one delivery worktree by default, and merge the verified result into develop.
disable-model-invocation: true
---

# Linear Develop Flow

Run a complete task-graph development flow from the latest `develop` baseline. This skill is user-invoked because it creates external Linear issues, worktrees, branches, merges, pushes, and deletes branches.

Implementation stays in one delivery worktree and branch by default, with a separate commit and acceptance evidence for each execution issue. An original checkout on another branch remains untouched. If the original checkout is on `develop`, final integration may use it after committing only current-task changes under the target preparation rules below.

## Resolve the request

Use the current conversation unless the user supplies a spec, issue, local file, or URL. Read the complete referenced request, including relevant issue comments. Extract the requested behaviors, acceptance criteria, constraints, and out-of-scope work. If the source is unavailable or a critical scope or acceptance decision is missing, stop before creating resources and report the blocking detail without asking follow-up questions.

## Preflight and baseline

1. Fetch remote refs without changing the checked-out branch.
2. Confirm that the latest `origin/develop` resolves to a commit and record that initial baseline SHA. If it does not, stop and report the blocking detail without asking follow-up questions.
3. Resolve repository context and default checks from actual project guidance and harness/tool configuration. Keep `origin/develop` as this flow's default baseline; do not invent a new configuration layer or repeat defaults on every issue.

## Task decomposition

Before creating branches, worktrees, or Linear issues, explore the relevant implementation and repository guidance read-only, using the fetched baseline to distinguish it from local changes. Use the project's domain vocabulary and existing validation commands. Form an execution pre-analysis first, then choose the task shape, decomposition, and execution arrangement.

### Pre-analyze and choose the task shape

- For one coherent deliverable, use one execution issue without a wrapper parent. A sentence stating readiness and the first step is enough; reuse the issue's acceptance criteria for completion evidence.
- For multiple independently verifiable deliverables, use a parent and execution children. Record the overall pre-analysis on the parent; children only carry relevant differences.
- When an explicit parent already exists, retain its context and ownership rather than creating another wrapper. Reuse the intended execution issue when one already exists.

The readiness judgment is one of: ready to implement, validate a named hypothesis first, or resolve a named decision first. Identify the smallest first delivery or evidence, the execution arrangement, and any applicable compatibility, migration, recovery, or reassessment conditions. Separate slice evidence from integration evidence only when that responsibility needs allocation.

Exploratory validation normally stays as the current issue's first step. Give it a separate issue when its result needs independent review, determines whether to invest further, or becomes an input to other tasks. In either form, name the hypothesis, minimum validation method, and the paths after a positive and a negative result. A disproved hypothesis can be a valid finding; it is not automatically an implementation failure or permission to change scope or close issues early.

Do not interpret the parent's overall judgment as a blanket gate. For a local blocker, name the affected work, whether it blocks start, joint validation, or merge, and the evidence that clears it. If the overall goal, scope, or acceptance remains unclear, report the missing decision before creating resources.

Default to one executor working serially in dependency order in the delivery worktree. Use independent execution groups only when parallel implementation is authorized, tools are available, and stable contracts and write ownership permit it. A group can handle multiple issues; issue count does not determine worktree count. Mention reusable tools only when useful. The arrangement does not grant delegation or other authority beyond the request and environment.

### Draft deliverable slices

- Split by the smallest complete, observable behavior, not by database, API, UI, or test layer. A slice crosses only the layers its behavior actually needs and owns its implementation, tests, fixtures, and required configuration.
- Size each execution issue for one fresh context window with a focused acceptance check. Do not target a task count or split small work merely to create parallelism. Merge fragments that share an acceptance outcome and cannot be verified separately.
- Separate prerequisite refactoring only when it is necessary to enable the requested change. For a wide mechanical refactor, expand with a compatible form, migrate callers in verifiable batches, then contract after all migrations. Each batch must keep its focused checks passing.
- Add a blocking edge only when a task consumes a specific result from another task. Name that result and the phase it blocks, using the dependency rules below. Record edit conflicts separately as scheduling constraints: inspect overlapping edit regions and shared interfaces, rather than serializing everything that touches the same file.

A task must be verifiable once its own prerequisites are ready, without waiting for downstream work. Distinguish the existing behavior from the target and retain affected regression constraints. A parent, when present, owns outcomes that can only be verified across integrated children.

### Check the draft before creating issues

- Every requested behavior has an acceptance owner, with no duplicate outcomes; all prerequisites are represented and the graph is acyclic.
- The first delivery has an owning task. Hypothesis validation names the minimum method and both follow-up paths.
- Every blocker names its actual input, blocked phase, and clearing evidence; the execution arrangement agrees with those phases.
- Parallel tasks have explicit write ownership for shared files or contracts, with no unresolved edit conflict. Early work names the stable contract and its owner; settle an unresolved contract through a decision or exploratory step before dispatching its consumers.
- Every acceptance outcome maps to an execution issue or overall acceptance and a locatable validation method. Execution issues cover their own behavior and regressions; cross-task outcomes have an integration validation owner.
- A single-deliverable draft has no unnecessary parent. Split oversized tasks and combine fragments that cannot be accepted separately.

Repair a draft that fails these checks before publishing. Show the pre-analysis and proposed task shape, outcomes, blocking reasons, and scheduling constraints, then continue without routine approval. If a critical scope or acceptance decision remains unresolved, report it before creating resources rather than inventing requirements.

## Write focused Linear issues

Use `<计划简称>｜<整体结果>` for a parent or standalone execution issue, and `<计划简称>-<稳定序号>｜<单一交付结果>` for children. Reuse an existing plan shorthand or derive a short domain name from the goal. Keep sequence numbers stable after creation.

Use this structure for a parent, removing inapplicable optional entries:

```markdown
## 目标
[整体业务结果]

## 范围与边界
- 覆盖：[核心角色、场景与交付边界]
- 来源：[需求、计划或关键决策链接]
- 共同约束：[仅在存在共享约束时填写]

## 执行预分析
- 开工判断：[整体判断及依据；局部阻塞明确受影响工作、阶段和解阻证据]
- 首个交付：[最小闭环，或优先取得的验证证据]
- 执行安排：[单 Agent、局部协作或并行实现，以及必要的工具复用]
- 完成证据：[仅在需要划分本票、子任务和集成验证责任时填写]
- 特殊条件：[适用的兼容、迁移、恢复或重判条件]

## 整体验收
- [ ] [合并后才能验证的完整流程或跨任务结果]
```

Use these three required sections for a standalone execution issue or child:

```markdown
## 目标
[本票交付的行为、变更或决策结果]

## 范围与边界
- 负责：[本票拥有的行为与交付边界]
- 参考：[相关计划段落或契约，按需填写]

## 验收标准
- [ ] [给定角色与前置状态，执行操作或触发事件后，可观察的通过条件]
- [ ] [受影响的异常路径或回归约束，按需填写]
```

- Keep requirements, implementation plans, and key decisions on the parent when present; children link to the specific relevant passages. A standalone issue carries its own source references. Include enough accessible context to take over an execution issue without the original conversation.
- Put exclusions in `范围与边界` only when they prevent likely mistakes or competing ownership. Remove unused optional bullets; do not publish placeholders or empty headings.
- A simple standalone issue can put its one-sentence pre-analysis in `范围与边界` without adding a heading or repeating acceptance evidence.
- Place task-specific information according to the table below. Do not copy the parent's pre-analysis into every child.

| Information | Location |
| --- | --- |
| Start prerequisites, dependency phases, integration conditions, and clearing evidence | `依赖与集成`, when applicable |
| Shared files, contracts, and write ownership | `范围与边界` |
| Passing conditions and affected regression constraints | `验收标准` |
| Independent exploratory validation or a distinct execution arrangement | Add `执行预分析` only when needed |

- Map each acceptance outcome to a locatable validation method or existing test; a project default is enough only when it proves that outcome. Add `验证` for specialized checks or when no applicable default exists. Keep detailed methods there and reference them from pre-analysis instead of duplicating commands or logs. Add contract or migration/rollback sections only when the work needs them.
- Use Linear's native child list and relations. Do not maintain a second child checklist in the parent. Record shared boundaries and unusual integration order when they affect decisions.
- Keep routine repository and branch defaults out of individual issues; write exceptions explicitly. Do not add a fixed responsibility/progress section or append execution logs to the description.

## Define dependency phases

Use native `Blocked by` relations for actual dependencies, and identify the consumed contract, change/PR, or data, blocked phase, and clearing evidence in `依赖与集成`. An unspecified phase blocks implementation start.

| Phase | Gate and permitted work |
| --- | --- |
| 开工 (start, default) | Start only after the prerequisite is integrated and verified. |
| 联调 (joint validation) | Implement and run independent checks against the named stable contract first. Wait for the prerequisite to be integrated and verified before completing joint validation or reporting verified integration. |
| 合并 (merge) | In an authorized isolated execution group, implement and run independent checks first, but wait for verified prerequisites before merging. On the shared delivery branch, wait for this gate before implementation starts. |

For a non-default phase, state which prerequisite it applies to, the stable input that permits early work, and exactly what can proceed. Prefer completing prerequisites before their consumers in the default serial arrangement. A direct commit on the shared branch must not bypass a merge gate. Read phases together with the native graph; a pending Linear completion state does not itself block a phase.

A prerequisite is integrated and verified only when its result is present in the delivery branch and all checks required at that phase are recorded as passing. Record the implementation commit for a same-branch issue, or the group merge SHA and issue commits for an isolated group. A committed or merged issue awaiting required joint validation remains unverified and cannot release dependent gates.

Before a consumer's gated checks run, confirm that its actual tested revision contains the required prerequisite commits. For an outdated group worktree, merge the required delivery baseline into its branch and rerun affected validation before claiming a pass. Do not reset or rebase recorded history to synchronize it.

For an evidence-only prerequisite, record the reviewed finding or decision and its evidence instead of inventing a commit. Clear only the gates whose stated evidence is satisfied. A valid negative finding does not clear a gate that requires a positive result; follow its planned negative path and reassess affected work.

## Plan validation and evidence

Acceptance says what must be true; validation says how to prove it. Each acceptance outcome must identify the prerequisite state, action or trigger, observable result, and a locatable method that proves it. Reference a project rule or existing test rather than duplicating routine commands on every issue. A bare "use Harness" is insufficient. For specialized checks or missing defaults, specify the method, command and working directory where applicable, relevant environment/data, and required evidence. Use explicit manual evidence when no automated check applies. For new or changed behavior, evidence must distinguish the baseline from the target; lint and typechecks alone do not prove behavioral acceptance.

Before publishing, resolve the referenced defaults and confirm that commands and scope options exist. Check tools, dependencies, credential availability, account roles, service ports, and allowed origins before implementation depends on that environment; record availability without secret values. Name affected acceptance and recovery conditions for unavailable environments and continue independent work. Identify any new tests or fixtures as execution-issue deliverables. Separate validation into:

- **Slice:** the executor checks the issue's behavior and affected regressions, with an explicit baseline or path scope.
- **Integration:** the coordinator checks affected behavior, shared interfaces, and interactions across issue commits or group merges on the delivery branch.
- **Final acceptance:** the coordinator checks the combined result and all project-required gates on the final candidate before pushing `develop`.

When required validation must wait, name the pending checks, their executor, the condition for running them, and expected evidence in the handoff comment and run record. The coordinator owns deferred integration checks unless a different executor is named.

Choose additional validation from actual risks: shared-interface contracts, failure paths, state consistency, compatibility, or migration and recovery where applicable. Do not impose every category on every task. Pending, failed, unavailable, or missing evidence is not a passing result. Mock checks prove only their stated scope and cannot stand in for required real joint validation.

Resolve command inclusion relationships from project scripts before choosing the smallest combination covering acceptance and required gates. A gate or command name is not proof of coverage: never assume a name such as `standard`, `test`, or `full` means the whole repository. Classify direct, affected, aggregate, and complete-final checks from the actual definitions. Do not schedule a focused command, a changed check, and a broader wrapper redundantly when the wrapper already provides the same evidence. Use a supported supplementary check with matching prior evidence when appropriate, without treating that check alone as complete acceptance. Use repository-supported slice/range options when suitable; do not hard-code one repository's tooling into this flow.

Before a long check, inspect its input paths, included and excluded files, expansion reasons, command, arguments, and working directory using supported previews or command/scope output. Keep temporary artifacts outside automatic discovery where supported, preserving genuine source changes and unknown-path safeguards. A preview is not passing evidence.

Exercise the first complete behavior in its required real environment early. Run formatting, lint, affected tests, and contract consistency checks before expensive broad suites; synchronize generated artifacts and affected contract assertions first. For required browser acceptance, stabilize identities, fixtures, and individual interactions before the complete multi-account journey. Use run-specific data identifiers and wait for actual transaction responses before final-state assertions.

Record the acceptance outcomes covered, tested content identity, scope, commands, working directory, relevant environment/data inputs, results, and log/artifact references in PRs, CI, or Linear comments, with matching pointers in the run record. For a clean candidate, record the Git tree. For pre-commit checks, record the base SHA, `headTree`, and a digest of every included input, including new files. Associate evidence with the resulting commit only after confirming its contents match the tested state; do not label tests of uncommitted changes with the old `HEAD` alone. An unchanged tested state does not need another run merely because the commit now has a SHA.

Reuse passing evidence only when the tested content identity, scope, commands, and relevant inputs match. A merge that produces a different commit SHA but the same tested tree does not require repeating exact evidence; any changed tree or relevant input requires affected checks to run again. Later issues that change relevant code, configuration, dependencies, or contracts invalidate affected evidence, including earlier issues' acceptance. Rerun affected checks and update their current evidence pointers. Explicit project-required gates and phase requirements take precedence over reuse; never skip them or add unrelated broad checks by default.

## Initialize the delivery worktree

Only after the pre-analysis and draft checks pass, create `codex/linear-flow/<slug>` and one delivery worktree from the latest fetched `origin/develop`. It is both the default implementation environment and the integration baseline for one or many execution issues. Do not create an additional task worktree for each issue. Confirm the draft against that worktree before publishing.

Record the actual starting SHA when creating each worktree. Keep a run record outside the repository containing these SHAs, worktree paths, branch names, Linear identifiers once available, issue-to-worktree assignments, dependency phases, and scheduling constraints. Add traceability in Linear startup comments once the issues exist. Specify a version in advance only when reproduction, migration rehearsal, or fixed-version delivery requires it; make any departure from the default baseline explicit.

Keep the current issue/step, tested tree or dirty-input identity, passed and pending checks, complete log locations, live process/session identifiers, and services started by this run current in the run record. Update the checkpoint after each large execution slice. Apply this default to new runs. After context compaction or resumption, reconcile the record with the checkout and running checks before continuing; reuse valid findings instead of repeating full exploration. Resume an existing run using its recorded branches, worktrees, and evidence; do not automatically move changes or consolidate its resources.

## Publish the Linear task graph

Use the available Linear MCP or API integration. Do not silently fall back to local Markdown.

1. Resolve the Linear team, project, workflow states, and credentials at runtime. If access, configuration, or permissions are missing, stop before creating anything.
2. Resolve any explicitly supplied parent or execution issue and search for intended issues before creating duplicates. Stop on an ambiguous match.
3. For one deliverable, create or reuse one execution issue. For multiple deliverables, create or reuse the parent and create the missing children in dependency order. Keep an existing explicit parent without adding another wrapper. Use the templates and validation rules above.
4. Create native parent-child relationships only where a parent exists, and native blocking relationships only for real dependencies. Map the draft tasks to returned Linear identifiers in the run record, including dependency phases and scheduling constraints.
5. Preserve existing Assignees; use real, authorized owners when known. Set Delegate only for a valid Linear agent identity supported by the team. Record local agent identifiers in execution comments instead of inventing Linear identities. Do not create workflow states.
6. Add startup comments with the actual worktree baseline and branch context; record each execution issue's identity, assigned worktree, and current branch SHA when it starts. Move an execution issue to the active state only when its work starts.
7. Distinguish implementation committed (or evidence recorded), integration verified, and delivery complete. Update comments at the first two milestones and when waiting for the final push, including available commit/merge SHAs, evidence links, blockers, and the next step. Keep the run record consistent. Link a PR when one exists; direct delivery uses commits, CI, or issue comments and does not require a PR. Leave Linear completion states pending until the final `develop` push succeeds.

## Dispatch and implement

Treat the Linear blocking graph together with the recorded dependency phases as the source of truth. Dispatch when all start dependencies are integrated and verified; enforce joint-validation and merge gates at their respective phases:

- Treat a standalone execution issue as the only execution node; a parent container is not required. Default to one executor handling ready issues serially in dependency order in the delivery worktree.
- Allow only one writer in any worktree at a time. Start every dispatched agent with a fresh context window, but hand it the existing assigned worktree, issue and linked context, run record, and current branch SHA. A fresh context or executor change does not require a fresh worktree.
- Create isolated execution groups only for authorized parallel work with available tools, compatible edits, and explicit write ownership. Each group gets a branch and worktree based on the current delivery tip and can process multiple issues serially. Apply scheduling constraints to conflicting edits without adding artificial Linear blocking edges. Evidence-only work uses the environment its method requires, without a mandatory dedicated worktree.
- Each executor reads the issue and linked context, explores the codebase, and runs its currently executable slice checks. Once implementation and those checks pass, immediately commit only that issue's changes on the assigned branch, with the Linear identifier in the commit message. Default serial issues commit directly to the delivery branch without a per-issue merge. Report the commit SHA, changed paths, check scope, results, and evidence before handing off or starting another issue.
- Before an executor handoff or another issue starts in that worktree, save the current issue's changes under these commit rules and confirm the working tree is clean. Failed checks with unsaved changes keep that worktree occupied; repair within scope rather than mixing in another issue. Never discard changes to make it available.
- Waiting for joint validation does not delay saving a passing implementation commit, but does not release any dependency gate. Record pending checks and their responsibility as defined above. Independent ready issues may continue from the recorded actual baseline once the worktree is clean; sharing a branch does not inherit another issue's passing status. Evidence-only tasks record their finding without an empty commit. Later repairs use additional commits; do not amend or rewrite commits already cited as evidence.
- Do not push delivery or group branches. An execution agent must not merge to `develop`, push any branch, delete branches, or modify another executor's worktree. Only the coordinator performs final integration and the `develop` push.
- For an isolated group, synchronize required prerequisites before gated checks and merge into the delivery branch with a non-fast-forward merge only when every included issue's merge gates are satisfied. In both arrangements, apply the validation plan across issue commits and group merges. Keep each issue unverified until all its required checks, including deferred joint validation, pass. Record the issue commits, group merge when applicable, and evidence; update Linear comments and release only satisfied dependency phases.

## Reassess and synchronize execution conditions

Reassess affected work when an issue outgrows one focused context window, a hypothesis is disproved, a contract changes, migration rehearsal fails, or a shared resource becomes unavailable. Pause affected dispatch or phase transitions first. Split or recombine remaining work as needed, preserving existing issue identifiers and completed commit/evidence history and linking replacement work. Update the currently effective pre-analysis, execution arrangement, affected issue fields, dependency phases, native relations, validation responsibilities, and run record before resuming. Recheck acceptance coverage and graph acyclicity after a split. Do not leave the description saying "serial" while scheduling still permits parallel work.

Keep current conclusions in the description and record the reasons and evidence for major changes in comments. Real consumed-output dependencies update native blocking relations; shared-write serialization updates scheduling constraints and ownership, without creating artificial business dependencies. Scope or acceptance changes still require authority. If the authorized update cannot be completed, preserve the proposed change and keep affected transitions paused.

## Recover within the affected boundary

Preserve worktrees, branches, commits, and the run record on failure. Record the failing version, command, scope, diagnostics, complete log or report location, failure category, attempted repairs, and the condition for resuming in evidence and Linear comments when available. Keep business assertion failures, command compatibility problems, tool or dependency faults, and missing environments distinct. For a tool or dependency fault, do not restart a long check until the environment or command path has new evidence that the fault is resolved.

| Failure | Recovery boundary |
| --- | --- |
| Local implementation, check, or command compatibility failure | The current executor diagnoses, repairs within scope, and verifies the failed check first, then selects reruns from the impact and project requirements. Record the reason for each whole-suite rerun instead of automatically restarting every command. Unsaved changes keep that worktree occupied; independent ready work can continue in other authorized worktrees, or after a clean handoff. |
| Shared environment or service failure | Pause affected tasks and dependency phases. Continue work that does not require the failed resource. |
| Merge conflict | Freeze merges at the affected shared integration boundary and preserve the conflict state. Resolve only when intent is clear and within scope, then validate. Independent implementation can continue. |
| Linear graph and run record disagree | Pause affected dispatch and phase transitions. Read the actual relations and notes, reconcile the record, and resume only after consistency is restored. Do not invent or change scope/dependencies without authority. |
| Missing permission, critical requirement/contract decision, or an unsafe conflict | Report the exact blocker and required decision. Stop affected work rather than expanding authority; stop the whole flow only when the boundary genuinely affects it all. |

When a check exceeds its historical duration, inspect process activity, log progress, and resource contention. Continue a normally progressing check; elapsed time alone is not failure or permission to lower gates. Do not impose a universal timeout or start concurrent checks that contend for the same build directory.

Do not repeat the same failed attempt without new evidence or a plausible repair. Whole-suite reruns need a reason such as changed relevant contents, invalidated evidence, or a required final gate. When no safe in-scope repair remains, report the blocker, preserve recovery information, and continue independent work. When Linear is unavailable, preserve updates locally and pause transitions that require an authoritative graph or Linear mutation until access returns. Recovering from failure never lowers acceptance gates.

## Review and integrate

After every execution issue's result is present on the delivery branch and all its required validation, including joint validation and any affected earlier acceptance, has passed (tasks without code changes supply their planned evidence):

### Prepare local develop

- Inspect `git worktree list --porcelain`. Reuse the original checkout when it is on `develop`; otherwise attach an unoccupied local `develop` in a temporary target worktree. If another worktree holds it, inspect that checkout and reuse it only when its ownership and use for this run are established. Never force a second checkout or change the original checkout's other branch.
- Keep an existing local `develop` at its current tip. If absent, create it from the recorded initial baseline SHA, not a newly fetched tip. Record the target path, starting SHA, and whether this run created the worktree.
- In an original checkout on `develop`, inspect staged, unstaged, and untracked changes before committing only changes attributable to the current task. Stage explicit paths or hunks, inspect the staged diff, and validate those changes. Never use a blanket add or include unrelated staged changes. If unrelated changes remain, stop before merging and preserve them; do not stash, reset, clean, or discard them to make room. Other reused target worktrees must already be clean.
- Review `git log origin/develop..develop` against the run record and initial baseline. Confirm those local-only commits belong to the authorized delivery; unknown or unrelated unpushed commits block integration. Record any pre-merge task commit and include its behavior in final validation.

### Merge locally, synchronize, validate, and push

1. In the clean local `develop` worktree, merge `codex/linear-flow/<slug>` with `git merge --no-ff`. Record the delivery merge SHA. Do not first merge remote updates into the delivery branch.
2. Only after that local merge, fetch `origin` and resolve `origin/develop`. Check `git merge-base --is-ancestor origin/develop develop`: exit 0 means no remote commits need merging, exit 1 requires a normal `git merge --no-edit origin/develop` in the target worktree, and any other error stops the operation. Use explicit fetch and merge rather than a pull that might rebase. Never rebase or force-push.
3. Revalidate affected behavior after remote merges, conflict resolutions, or repairs. Satisfy the parent's overall acceptance, or the standalone issue's acceptance when no parent exists, and all final project-required gates on the resulting candidate. Apply the evidence reuse rules; record the tested SHA, results, and waiting-for-push milestone in Linear comments and the run record. Failed or pending checks block pushing.
4. Confirm the target is clean and local `develop` still equals the tested SHA; unexpected local changes pause delivery. Push explicitly with `git push origin develop:develop`, without force. A rejection caused by new remote commits returns to step 2, including validation of the new candidate. Allow at most two additional push attempts (three total). Permission, network, branch-policy, fetch, or unsafe conflict failures are not race retries. On those failures or exhausted retries, preserve all recovery resources and leave Linear completion pending.

## Cleanup and completion

Only after the `develop` push succeeds:

- mark the execution issues complete, then any parent whose full acceptance is satisfied; in standalone mode complete only that issue, and do not close an existing broader parent with unrelated unfinished work;
- remove only delivery, group, and temporary target worktrees created by this run; for resumed legacy runs, include their recorded task/integration worktrees, but never a reused or original checkout;
- delete only this run's merged local delivery/group branches, or recorded task/integration branches in a resumed legacy run;
- temporary branches are not pushed by this flow; delete a remote counterpart only if the run record proves this run created it under separate authorization and it still points to the recorded delivered commit, otherwise leave it untouched;
- retain the original user branch, `develop`, and the recovery record.

Report the selected baseline, execution issue identifiers and parent when present, execution order, per-issue commits or findings, group and delivery merges when applicable, validation evidence, final `develop` SHA, and cleanup result. If cleanup or Linear updates fail after the code is safely pushed, report the exact remaining resources and continue with no destructive retry.
