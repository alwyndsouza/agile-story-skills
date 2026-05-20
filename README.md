# Jira Story Writer

Generate well-structured, unambiguous Jira stories from rough requirements using a GitHub Copilot Agent Skill.

![CI](https://github.com/alwyndsouza/jira-story-writer/actions/workflows/validate-skill.yml/badge.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Proprietary-lightgrey)
![Copilot Plan](https://img.shields.io/badge/Copilot-Business%20%7C%20Enterprise-purple)

## Why This Exists

- Teams lose time rewriting vague stories that are missing scope boundaries and testable acceptance criteria.
- Inconsistent personas and ambiguous definitions create estimation drift and rework during sprints.
- Standardized story structure improves clarity, engineering handoff quality, and delivery predictability.

## Quick Start

### 1) Project-scoped install

```bash
mkdir -p <target-repo>/.github/skills
cp -R .github/skills/jira-story-writer <target-repo>/.github/skills/
```

### 2) Personal install

```bash
mkdir -p ~/.copilot/skills
cp -R .github/skills/jira-story-writer ~/.copilot/skills/
```

### 3) GitHub CLI install

```bash
gh skills install alwyndsouza/jira-story-writer
```

## How to Use

| Mode | Command / Prompt |
|---|---|
| Explicit slash | `/jira-story-writer Migrate ETL job to DLT with quality checks` |
| Natural language | `Write a Jira story for adding alerting on failed ingestion jobs.` |
| Rewrite | `Improve this Jira story: [paste current ticket text]` |
| Split | `This story is too big, split it: [paste card]` |
| Bug | `Write a bug ticket for duplicate invoice records in daily load.` |
| Spike | `Create a spike to investigate row-level lineage in Databricks.` |

### Example prompts
1. `Write a Jira story for migrating customer churn scoring to a daily Databricks job with quality checks.`
2. `Create a ticket to add API contract validation before publishing order events.`
3. `Improve this Jira story so all ACs use GIVEN/WHEN/THEN: [paste draft]`

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
jira-story-writer/
├── .github/
│   ├── skills/jira-story-writer/      # Skill definition, examples, references, template
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
- Custom agent wrapping this skill (planned)
- Jira API push via MCP (future)
