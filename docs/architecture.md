# High-Level Architecture

This repository is a portable AI skill bundle. It packages four agile delivery skills,
their supporting references and examples, automated quality checks, and release assets.

```mermaid
flowchart TB
  subgraph Consumers["Consumers"]
    Agent["AI agents<br/>Copilot, Claude Code, Codex, Cursor, Gemini"]
    Team["Product and engineering teams"]
    Tools["Delivery tools<br/>Jira, GitHub Issues, Linear, Azure DevOps"]
  end

  subgraph SkillBundle["Agile Story Skills bundle"]
    Manifest["skills.json<br/>skill registry and version"]

    subgraph Skills[".github/skills"]
      Writer["agile-story-writer<br/>story, bug, task, spike"]
      Splitter["agile-story-splitter<br/>vertical slicing"]
      Framing["problem-framing<br/>MITRE canvas"]
      Goal["sprint-goal-writer<br/>outcome goal"]
    end

    subgraph SupportFiles["Supporting skill files"]
      References["references<br/>personas, source frameworks, guides"]
      Examples["examples<br/>golden and anti-pattern outputs"]
      Assets["assets<br/>copy-paste templates"]
      Rubrics["evaluation rubrics<br/>human review criteria"]
    end
  end

  subgraph QualitySystem["Quality and evaluation system"]
    Package["package.json + package-lock.json<br/>pinned Node toolchain"]
    Scripts["scripts<br/>YAML, Actions, skill, eval validators"]
    EvalConfigs["evals<br/>promptfoo test suites"]
    QualityCI["quality.yml<br/>non-LLM quality gate"]
    SkillEvalCI["automated-evaluation.yml<br/>live promptfoo evals"]
  end

  subgraph Governance["Governance and release"]
    AgentsDoc["AGENTS.md<br/>agent operating rules"]
    GovernanceDoc["docs/ai-engineering-governance.md<br/>change policy"]
    EvalRunbook["docs/eval-runbook.md<br/>eval operations"]
    Codeowners["CODEOWNERS<br/>review ownership"]
    Release["release.yml + CHANGELOG.md<br/>versioned GitHub Releases"]
  end

  Agent --> Manifest
  Agent --> Skills
  Team --> Agent
  Skills --> Tools

  Manifest --> Skills
  Skills --> References
  Skills --> Examples
  Skills --> Assets
  Skills --> Rubrics

  EvalConfigs --> Skills
  Package --> Scripts
  Scripts --> QualityCI
  EvalConfigs --> SkillEvalCI
  Skills --> SkillEvalCI
  QualityCI --> Release
  SkillEvalCI --> Release

  AgentsDoc --> Agent
  GovernanceDoc --> QualitySystem
  EvalRunbook --> EvalConfigs
  Codeowners --> Skills
  Release --> Consumers
```

## Runtime Flow

```mermaid
sequenceDiagram
  actor Requester as Product/Engineering requester
  participant Agent as AI agent
  participant Skill as Selected SKILL.md
  participant Ref as References/examples
  participant Output as Agile work output
  participant Tool as Delivery tool

  Requester->>Agent: Ask for story, split, framing, or sprint goal
  Agent->>Skill: Load matching skill instructions
  Skill->>Ref: Pull personas, examples, templates, and rubrics as needed
  Ref-->>Agent: Provide supporting context
  Agent->>Output: Produce deterministic boxed Markdown
  Output->>Tool: Paste into Jira, GitHub Issues, Linear, or Azure DevOps
```

## Maintenance Flow

```mermaid
flowchart LR
  Change["Skill, doc, eval, or workflow change"]
  LocalQuality["npm run quality"]
  Review["CODEOWNERS review"]
  LiveEval["promptfoo live evals<br/>when behavior changes"]
  Main["main branch"]
  Tag["v*.*.* tag"]
  Release["GitHub Release"]

  Change --> LocalQuality
  LocalQuality --> Review
  Review --> LiveEval
  LiveEval --> Main
  Main --> Tag
  Tag --> Release
```

## Architecture Notes

- Skills are plain Markdown contracts, so they can be copied into project-scoped or
  personal agent skill directories.
- `skills.json` is the programmatic manifest for skill discovery and version alignment.
- Supporting references keep `SKILL.md` focused while preserving deeper domain guidance.
- `quality.yml` is the non-LLM gate for Markdown, YAML, workflow syntax, skill structure,
  eval config shape, and links.
- `automated-evaluation.yml` is the live model gate for output behavior and drift.
- Releases package a stable skill bundle for teams that need reproducible agent behavior.
