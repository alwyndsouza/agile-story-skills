# Agile Story Skills

A bundle of four GitHub Copilot Agent Skills that take an engineering or product team from
a vague request through framing, story authoring, story splitting, and sprint goal
setting. Output is tool-agnostic — it pastes cleanly into Jira, GitHub Issues, Linear,
and Azure DevOps.

![CI](https://github.com/alwyndsouza/jira-story-writer/actions/workflows/validate-skill.yml/badge.svg)
![Version](https://img.shields.io/badge/version-1.1.0-blue)
![License](https://img.shields.io/badge/license-Proprietary-lightgrey)
![Copilot Plan](https://img.shields.io/badge/Copilot-Business%20%7C%20Enterprise-purple)

## Why This Exists

- Teams lose time rewriting vague stories that are missing scope boundaries and testable
  acceptance criteria.
- Stories arrive too large to estimate, and splitting them by gut feel produces
  horizontal slices that never ship value alone.
- Sprints begin without an outcome-based goal, so the team has no daily trade-off lever
  when a story drifts.
- Worst of all, work starts before the problem is framed — and the cheapest defect to
  prevent is the wrong problem.

## The Four Skills

| # | Skill | Use it when |
|---|-------|-------------|
| 1 | [`agile-story-writer`](.github/skills/agile-story-writer) | You need a complete, unambiguous story with GIVEN/WHEN/THEN ACs, scope IN/OUT, NFRs, and DoR/DoD. |
| 2 | [`agile-story-splitter`](.github/skills/agile-story-splitter) | A story is > 8 points, can't be estimated, or an epic needs decomposing into 2–5 sprint-sized vertical slices. |
| 3 | [`problem-framing`](.github/skills/problem-framing) | A request is vague, teams disagree on the real problem, or discovery is needed before backlog grooming. |
| 4 | [`sprint-goal-writer`](.github/skills/sprint-goal-writer) | Sprint planning needs a single outcome-based objective drawn from 3–10 committed stories. |

## Quick Start

### 1) Project-scoped install

```bash
mkdir -p <target-repo>/.github/skills
cp -R .github/skills/agile-story-writer    <target-repo>/.github/skills/
cp -R .github/skills/agile-story-splitter  <target-repo>/.github/skills/
cp -R .github/skills/problem-framing       <target-repo>/.github/skills/
cp -R .github/skills/sprint-goal-writer    <target-repo>/.github/skills/
```

### 2) Personal install

```bash
mkdir -p ~/.copilot/skills
cp -R .github/skills/agile-story-writer    ~/.copilot/skills/
cp -R .github/skills/agile-story-splitter  ~/.copilot/skills/
cp -R .github/skills/problem-framing       ~/.copilot/skills/
cp -R .github/skills/sprint-goal-writer    ~/.copilot/skills/
```

### 3) GitHub CLI install

```bash
gh skills install alwyndsouza/agile-story-skills
```

## How to Use

| Skill | Mode | Command / Prompt |
|---|---|---|
| `agile-story-writer` | Explicit slash | `/agile-story-writer Migrate ETL job to DLT with quality checks` |
| `agile-story-writer` | Natural language | `Write a story for adding alerting on failed ingestion jobs.` |
| `agile-story-writer` | Rewrite | `Improve this story: [paste current ticket text]` |
| `agile-story-writer` | Bug | `Write a bug ticket for duplicate invoice records in daily load.` |
| `agile-story-writer` | Spike | `Create a spike to investigate row-level lineage in Databricks.` |
| `agile-story-splitter` | Explicit slash | `/agile-story-splitter [paste oversized story]` |
| `agile-story-splitter` | Natural language | `This story is too big, split it: [paste card]` |
| `agile-story-splitter` | Pattern-pinned | `Split this using workflow steps: [paste card]` |
| `problem-framing` | Explicit slash | `/problem-framing` (then answer Q1 onward) |
| `problem-framing` | Context dump | `Here's what we know: [dump]. Frame it.` |
| `problem-framing` | Non-interactive | `Just frame this for me: [description]` |
| `sprint-goal-writer` | Explicit slash | `/sprint-goal-writer [paste story list]` |
| `sprint-goal-writer` | Natural language | `Write a sprint goal for these stories: [paste]` |
| `sprint-goal-writer` | Revision | `Improve this sprint goal: [paste current goal]` |

### Typical end-to-end flow

1. `/problem-framing` — turn a vague request into a refined problem statement and a
   How-Might-We question.
2. `/agile-story-writer` — generate the first story from the HMW.
3. `/agile-story-splitter` — invoked automatically when the writer flags > 8 points.
4. `/sprint-goal-writer` — once the sprint is committed, draft the outcome-based goal.

## What Every Story Contains

| Section | Enforced Outcome |
|---|---|
| Title / Type / Priority / Points | Specific, estimable work item with clear classification and rationale |
| Context + User Story | Role-based purpose and measurable business/operational outcome |
| Scope IN / Scope OUT | Explicit boundaries that prevent hidden scope creep |
| Acceptance Criteria | Objective GIVEN/WHEN/THEN checks for deterministic validation |
| Technical Notes + NFRs | Implementation guidance, dependencies, and quality constraints |
| Definition of Ready / Done | Shared checklist for planning quality and completion standards |

## Repo Structure

```text
agile-story-skills/
├── .github/
│   ├── skills/
│   │   ├── agile-story-writer/        # Story authoring (tool-agnostic format)
│   │   │   ├── SKILL.md
│   │   │   ├── examples/{good,bad}-story.md
│   │   │   ├── references/{personas,story-format-guide}.md
│   │   │   └── assets/story-template.txt
│   │   ├── agile-story-splitter/      # Humanizing Work 8-pattern splitter
│   │   │   ├── SKILL.md
│   │   │   ├── examples/split-example.md
│   │   │   └── references/split-patterns.md
│   │   ├── problem-framing/           # MITRE Problem Framing Canvas (3 phases / 8 Qs)
│   │   │   ├── SKILL.md
│   │   │   ├── examples/framing-example.md
│   │   │   └── assets/canvas-template.md
│   │   └── sprint-goal-writer/        # Outcome-based sprint goal drafter
│   │       ├── SKILL.md
│   │       ├── examples/goal-example.md
│   │       └── assets/goal-template.md
│   ├── workflows/validate-skill.yml   # CI validation for structure, markdown, frontmatter
│   ├── ISSUE_TEMPLATE/                # Skill improvement issue template
│   ├── CODEOWNERS                     # Ownership and review enforcement
│   └── PULL_REQUEST_TEMPLATE.md       # PR quality checklist
├── docs/
│   └── enterprise-deployment-guide.md # Enterprise installation and governance guidance
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
└── SECURITY.md
```

## Enterprise Deployment

See [docs/enterprise-deployment-guide.md](docs/enterprise-deployment-guide.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## Roadmap

- Org-level skills support (coming)
- Custom agent wrapping the four skills (planned)
- Jira / Linear / GitHub Issues push via MCP (future)
