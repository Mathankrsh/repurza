# Git Deployment Workflow Command

## Overview
This command automates the deployment workflow for repurpuzai.com, ensuring safe feature development without affecting the live production app on the main branch.

## Workflow Steps

When triggered, follow these steps in order:

### Step 1: Prepare Local Environment
```bash
# Navigate to project directory
cd "C:\Users\Mathan Krishna\Desktop\Ideas\tubetoblog\repurpuzai"

# Check current branch and status
git status
git branch

# Pull latest changes from main branch to ensure we're up to date
git checkout main
git pull origin main
```

### Step 2: Create Feature Branch
```bash
# Ask user for feature/bugfix name or generate descriptive branch name
# Format: feature/description or fix/description
# Example: feature/add-dark-mode or fix/email-validation-bug

# Create and switch to new branch
git checkout -b feature/[feature-name]

# Confirm branch creation
git branch
```

**Note**: Always use descriptive branch names that indicate the purpose (feature/, fix/, refactor/, etc.)

### Step 3: Development Phase
- Make code changes as needed
- Test locally using `npm run dev`
- Ensure all changes work correctly
- Run linting: `npm run lint`
- Format code: `npm run format`

### Step 4: Commit Changes
```bash
# Check what files have changed
git status

# Review changes before committing
git diff

# Stage all changes
git add .

# Create descriptive commit message following conventional commits format
# Format: type(scope): description
# Examples:
#   feat(editor): add markdown export functionality
#   fix(auth): resolve email verification timeout issue
#   refactor(ai): optimize prompt generation logic

git commit -m "feat: Brief description of changes

- Detailed bullet points
- What was changed and why
- Impact on users/functionality"
```

### Step 5: Push Branch and Create Vercel Preview
```bash
# Push feature branch to GitHub
git push origin feature/[feature-name]

# Vercel will automatically create a preview deployment
# The preview URL will be available in:
# 1. GitHub PR (if PR is created)
# 2. Vercel dashboard
# 3. Terminal output after push
```

**Important**: After pushing, wait for Vercel to create the preview deployment. The preview URL typically follows the pattern: `https://[branch-name]-[project-name].vercel.app`

### Step 6: Test Preview Deployment
- Open the Vercel preview URL
- Test all functionality that was changed
- Verify the preview matches local testing
- Check for any environment-specific issues
- Ensure database migrations (if any) work correctly

**Wait for user confirmation** that preview testing is complete before proceeding.

### Step 7: Create Pull Request (Optional but Recommended)
```bash
# Create PR using GitHub CLI or guide user to create via GitHub web interface
# PR title should match commit message
# PR description should include:
# - What was changed
# - Why it was changed
# - How to test
# - Screenshots if UI changes
```

### Step 8: Merge to Main
**Only proceed after user confirms preview testing is successful.**

```bash
# Switch back to main branch
git checkout main

# Pull any latest changes (in case of concurrent updates)
git pull origin main

# Merge feature branch into main
git merge feature/[feature-name]

# Push merged changes to trigger production deployment
git push origin main
```

**Note**: Vercel will automatically deploy the main branch to production (repurpuzai.com)

### Step 9: Clean Up and Sync Local
```bash
# Delete local feature branch (optional, but keeps workspace clean)
git branch -d feature/[feature-name]

# Delete remote feature branch (optional)
git push origin --delete feature/[feature-name]

# Pull latest changes to ensure local main is in sync
git pull origin main

# Verify we're on main and up to date
git status
git log --oneline -5
```

## Important Rules

1. **Never commit directly to main branch** - Always use feature branches
2. **Always pull latest main** before creating new branch
3. **Test locally first** before pushing
4. **Wait for Vercel preview** and test thoroughly before merging
5. **Use descriptive commit messages** following conventional commits
6. **Verify production deployment** after merging to main
7. **Keep main branch stable** - it's the live production branch

## Error Handling

If any step fails:
- **Merge conflicts**: Resolve conflicts manually, then continue
- **Push failures**: Check network connection and GitHub access
- **Vercel preview fails**: Check Vercel dashboard for build errors
- **Production deployment fails**: Check Vercel logs and rollback if necessary

## Quick Reference Commands

```bash
# Start new feature
git checkout main && git pull origin main && git checkout -b feature/[name]

# After making changes
git add . && git commit -m "feat: description" && git push origin feature/[name]

# After preview testing
git checkout main && git pull origin main && git merge feature/[name] && git push origin main

# Clean up
git branch -d feature/[name] && git pull origin main
```

## Environment Variables

Ensure these are set in Vercel:
- `DATABASE_URL`
- `GEMINI_API_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_APP_URL`
- `EMAIL_SENDER_NAME`
- `EMAIL_SENDER_ADDRESS`

## Notes

- The main branch is **production** - handle with care
- Vercel automatically deploys main branch to repurpuzai.com
- Preview deployments are created automatically for feature branches
- Always test in preview before merging to main
- Keep commit messages clear and descriptive for future reference

