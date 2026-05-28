# Eval Runbook

Use this runbook to validate skill quality locally or in CI.

## Local Setup

```bash
npm ci
cp .env.example .env
```

Edit `.env` and set one provider key plus `EVAL_MODEL`.

Examples:

```bash
ANTHROPIC_API_KEY=...
EVAL_MODEL=anthropic:claude-3-7-sonnet-20250219
```

## Non-LLM Checks

Run:

```bash
npm run quality
```

This checks:

- Markdown lint
- YAML parse
- GitHub Actions lint
- skill manifest/frontmatter/path consistency
- eval config structure
- Markdown links

If link checks fail with status `0`, rerun with network access before treating the link
as broken.

## Live Skill Evals

Run one skill:

```bash
npm run eval:story-writer
npm run eval:story-splitter
npm run eval:problem-framing
npm run eval:sprint-goal
```

Run all skills:

```bash
npm run eval:all
```

Open report:

```bash
npm exec -- promptfoo view
```

## Reading Failures

Failure types:

| Failure | Meaning | First response |
|---|---|---|
| `contains` / `not-contains` | Required structure changed | Check `SKILL.md` output template |
| `llm-rubric` | Quality drift or ambiguous grader | Compare output to rubric and examples |
| Provider error | API key, model name, quota, network | Verify `.env` and provider status |
| Parse error | YAML or promptfoo config invalid | Run `npm run lint:yaml` |

## Updating Evals

Add or update evals when:

- a bug escapes review
- a `SKILL.md` behavior changes
- examples are rewritten
- trigger phrases are added
- a model upgrade changes output shape

Keep each skill at 8-12 tests. Prefer one focused assertion per behavior. Use
deterministic assertions wherever possible.

## CI Behavior

`quality.yml` runs non-LLM checks for docs, workflows, scripts, package files, skills, and
eval configs.

`automated-evaluation.yml` runs live promptfoo evals when `.github/skills/**` or `evals/**`
change. If no provider secret is configured, it skips with a visible warning.

Required branch protection should include `Quality`. Add `Skill Eval (promptfoo)` when
provider secrets are configured and live eval cost is acceptable.
