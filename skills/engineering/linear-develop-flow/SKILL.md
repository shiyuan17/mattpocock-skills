---
name: linear-develop-flow
description: Create a baseline worktree, publish a Linear task graph, implement it with parallel or serial agents, and merge the result into develop.
disable-model-invocation: true
---

# Linear Develop Flow

Run a complete task-graph development flow from the latest `develop` baseline. This skill is user-invoked because it creates external Linear issues, worktrees, branches, merges, pushes, and deletes branches.

The original working tree is never modified or used as an implementation worktree. Its uncommitted changes remain untouched.

## Resolve the request

Use the current conversation unless the user supplies a spec, issue, local file, or URL. Read the complete referenced request, including relevant issue comments. Extract the requested behaviors, acceptance criteria, constraints, and out-of-scope work. If the source is unavailable or a critical scope or acceptance decision is missing, stop before creating resources and report the blocking detail without asking follow-up questions.

## Preflight and baseline

1. Fetch remote refs without changing the checked-out branch.
2. Confirm that the latest `origin/develop` resolves to a commit. If it does not, stop and report the blocking detail without asking follow-up questions.
3. Resolve repository context and default checks from actual project guidance and harness/tool configuration. Keep `origin/develop` as this flow's default baseline; do not invent a new configuration layer or repeat defaults on every issue.
4. Create an integration branch named `codex/linear-flow/<slug>` and an integration worktree from the latest `origin/develop`. Record the actual starting SHA when creating each worktree. Keep a run record outside the repository containing these SHAs, worktree paths, branch names, and Linear identifiers. Add traceability in Linear startup comments once the issues exist. Specify a version in advance only when reproduction, migration rehearsal, or fixed-version delivery requires it; make any departure from the default baseline explicit.

## Decompose into deliverable slices

Explore the relevant implementation and repository guidance in the integration worktree before drafting children. Use the project's domain vocabulary and existing validation commands.

- Split by the smallest complete, observable behavior, not by database, API, UI, or test layer. A slice crosses only the layers its behavior actually needs and owns its implementation, tests, fixtures, and required configuration.
- Size each child for one fresh context window with a focused acceptance check. Do not target a task count or split small work merely to create parallelism: one child is valid. Merge fragments that share an acceptance outcome and cannot be verified separately.
- Separate prerequisite refactoring only when it is necessary to enable the requested change. For a wide mechanical refactor, expand with a compatible form, migrate callers in verifiable batches, then contract after all migrations. Each batch must keep its focused checks passing.
- Add a blocking edge only when a child consumes a specific result from another child. Name that result and the phase it blocks, using the dependency rules below. Record edit conflicts separately in the run record: inspect overlapping edit regions and shared interfaces, rather than serializing everything that touches the same file.

Before publishing, check that every requested behavior has an acceptance owner, no outcome is duplicated, all prerequisites are included, and the graph is acyclic. A child must be verifiable once its own prerequisites have landed, without waiting for downstream work. Distinguish the existing behavior from the target and retain affected regression constraints. The parent owns outcomes that can only be verified across integrated children. Split oversized children and combine fragments that fail this check.

Show the proposed children, their outcomes, blocking reasons, and any scheduling constraints, then continue without routine approval. If a critical scope or acceptance decision remains unresolved, stop and report it rather than inventing requirements.

## Write focused Linear issues

Use `<计划简称>｜<整体结果>` for the parent and `<计划简称>-<稳定序号>｜<单一交付结果>` for children. Reuse an existing plan shorthand or derive a short domain name from the goal. Keep sequence numbers stable after creation.

Use these three required sections for the parent:

```markdown
## 目标
[整体业务结果]

## 范围与边界
- 覆盖：[核心角色、场景与交付边界]
- 来源：[需求、计划或关键决策链接]
- 共同约束：[仅在存在共享约束时填写]

## 整体验收
- [ ] [合并后才能验证的完整流程或跨任务结果]
```

Use these three required sections for each child:

