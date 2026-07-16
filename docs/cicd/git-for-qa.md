# Git basics for QA

Automation is code, and code lives in Git. But for a QA, Git is more than "pushing my tests": it's an **investigation** tool — knowing what changed in a release to focus the testing, or finding the exact commit that broke something.

## The mental model

Git moves changes between four places:

```
working directory → staging → local repository → remote (GitHub, Bitbucket…)
     (you edit)    (git add)    (git commit)        (git push)
```

Understanding this flow prevents 90 % of the confusion. The rest is commands.

## The day-to-day commands

| I want to… | Command |
|---|---|
| Get a repo | `git clone <url>` |
| See where I stand | `git status` |
| Stage my changes | `git add <file>` (or `git add -p` to review hunk by hunk) |
| Save them with a message | `git commit -m "..."` |
| Push them | `git push` |
| Bring the latest | `git pull` |
| Create a branch and jump to it | `git switch -c my-branch` |
| Change branches | `git switch other-branch` |
| See the history | `git log --oneline` |

The normal team flow: **one branch per task + pull request**. Never directly on `main` — not even for "a tiny change".

## Git as an investigation tool

This is where Git gives a QA superpowers:

- **`git log` and `git diff` between versions** — exactly what changed in this release. It's the basis of risk-based testing: test hardest what was touched most.
- **`git blame <file>`** — who touched each line and when. Not to point fingers: to know who to ask and which task introduced the change.
- **`git bisect`** — the crown jewel. If a bug "didn't happen before", bisect runs a **binary search across commits**: you mark one good and one bad, Git proposes midpoints, and in a few steps you have the exact commit that introduced it. It turns "I don't know since when it fails" into a procedure.
- **Going back to a previous version** (`git checkout <tag>`) — reproducing how the product behaved in version N-1 without asking anyone.

## Hygiene for test code

- **Small, frequent commits**, with messages that state the *why* ("stabilize login wait" says more than "fix").
- **`.gitignore` for artifacts**: screenshots, videos, reports and `node_modules` don't get committed. Only code and configuration.
- **Never credentials in the repo.** Test access data goes in environment variables or the secrets manager, never hardcoded — Git history doesn't forget.
- **Branch up to date before the PR**: integrate `main` into your branch and run the suite before requesting review.

## Common mistakes

- **Working on `main`** and finding out when pushing.
- **Giant commits** ("misc changes") that make precise review or revert impossible.
- **`git push --force` on shared branches** — it rewrites history others already have. If you need it on your own branch, `--force-with-lease` at least checks you're not stomping on someone's work.
- **Resolving conflicts without reading them**, accepting "all mine" or "all theirs". A badly resolved conflict is a silent bug.

::: tip Key idea
For a QA, Git isn't just where the tests live: it's the product's forensic record. `git diff` tells you where to look and `git bisect` tells you since when — two questions a tester asks every day.
:::

## References

- [Pro Git](https://git-scm.com/book/en/v2) — the official book, free.
- [Learn Git Branching](https://learngitbranching.js.org/) — interactive branch practice, visual and very good.
