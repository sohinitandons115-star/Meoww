# Concept 3: Hexa Git Workflow, Branch Strategy & Pull Request Evidence

## Definition
A disciplined Git workflow guarantees codebase stability, enables parallel feature development across branches, enforces peer code reviews, and provides an auditable version history for production deployments.

---

## Primary Repository Evidence

- **Repository**: [`hardikkaurani/Hexa`](file:///c:/Users/hardi/Hexa)
- **Primary Production Branch**: `main`
- **Active Feature Branch**: `feature/viva-hardening`
- **PR Template File**: [`.github/pull_request_template.md`](file:///c:/Users/hardi/Hexa/.github/pull_request_template.md)

---

## Branching & Feature Workflow Architecture

```text
Issue / Feature Task
        │
        ▼
Create Feature Branch (git checkout -b feature/viva-hardening)
        │
        ▼
Atomic Commits (git commit -m "feat(...): ...")
        │
        ▼
Local Build & Test Verification (npm run build && npm test)
        │
        ▼
Push Branch to Remote (git push origin feature/viva-hardening)
        │
        ▼
Create Pull Request (Utilizing .github/pull_request_template.md)
        │
        ▼
Peer Code Review & Rebase / Merge into main
```

---

## Real Hexa Git Branch Evidence

```bash
* main (Production stable branch)
  remotes/origin/main
  remotes/origin/pr/concepts-implementation
* feature/viva-hardening (Feature branch for viva hardening)
```

---

## Viva Reviewer Questions & Answers

**Q: Which branch did you use for developing feature improvements?**  
**A**: We developed features on `feature/viva-hardening` before testing, building, and merging back into the primary production branch `main`.

**Q: Why do you use feature branches instead of committing directly to main?**  
**A**: Feature branches isolate incomplete code changes from production, enabling independent testing, peer code reviews via Pull Requests, and preventing broken builds on `main`.

**Q: How do you resolve branch divergence and merge conflicts?**  
**A**: When `main` advances while a feature branch is active, we fetch `main` (`git fetch origin`) and rebase or merge `main` into our feature branch (`git merge main`), resolving conflicting lines manually before running verification tests.

**Q: What does a clean working tree mean?**  
**A**: A clean working tree (`git status` returning "nothing to commit, working tree clean") means all local modifications and new files have been staged and committed, leaving no untracked or modified files behind.