```markdown
## 目标
[本票交付的行为、变更或决策结果]

## 范围与边界
- 负责：[本票拥有的行为与交付边界]
- 参考：[相关计划段落或契约，按需填写]

## 验收标准
- [ ] [给定角色与前置状态下，可观察的通过条件]
- [ ] [受影响的异常路径或回归约束，按需填写]
```

- Keep requirements, implementation plans, and key decisions on the parent; children link to the specific relevant passages. Include enough accessible context to take over the child without the original conversation.
- Put exclusions in `范围与边界` only when they prevent likely mistakes or competing ownership. Remove unused optional bullets; do not publish placeholders or empty headings.
- Add `验证` for specialized checks or when no applicable default exists. Add `依赖说明` for non-default dependency phases. Add contract or migration/rollback sections only when the work needs them.
- Use Linear's native child list and relations. Do not maintain a second child checklist in the parent. Record shared boundaries and unusual integration order when they affect decisions.
- Keep routine repository and branch defaults out of individual issues; write exceptions explicitly. Do not add a fixed responsibility/progress section or append execution logs to the description.

## Define dependency phases

Use native `Blocked by` relations for actual dependencies, and identify the consumed contract, change/PR, or data in the child's scope or dependency notes. An unspecified phase blocks implementation start.

| Phase | Gate and permitted work |
| --- | --- |
| 开工 (start, default) | Start only after the prerequisite is integrated and verified. |
| 联调 (joint validation) | Implement and run independent checks against the named stable contract first. Wait for the prerequisite to be integrated and verified before completing joint validation or reporting verified integration. |
| 合并 (merge) | Implement and run independent checks first. Merge only after the prerequisite is integrated and verified. |

For a non-default phase, state which prerequisite it applies to, the stable input that permits early work, and exactly what can proceed. Read phases together with the native graph; a pending Linear completion state does not itself block a phase. A prerequisite is integrated and verified only after its merge SHA and all checks required at that phase are recorded as passing. A merge awaiting joint validation cannot release dependent gates.

## Plan validation and evidence

Acceptance says what must be true; validation says how to prove it. Reference a locatable project rule for routine checks rather than duplicating commands on every issue. A bare "use Harness" is insufficient. For specialized checks or missing defaults, specify the method, command and working directory where applicable, relevant environment/data, and required evidence. Use explicit manual evidence when no automated check applies.

Before publishing, resolve the referenced defaults and confirm that commands and scope options exist. Identify any new tests or fixtures as child deliverables. Separate validation into:

- **Slice:** the child's behavior and affected regressions, with an explicit baseline or path scope.
- **Integration:** affected behavior, shared interfaces, and interactions after merges.
- **Final acceptance:** the combined result and all project-required gates on the final candidate before pushing `develop`.

Inspect command inclusion relationships before choosing checks. Do not schedule a focused command, a changed check, and a broader wrapper redundantly when the wrapper already provides the same evidence. Use repository-supported slice/range options when suitable; do not hard-code one repository's tooling into this flow.

Record the tested commit SHA, scope, commands, relevant environment/data inputs, results, and log/artifact references in PRs, CI, or Linear comments, with matching pointers in the run record. Reuse passing evidence only when the tested code version, scope, commands, and relevant inputs match. Changes to code, configuration, dependencies, or contracts invalidate affected evidence. Explicit project-required gates and phase requirements take precedence over reuse; never skip them or add unrelated broad checks by default.

## Publish the Linear task graph

Use the available Linear MCP or API integration. Do not silently fall back to local Markdown.

1. Resolve the Linear team, project, workflow states, and credentials at runtime. If access, configuration, or permissions are missing, stop before creating anything.
2. Search for an existing parent task with the intended title. Stop on an ambiguous match rather than creating duplicates.
3. Create one parent and the drafted children in dependency order using the templates and validation rules above.
4. Create native parent-child and blocking relationships. Map the draft children to returned Linear identifiers in the run record, including their dependency phases and scheduling constraints.
5. Preserve existing Assignees; use real, authorized owners when known. Set Delegate only for a valid Linear agent identity supported by the team. Record local agent identifiers in execution comments instead of inventing Linear identities. Do not create workflow states.
6. Add startup comments with the actual baseline and branch context; add each child's execution identity and worktree starting SHA when it starts. Move a child to the active state only when implementation starts.
7. Update comments at implementation completion, verified integration, and waiting for the final push, including available commit/merge SHAs, evidence links, blockers, and the next step. Keep the run record consistent. Link a PR when one exists; direct delivery uses commits, CI, or issue comments and does not require a PR. Leave Linear completion states pending until the final `develop` push succeeds.

