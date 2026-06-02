# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to Semantic Versioning.

## [1.1.0] - 2026-05-28

## [Unreleased]

### Changed

- Aligned evaluation and contributor docs with the current `EVAL_MODEL` default,
  eval scope, and supported `SKILL.md` frontmatter fields.

### Added

- `agile-story-writer` skill — generates complete, tool-agnostic agile stories (Jira,
  GitHub Issues, Linear, Azure DevOps) with action-verb titles, GIVEN/WHEN/THEN
  acceptance criteria, scope IN/OUT, NFR table, and DoR/DoD checklists. Triggers on
  story / ticket / card / backlog item / AC / GIVEN-WHEN-THEN prompts.
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
- Added pinned Node quality tooling, expanded skill eval coverage, and `quality.yml`.
- Added AI engineering governance and eval runbook documentation.
- Added release automation for creating GitHub Releases from `v*.*.*` tags.

### Fixed

- Synchronized repository, README, and skill metadata versions to `1.1.0`.
- Aligned Markdown lint documentation and CI so all repository Markdown is checked.
- Added CI `EVAL_MODEL` selection for promptfoo evals based on repository secrets or
  configured provider secrets.
- Updated release automation so manual tag creation syncs version metadata, commits the
  updates, and tags the synced commit before publishing the GitHub Release.
- Updated enterprise deployment documentation to reference the current pinned release.
- Ignored local `.claude/` agent worktrees so local automation files do not pollute
  repository checks.
