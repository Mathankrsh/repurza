# Reverting Changes and Recovering from Mistakes

## Overview
This guide helps you recover from common mistakes like accidental file deletions, unwanted changes, or when you need to go back to a stable state of your application.

## Quick Reference: Common Scenarios

### "I deleted a file accidentally"
→ See [Restoring Deleted Files](#restoring-deleted-files)

### "I made changes I don't want"
→ See [Reverting Uncommitted Changes](#reverting-uncommitted-changes)

### "I committed something wrong"
→ See [Reverting Commits](#reverting-commits)

### "I deleted node_modules"
→ See [Restoring node_modules](#restoring-nodemodules)

### "I want to go back to yesterday's state"
→ See [Going Back to a Previous State](#going-back-to-a-previous-state)

---

## Reverting Uncommitted Changes

### Check What Changed
```bash
# Navigate to project directory
cd "C:\Users\Mathan Krishna\Desktop\Ideas\tubetoblog\repurpuzai"

# See all changed files
git status

# See detailed changes in files
git diff
```

### Discard All Uncommitted Changes
```bash
# ⚠️ WARNING: This will permanently delete all uncommitted changes
# Make sure you don't need any of these changes!

# Discard changes in working directory (keeps untracked files)
git restore .

# Or use the older command (same effect)
git checkout .

# Discard changes in a specific file
git restore path/to/file.ts
# Example: git restore components/main-form.tsx
```

### Discard Changes and Remove Untracked Files
```bash
# ⚠️ WARNING: This removes ALL untracked files including new files you created!

# Remove untracked files and directories
git clean -fd

# Preview what will be removed (dry run)
git clean -fdn

# Remove untracked files but keep directories
git clean -f
```

### Reset to Last Commit (Nuclear Option)
```bash
# ⚠️ WARNING: This removes ALL uncommitted changes and untracked files!
# Use only when you're sure you want to lose everything

git reset --hard HEAD
git clean -fd
```

---

## Restoring Deleted Files

### Restore a File You Just Deleted (Not Committed)
```bash
# If you deleted a file but haven't committed the deletion
git restore path/to/deleted-file.ts

# Or restore from staging area
git restore --staged path/to/deleted-file.ts
git restore path/to/deleted-file.ts

# Restore all deleted files
git restore .
```

### Restore a File from a Previous Commit
```bash
# First, find when the file existed
git log --all --full-history -- path/to/file.ts

# Restore from a specific commit
git restore --source=HEAD~1 path/to/file.ts
# HEAD~1 = 1 commit ago, HEAD~2 = 2 commits ago, etc.

# Or restore from a specific commit hash
git restore --source=abc1234 path/to/file.ts
```

### Restore a File from Another Branch
```bash
# Restore file from main branch
git restore --source=main path/to/file.ts

# Restore file from a feature branch
git restore --source=feature/branch-name path/to/file.ts
```

---

## Reverting Commits

### Undo Last Commit (Keep Changes)
```bash
# Undo the commit but keep your changes in working directory
git reset --soft HEAD~1

# This is useful if you want to:
# - Fix the commit message
# - Add more changes to the commit
# - Reorganize commits
```

### Undo Last Commit (Discard Changes)
```bash
# ⚠️ WARNING: This permanently removes the commit and its changes!

git reset --hard HEAD~1
```

### Undo Multiple Commits
```bash
# Undo last 3 commits (keep changes)
git reset --soft HEAD~3

# Undo last 3 commits (discard changes)
git reset --hard HEAD~3
```

### Revert a Specific Commit (Safe Method)
```bash
# This creates a new commit that undoes the changes
# Safe for commits already pushed to GitHub

# Find the commit hash
git log --oneline

# Revert the commit
git revert <commit-hash>
# Example: git revert abc1234

# This creates a new commit that undoes the changes
```

---

## Restoring node_modules

### If You Deleted node_modules
```bash
# Simply reinstall dependencies
npm install

# This will restore node_modules based on package.json and package-lock.json
```

### If package.json Was Also Deleted
```bash
# First, restore package.json from git
git restore package.json
git restore package-lock.json

# Then reinstall
npm install
```

### If You Want to Start Fresh
```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall everything
npm install
```

---

## Going Back to a Previous State

### Find Previous Commits
```bash
# See commit history
git log --oneline

# See commit history with dates
git log --oneline --date=short --pretty=format:"%h %ad %s" --date=short

# See commits with file changes
git log --stat

# Search commits by message
git log --grep="search term"
```

### Go Back to a Specific Commit (Temporary)
```bash
# View the state at a specific commit (read-only)
git checkout <commit-hash>

# You'll be in "detached HEAD" state
# To go back to your branch:
git checkout main
# or
git checkout feature/your-branch
```

### Go Back to a Specific Commit (Permanent)
```bash
# ⚠️ WARNING: This rewrites history!

# Reset to a specific commit (keep changes)
git reset --soft <commit-hash>

# Reset to a specific commit (discard changes)
git reset --hard <commit-hash>
```

### Go Back to a Specific Date/Time
```bash
# Find commits from a specific date
git log --since="2024-01-15" --until="2024-01-20"

# Go back to a commit from a specific date
git log --since="2024-01-15" --until="2024-01-16" --oneline
# Then use the commit hash with git reset or git checkout
```

---

## Using Git Reflog (Recovery Tool)

### What is Reflog?
Reflog is Git's safety net. It keeps a history of ALL actions you've taken, even if you've "lost" commits.

### View Reflog
```bash
# See all recent actions
git reflog

# Output looks like:
# abc1234 HEAD@{0}: commit: latest changes
# def5678 HEAD@{1}: checkout: moving from main to feature/new-feature
# ghi9012 HEAD@{2}: commit: previous commit
```

### Recover a "Lost" Commit
```bash
# Find the commit in reflog
git reflog

# Restore to that state
git checkout HEAD@{2}
# or
git reset --hard HEAD@{2}

# Create a new branch from recovered commit
git checkout -b recovered-branch HEAD@{2}
```

### Recover After Accidental Reset
```bash
# If you did: git reset --hard HEAD~5
# And want to undo it:

# Find the commit before reset
git reflog

# Restore to that commit
git reset --hard HEAD@{1}
```

---

## Restoring Moved/Renamed Files

### If You Moved a File
```bash
# Git tracks moves if you use git mv
# To restore:
git restore --source=HEAD~1 old/path/to/file.ts

# Or restore from main branch
git restore --source=main old/path/to/file.ts
```

### If You Renamed a File
```bash
# Restore original filename
git restore --source=HEAD~1 old-filename.ts

# Or restore from a specific commit
git restore --source=<commit-hash> old-filename.ts
```

---

## Going Back to Stable State

### Method 1: Reset to Main Branch
```bash
# Switch to main branch
git checkout main

# Pull latest stable version
git pull origin main

# If you're on a feature branch and want to discard it:
git checkout main
git branch -D feature/problematic-branch
```

### Method 2: Reset to Last Known Good Commit
```bash
# Find the last good commit
git log --oneline

# Reset to that commit
git reset --hard <good-commit-hash>

# If you've already pushed, you'll need to force push (dangerous!)
# ⚠️ Only do this if you're sure and working alone
git push origin main --force
```

### Method 3: Create a New Branch from Stable Point
```bash
# Find stable commit
git log --oneline

# Create new branch from stable commit
git checkout -b fresh-start <stable-commit-hash>

# Continue working from here
```

---

## Best Practices for Beginners

### Before Making Big Changes
```bash
# Always commit or stash your current work first
git status

# If you have uncommitted changes, save them:
git add .
git commit -m "WIP: saving current state before experiment"

# Or stash them temporarily:
git stash save "backup before experiment"
```

### Create Backup Branches
```bash
# Before experimenting, create a backup branch
git checkout -b backup-before-changes

# Commit current state
git add .
git commit -m "Backup before changes"

# Go back to main and create feature branch
git checkout main
git checkout -b feature/experiment

# If something goes wrong, you can always:
git checkout backup-before-changes
```

### Regular Commits
```bash
# Commit often with small, logical changes
# This makes it easier to revert specific changes

# Good: Many small commits
git commit -m "Add input validation"
git commit -m "Fix button styling"
git commit -m "Update error messages"

# Bad: One huge commit with everything
git commit -m "Update everything"
```

### Use Stash for Temporary Saves
```bash
# Save current changes temporarily
git stash save "description of what you're saving"

# List stashes
git stash list

# Apply most recent stash
git stash apply

# Apply specific stash
git stash apply stash@{1}

# Delete stash after applying
git stash drop stash@{1}

# Apply and delete in one command
git stash pop
```

---

## Emergency Recovery Checklist

If everything seems broken, follow these steps:

1. **Check Current Status**
   ```bash
   git status
   git log --oneline -10
   ```

2. **Try to Restore from Git**
   ```bash
   git restore .
   ```

3. **Check Reflog for Recent Actions**
   ```bash
   git reflog
   ```

4. **Go Back to Main Branch**
   ```bash
   git checkout main
   git pull origin main
   ```

5. **If Main Branch is Also Broken**
   ```bash
   # Find last good commit
   git log --oneline
   git reset --hard <good-commit-hash>
   ```

6. **Restore node_modules**
   ```bash
   npm install
   ```

7. **Verify Everything Works**
   ```bash
   npm run build
   npm run dev
   ```

---

## Common Mistakes and Solutions

### Mistake: "I deleted package.json"
**Solution:**
```bash
git restore package.json
npm install
```

### Mistake: "I committed to main instead of feature branch"
**Solution:**
```bash
# Create feature branch from current state
git checkout -b feature/correct-branch

# Go back to main
git checkout main

# Remove the commit from main
git reset --hard HEAD~1

# Go back to feature branch
git checkout feature/correct-branch
```

### Mistake: "I pushed wrong changes to GitHub"
**Solution:**
```bash
# Revert the commit (safe method)
git revert <commit-hash>
git push origin main

# Or reset and force push (dangerous, only if no one else pulled)
git reset --hard HEAD~1
git push origin main --force
```

### Mistake: "I lost my work after git reset"
**Solution:**
```bash
# Check reflog
git reflog

# Find your lost commit
git checkout HEAD@{X}  # X is the reflog entry number

# Create branch from recovered commit
git checkout -b recovered-work HEAD@{X}
```

---

## Getting Help

If you're stuck:
1. Check `git status` to see current state
2. Check `git log` to see commit history
3. Check `git reflog` to see recent actions
4. Try `git restore .` to restore files
5. When in doubt, go back to main: `git checkout main && git pull origin main`

Remember: Git rarely loses data permanently. Most mistakes can be recovered using reflog or by restoring from previous commits.