## Dispatch and implement

Treat the Linear blocking graph together with the recorded dependency phases as the source of truth. Dispatch when all start dependencies are integrated and verified; enforce joint-validation and merge gates at their respective phases:

- Start every agent with a fresh context window and a task-specific worktree and branch based on the current integration tip.
- Run independent ready children in parallel when their edits and shared interfaces are compatible. Apply the scheduling constraints in the run record to conflicting edits without adding artificial Linear blocking edges.
- Each agent reads the child and linked context, explores the codebase, runs the checks required by that child and project guidance, and reports its commit, changed paths, check scope, results, and evidence.
- An agent must not merge to `develop`, push the final branch, delete branches, or modify another agent's worktree.
- When implementation finishes and merge gates are satisfied, merge its branch into the integration branch with a non-fast-forward merge. Apply the validation plan to the merged result. Joint validation may wait for its prerequisites, but keep the child unverified until all its required checks pass. Record the merge and evidence, update Linear comments, and release newly unblocked phases.

## Recover within the affected boundary

Preserve worktrees, branches, commits, and the run record on failure. Record the failing version, command, scope, diagnostics, attempted repairs, and the condition for resuming in evidence and Linear comments when available.

| Failure | Recovery boundary |
| --- | --- |
| Local implementation, check, or command compatibility failure | The current executor diagnoses, repairs within scope, and reruns affected checks. Continue independent ready work. |
| Shared environment or service failure | Pause affected tasks and dependency phases. Continue work that does not require the failed resource. |
| Merge conflict | Freeze merges at the affected shared integration boundary and preserve the conflict state. Resolve only when intent is clear and within scope, then validate. Independent implementation can continue. |
| Linear graph and run record disagree | Pause affected dispatch and phase transitions. Read the actual relations and notes, reconcile the record, and resume only after consistency is restored. Do not invent or change scope/dependencies without authority. |
| Missing permission, critical requirement/contract decision, or an unsafe conflict | Report the exact blocker and required decision. Stop affected work rather than expanding authority; stop the whole flow only when the boundary genuinely affects it all. |

Do not repeat the same failed attempt without new evidence or a plausible repair. When no safe in-scope repair remains, report the blocker, preserve recovery information, and continue independent work. When Linear is unavailable, preserve updates locally and pause transitions that require an authoritative graph or Linear mutation until access returns. Recovering from failure never lowers acceptance gates.

## Review and integrate

After every child has merged into the integration branch and all its required validation, including joint validation, has passed:

1. Fetch again. If `origin/develop` advanced, merge its latest tip into the integration branch with a normal merge, never a rebase. Handle conflicts using the recovery rules and revalidate affected evidence.
2. Check out or attach the target `develop` worktree from the latest fetched `origin/develop` baseline, then merge the integration branch with a non-fast-forward merge.
3. Satisfy the parent's overall acceptance and all final project-required gates on this final candidate, using the evidence reuse rules. Record the results and waiting-for-push milestone in Linear comments and the run record.
4. Push `develop` without force. If the push fails, do not clean up anything.

## Cleanup and completion

Only after the `develop` push succeeds:

- mark the child tasks complete, then mark the parent task complete in Linear;
- remove every task worktree and the integration worktree;
- delete every local task and integration branch;
- delete the corresponding remote temporary branches;
- retain the original user branch and `develop`.

Report the selected baseline, Linear parent and child identifiers, execution order, merged commits, validation evidence, final `develop` SHA, and cleanup result. If cleanup or Linear updates fail after the code is safely pushed, report the exact remaining resources and continue with no destructive retry.
