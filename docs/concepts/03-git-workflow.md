# Concept 3: Git Workflow

## Definition
Git workflow is a structured approach to version control that involves creating branches, making commits, and merging changes. A proper workflow enables collaboration, code review, and historical tracking.

## Implementation

### Branch Strategy

```
main (production-ready code)
  │
  ├── feature/database-schema
  │   └── PostgreSQL tables with PK/FK
  │
  ├── feature/backend-api
  │   ├── Express routes
  │   ├── Controllers, Services, Repositories
  │   └── Error handling middleware
  │
  ├── feature/frontend-routing
  │   ├── React Router setup
  │   └── All page routes
  │
  ├── feature/task-management-ui
  │   ├── Task components
  │   └── Task CRUD pages
  │
  ├── feature/concept-demos
  │   ├── Event loop demo
  │   ├── Hoisting demo
  │   └── Promise vs callback demo
  │
  └── docs/documentation
      ├── API docs
      ├── Architecture docs
      └── Viva documentation
```

### Commit Messages

```bash
# Feature commits
feat: add PostgreSQL relational schema with PK/FK
feat: add task CRUD API endpoints
feat: add React client routing with React Router
feat: add task management UI components
feat: add JavaScript concept demonstrations

# Fix commits  
fix: handle 404 responses for missing resources
fix: validate required fields in task creation

# Docs commits
docs: add API documentation
docs: add viva preparation guide
```

## Commands Used

```bash
# Create feature branch
git checkout -b feature/database-schema

# Stage changes
git add database/schema.sql
git add database/seed.sql

# Commit with message
git commit -m "feat: add PostgreSQL relational schema with PK/FK"

# Push branch
git push -u origin feature/database-schema

# Merge after review
git checkout main
git merge feature/database-schema
```

## Pull Request Template

```markdown
## Summary
Brief description of changes

## Changes
- Added users table
- Added projects table with FK to users
- Added tasks table with FK to projects and users

## Testing
- Tested database schema creation
- Verified seed data loads correctly

## Concepts Demonstrated
- PostgreSQL PK/FK relationships
- Referential integrity
- JOIN queries

## Screenshots
(if applicable)
```

## How to Demonstrate

1. **Check Git history** - `git log --oneline`
2. **View branches** - `git branch -a`
3. **Show commit structure** - `git log --graph --oneline`
4. **Check .gitignore** - Confirms secrets excluded

## Best Practices

- Use feature branches for new work
- Make focused, logical commits
- Write descriptive commit messages
- Use present tense ("add" not "added")
- Review before merging

## Viva Questions

**Q: Why use feature branches?**
A: They isolate work in progress, allow parallel development, and prevent unstable code from reaching main.

**Q: What makes a good commit?**
A: A single, focused change that can be understood independently. Each commit should represent one logical change.

**Q: What should happen before merging a PR?**
A: Code review, tests passing, and verification that it integrates properly with the main branch.