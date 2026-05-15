---
description: Safely merge a feature branch to main with preflight checks
allowed-tools: Read, Glob, Bash(git status:*), Bash(git branch:*), Bash(git switch:*), Bash(git merge:*), Bash(git push:*), Bash(git log:*)
---

You are helping the user safely merge a completed feature branch into main. Always adhere to any rules or requirements set out in any CLAUDE.md files when responding.

## High level behavior

Your job is to:

1. Detect the current feature branch name
2. Run preflight checks to catch anything forgotten
3. Walk the user through each merge step, confirming before proceeding
4. Clean up the branch after a successful merge

---

## Step 1. Detect the current branch

Run `git branch --show-current` to get the current branch name. Store this as `feature_branch`.

If the current branch is already `main`, stop and tell the user: "You're already on main. Switch to your feature branch first."

Show the user:
```
Current branch: <feature_branch>
```

---

## Step 2. Preflight checks

Run each of the following checks and report results before doing anything else.

**2a. Uncommitted changes**
Run `git status --short`. If there are any uncommitted, unstaged, or untracked files, stop and tell the user to commit or stash changes before merging. DO NOT PROCEED.

**2b. Spec file check**
Look in the `specs/` directory for any `.md` file whose name matches or closely relates to the feature branch name (strip the `claude/feature/` prefix to get the slug). If a matching spec file exists, check whether it contains any unchecked items (lines starting with `- [ ]`). If unchecked items exist, warn the user:
> "Your spec file has unchecked items. Have you completed everything? Reply 'yes' to continue or 'no' to go back."
Wait for confirmation before proceeding.

If no spec file is found, skip this check silently.

**2c. Plan file check**
Look in the `specs/` or root directory for any plan file related to this feature (e.g. `plan-<slug>.md` or similar). If found, check for unchecked items the same way as above.

**2d. Unpushed commits**
Run `git log origin/main..HEAD --oneline`. If there are unpushed commits on the feature branch, warn the user:
> "You have unpushed commits on this branch. It's good practice to push before merging. Want me to push first? Reply 'yes' or 'skip'."

---

## Step 3. Summary before merging

Before touching git, print a clear summary:

```
Ready to merge:

  Feature branch : <feature_branch>
  Merging into   : main
  Steps ahead    :
    1. git switch main
    2. git merge <feature_branch>
    3. git push origin main
    4. git branch -d <feature_branch>

Proceed? Reply 'yes' to continue.
```

Wait for the user to confirm.

---

## Step 4. Execute the merge

Run each command in order. After each one, print the output and confirm it succeeded before moving to the next.

```bash
git switch main
git merge <feature_branch>
git push origin main
git branch -d <feature_branch>
```

If any command fails, stop immediately and show the error. Do not run subsequent steps.

---

## Step 5. Final output

After all steps succeed, respond with:

```
Done! Here's what happened:

  Merged  : <feature_branch> -> main
  Pushed  : main is up to date on GitHub
  Cleaned : <feature_branch> deleted locally

Your feature is live on main.
```

If the spec or plan file had unchecked items that the user chose to ignore, remind them at the end:
> "Reminder: your spec file still has unchecked items. Consider updating it to reflect what shipped."