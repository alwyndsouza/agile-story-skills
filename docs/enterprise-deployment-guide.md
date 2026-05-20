# Enterprise Deployment Guide

## 1. Prerequisites

- GitHub Copilot plan: **Business** or **Enterprise**.
- VS Code with agent skills enabled:

```json
{
  "chat.useAgentSkills": true
}
```

## 2. Deployment Patterns

### A) Project-scoped deployment
Copy this skill into a target repository so every contributor gets the same behavior.

```bash
mkdir -p .github/skills
cp -R .github/skills/jira-story-writer <target-repo>/.github/skills/
```

### B) Personal deployment
Install for one developer locally.

```bash
mkdir -p ~/.copilot/skills
cp -R .github/skills/jira-story-writer ~/.copilot/skills/
```

### C) GitHub CLI deployment
Install from a central repository using GitHub CLI.

```bash
gh skills install alwyndsouza/jira-story-writer
```

## 3. Enterprise Rollout Strategy

1. Maintain this repository as the central skill source of truth.
2. Ask product/platform teams to install from the central repo using the CLI command.
3. Standardize update cadence (for example monthly) to reduce output drift.
4. Track adoption by requiring teams to reference skill version in internal enablement docs.

> Org-level skills support is on the GitHub roadmap. Prepare by keeping stable paths, semantic
> versioning in `CHANGELOG.md`, and strict CODEOWNERS governance.

## 4. Governance

- Configure **CODEOWNERS** so all skill changes require review from designated owners.
- Enable **branch protection** on `main`.
- Require at least one PR review from a codeowner.
- Require `validate-skill.yml` to pass before merge.

## 5. Troubleshooting

### Skill not loading
- Wait 5–10 minutes for indexing after changes.
- Reload VS Code window and retry.
- Confirm skill exists under `.github/skills/` or `~/.copilot/skills/`.

### Output quality is wrong
- Check keyword coverage in `SKILL.md` description and invoke modes.
- Verify references/examples reflect the expected behavior.

### Slash command not appearing
- Confirm Copilot Agent Mode is enabled.
- Verify `chat.useAgentSkills: true` is set in VS Code.
- Reopen workspace after skill installation.

## 6. Customisation

### Add team-specific personas
- Update `.github/skills/jira-story-writer/references/personas.md` with role and "Use When".
- Keep persona names explicit and operational (avoid generic "user").

### Adjust Definition of Done by team
- Update DoD checklist entries in `SKILL.md` to match team controls.
- Keep quality gates objective and testable (CI, coverage, approvals, security checks).
