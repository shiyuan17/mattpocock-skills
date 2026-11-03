## What it does

`git-split-push` turns a mixed working tree into a sequence of coherent commits and pushes each commit to the current branch's configured upstream. It keeps implementation, tests, and required fixtures together so every batch has a useful boundary.

It does not rewrite existing history or force-push. The defining constraint is that ambiguous grouping, failed checks, or an unsafe remote state stops the run with completed commits left intact.

## When to reach for it

You invoke this by typing `/git-split-push`, and the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own.

- Reach for it after a session that left several independent changes in one working tree.
- Use `implement` for building one ticket, and use `code-review` when the main need is review rather than commit organization.

## Prerequisites

The current checkout must be on a named branch with a configured upstream that accepts ordinary pushes. The skill does not clean or stash a dirty tree.

## Cohesive batches

The skill looks for vertical batches rather than file-shaped batches. An implementation stays with the behavior it enables, its tests, and the fixtures needed to validate it. Independent documentation or configuration can stand alone only when it does not make an earlier batch incomplete.

## Common questions

**Will it rewrite commits I already pushed?**

No. It only stages and commits the current working tree changes, then performs ordinary pushes.

**What happens when one batch fails?**

The run stops. Completed commits remain in place, and the report names the remaining paths and the command needed to inspect or continue.

## It's working if

- Each commit describes one behavior or intent instead of a directory.
- Tests and implementation for a behavior land in the same batch.
- Every successful batch has a recorded commit hash and push result.
- A failed hook, test, conflict, or unsafe remote state leaves the repository recoverable without a reset.

## Where it fits

`git-split-push` is a standalone shipping and cleanup step after implementation or review. Use [implement](https://aihero.dev/skills-implement) to build a ticket, then this skill when the resulting working tree needs commit boundaries. [ask-matt](https://aihero.dev/skills-ask-matt) routes to it when the problem is commit organization rather than implementation.
