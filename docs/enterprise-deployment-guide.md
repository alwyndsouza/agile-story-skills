# Enterprise Deployment Guide

This guide covers rolling out the four `agile-story-skills` (`agile-story-writer`,
`agile-story-splitter`, `problem-framing`, `sprint-goal-writer`) across an organisation
using GitHub Copilot Business or Enterprise.

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

Copy the four skill directories into a target repository so every contributor gets the
same behaviour.

```bash
mkdir -p <target-repo>/.github/skills
cp -R .github/skills/agile-story-writer    <target-repo>/.github/skills/
cp -R .github/skills/agile-story-splitter  <target-repo>/.github/skills/
cp -R .github/skills/problem-framing       <target-repo>/.github/skills/
cp -R .github/skills/sprint-goal-writer    <target-repo>/.github/skills/
```

### B) Personal deployment

Install for one developer locally.

```bash
mkdir -p ~/.copilot/skills
cp -R .github/skills/agile-story-writer    ~/.copilot/skills/
cp -R .github/skills/agile-story-splitter  ~/.copilot/skills/
cp -R .github/skills/problem-framing       ~/.copilot/skills/
cp -R .github/skills/sprint-goal-writer    ~/.copilot/skills/
```

### C) Pinned release tarball

Recommended for shared installs so every team is on the same version.

```bash
gh release download v1.2.0 --repo alwyndsouza/agile-story-skills --archive=tar.gz
tar -xzf agile-story-skills-1.2.0.tar.gz
cd agile-story-skills-1.2.0
# then use pattern A or B above
```

### D) Git submodule

For teams that want upstream updates to flow with `git pull`:

```bash
git submodule add https://github.com/alwyndsouza/agile-story-skills.git \
  .github/skills/_upstream
for skill in agile-story-writer agile-story-splitter problem-framing sprint-goal-writer; do
  ln -s _upstream/.github/skills/$skill .github/skills/$skill
done
# Later: git submodule update --remote .github/skills/_upstream
```

> **Note:** GitHub CLI does not have a `skills install` subcommand and there is no public
> Copilot Skills registry. Distribution today is via `git clone`, release tarballs, or
> submodules.

## 3. Enterprise Rollout Strategy

1. Maintain this repository as the central skills source of truth.
2. Cut a `v*.*.*` release per stable version using the manual `release.yml` workflow.
   It syncs release metadata, commits any version updates, tags the synced commit, and
   creates the GitHub Release with notes pulled from `CHANGELOG.md`.
3. Ask product / platform teams to pin to a release tag (pattern C) rather than tracking
   `main` (pattern A), so behaviour is reproducible across teams.
4. Standardise upgrade cadence (for example monthly) to reduce output drift.
5. Track adoption by requiring teams to reference the skills version in internal
   enablement docs.

> Org-level skills support is on the GitHub roadmap. Prepare by keeping stable paths,
> semantic versioning in `CHANGELOG.md`, and strict CODEOWNERS governance.

## 4. Governance

- Configure **CODEOWNERS** so all skill changes require review from designated owners.
- Enable **branch protection** on `main`.
- Require at least one PR review from a codeowner.
- Require `validate-skill.yml` to pass before merge.

## 5. Troubleshooting

### Skill not loading

- Wait 5–10 minutes for indexing after changes.
- Reload VS Code window and retry.
- Confirm each skill exists under `.github/skills/<skill-name>/` (project-scoped) or
  `~/.copilot/skills/<skill-name>/` (personal).

### Output quality is wrong

- Check keyword coverage in the skill's `SKILL.md` description and invoke-modes table.
- Verify `references/` and `examples/` reflect the expected behaviour.

### Slash command not appearing

- Confirm Copilot Agent Mode is enabled.
- Verify `chat.useAgentSkills: true` is set in VS Code.
- Reopen the workspace after skill installation.

## 6. Customisation

### Add team-specific personas

- Update `.github/skills/agile-story-writer/references/personas.md` with the role and a
  "Use When" entry. The splitter and sprint-goal-writer share this file via relative
  reference, so a single edit propagates to all three story-shaped skills.
- Keep persona names explicit and operational (avoid generic "user").

### Adjust Definition of Done by team

- Update the DoD checklist entries in `agile-story-writer/SKILL.md` and the matching
  block in `agile-story-writer/assets/story-template.txt` to reflect team controls.
- Keep quality gates objective and testable (CI, coverage, approvals, security checks).

### Adjust the split-pattern reference

- Edit `.github/skills/agile-story-splitter/references/split-patterns.md` to add a
  domain-specific before/after example to any of the eight patterns. The skill loads this
  reference progressively, so edits take effect on the next invoke.
