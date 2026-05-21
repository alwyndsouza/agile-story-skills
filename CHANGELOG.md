# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to Semantic Versioning.

## [1.1.0] - 2026-05-21

### Added
- `agile-story-writer` skill — rename and generalisation of `jira-story-writer`. Output is
  now tool-agnostic (Jira, GitHub Issues, Linear, Azure DevOps); the box header is
  `AGILE STORY` and the description triggers cover backlog item / ticket / card / AC /
  GIVEN-WHEN-THEN / story-too-big / improve-this-story prompts.
- `agile-story-splitter` skill — breaks oversized stories or epics into 2–5 sprint-sized
  vertical slices using Richard Lawrence's eight Humanizing Work patterns (P1 Workflow
  Steps … P8 Tiny Acts of Discovery). Emits each sub-story in the full AGILE STORY box
  format, a summary table comparing original vs new estimate, and an INVEST validation
  table.
- `problem-framing` skill — walks teams through the MITRE Problem Framing Canvas (three
  phases, eight questions) before any story is written. Produces a refined problem
  statement and a How-Might-We question ready to feed `/agile-story-writer`. Supports
  interactive, context-dump, and non-interactive modes.
- `sprint-goal-writer` skill — drafts an outcome-based sprint goal from 3–10 committed
  stories per the Scrum Guide definition. Returns the recommended goal, two alternatives
  considered, in-scope / out-of-scope story breakdown, and a five-item health check.

### Changed
- `validate-skill.yml`: extended `required_files` array to cover all four skills and
  iterated the frontmatter check across every SKILL.md.
- `README.md`: rewritten to describe the four-skill bundle, the typical end-to-end flow,
  the full invoke-mode table, and the new repo structure tree.

### Removed
- `jira-story-writer` skill directory — superseded by `agile-story-writer`. History is
  preserved via `git mv`.

## [1.0.1] - 2026-05-20

### Added
- `.gitignore` covering macOS, VS Code, JetBrains, Node, and general editor temp files.

### Fixed
- `CODEOWNERS`: replaced `<your-org>/<your-team>` placeholders with `@alwyndsouza` and added a comment for team-handle migration.
- `validate-skill.yml`: extended `paths` filter to include the workflow file itself so workflow changes are validated.

## [1.0.0] - 2026-05-20

### Added
- SKILL.md with full story format, 6 invoke modes, and quality rules.
- `good-story.md` and `bad-story.md` examples.
- `personas.md` and `story-format-guide.md` references.
- `story-template.txt` blank template.
- CI validation workflow (`validate-skill.yml`).
- Enterprise deployment guide.
