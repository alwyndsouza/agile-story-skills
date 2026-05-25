# Evaluation Framework for Agile Story Skills

This document describes how to evaluate the quality and consistency of the four
skills in this repository and how to detect skill drift over time.

---

## Overview

Two layers of evaluation exist for every skill:

| Layer | What it catches | Where it lives |
|---|---|---|
| **Human review** | Qualitative gaps a rubric can't fully capture — tone, framing, missing context | `evaluation/rubric.md` per skill |
| **Automated eval** | Structural drift, anti-pattern failures, quality regression across model updates | `evals/*.yaml` (promptfoo) |

---

## Automated Evaluation — promptfoo

The automated layer uses **[promptfoo](https://promptfoo.dev/)**, an open-source
LLM eval framework. It runs each skill's SKILL.md as a system prompt, sends test
inputs, and evaluates the output with a mix of deterministic assertions and an
LLM-as-judge.

### How it works

```text
SKILL.md  ─────────────────────────────┐
                                       ▼
test input ──► [LLM Model*] ──────────► skill output ──► assertions ──► PASS / FAIL
                                                             │
                                              ┌──────────────┴──────────────┐
                                         structural                    LLM-judge
                                      (contains / not-contains)    (llm-rubric)

* Any supported provider: Anthropic, OpenAI, Google, or open models via OpenRouter
```

**Structural assertions** are deterministic — they check that the output contains
required box headers, section labels, and keywords (e.g. `╔══`, `GIVEN`, `WHEN`,
`THEN`, `Scope — OUT`). A model update that drops a required section fails
immediately with no LLM call required.

**LLM-judge assertions** (`llm-rubric`) evaluate qualitative quality — e.g.
"the title starts with an action verb" or "the HMW statement has a measurable
objective". These use a separate grader call against the same model.

### Running locally

```bash
# Install promptfoo once
npm install -g promptfoo

# Copy the example env file and fill in your values
cp .env.example .env
# Then edit .env — set EVAL_MODEL and the corresponding API key for your provider

# Eval one skill
npx promptfoo eval --config evals/agile-story-writer.yaml

# Eval all four skills
for f in evals/*.yaml; do npx promptfoo eval --config "$f"; done

# Open the HTML results report
npx promptfoo view
```

**Supported providers and models:**

| Provider | API Key | Example Models | Setup |
|---|---|---|---|
| **Anthropic** | `ANTHROPIC_API_KEY` | `anthropic:claude-3-7-sonnet-20250219`, `anthropic:claude-opus-4-5` | Get key from [console.anthropic.com](https://console.anthropic.com) |
| **OpenAI** | `OPENAI_API_KEY` | `openai:gpt-4o`, `openai:gpt-4-turbo` | Get key from [platform.openai.com](https://platform.openai.com) |
| **Google** | `GOOGLE_API_KEY` | `google:gemini-2.0-flash`, `google:gemini-1.5-pro` | Get key from [Google AI Studio](https://aistudio.google.com) |
| **Open models** | `OPENROUTER_API_KEY` | `openrouter:meta-llama/llama-2-70b`, `openrouter:mistralai/mistral-large` | Get key from [openrouter.ai](https://openrouter.ai) (includes Llama, Mistral, Dolphin, Nous models) |

### Running in CI

The workflow `.github/workflows/automated-evaluation.yml` runs on every PR that
touches `.github/skills/**` or `evals/**`.

Add one or more API key secrets to **Settings → Secrets → Actions**:
- `ANTHROPIC_API_KEY` (for Anthropic models)
- `OPENAI_API_KEY` (for OpenAI models)
- `GOOGLE_API_KEY` (for Google models)
- `OPENROUTER_API_KEY` (for open models via OpenRouter)

Without any secret configured, the eval step is skipped with a visible warning — it never
silently passes on mock data.

---

## Eval files

```text
evals/
├── prompts/
│   ├── agile-story-writer.yaml     # chat prompt: SKILL.md as system, {{input}} as user
│   ├── agile-story-splitter.yaml
│   ├── problem-framing.yaml
│   └── sprint-goal-writer.yaml
├── agile-story-writer.yaml         # test cases + assertions for story writer
├── agile-story-splitter.yaml       # test cases + assertions for story splitter
├── problem-framing.yaml            # test cases + assertions for problem framing
└── sprint-goal-writer.yaml         # test cases + assertions for sprint goal writer
```

Each config file covers three test cases:

| TC | Pattern | What it tests |
|---|---|---|
| TC1 | Happy path | Core skill output structure and quality |
| TC2 | Edge case | Skill-specific boundary (e.g. too-few stories, pattern-pinned split) |
| TC3 | Anti-pattern | Skill correctly refuses or redirects a bad input |

---

## Manual Evaluation — Rubrics

Each skill has a `evaluation/rubric.md` with a 1/3/5 scoring table. Use it when:

- Reviewing a PR that changes a SKILL.md
- Doing a quarterly drift audit
- Comparing output quality across two model versions

### How to use

1. Pick a test case input from `evaluation/test-cases.md`.
2. Invoke the skill in Copilot / Claude Code / your preferred client.
3. Score each rubric dimension from 1 to 5.
4. If any dimension scores below 3, open a skill-improvement issue using the
   template in `.github/ISSUE_TEMPLATE/skill-improvement.md`.

### Rubric links

- [Agile Story Writer](.github/skills/agile-story-writer/evaluation/rubric.md)
- [Agile Story Splitter](.github/skills/agile-story-splitter/evaluation/rubric.md)
- [Problem Framing](.github/skills/problem-framing/evaluation/rubric.md)
- [Sprint Goal Writer](.github/skills/sprint-goal-writer/evaluation/rubric.md)

---

## Detecting drift

Skill drift occurs when a model update or SKILL.md edit causes the output to
silently regress — missing sections, weaker ACs, vague personas. The promptfoo
suite catches this automatically because:

- **Structural assertions** fail the moment a required section disappears from
  output, regardless of why.
- **Anti-pattern assertions** catch regressions where the skill stops refusing
  bad inputs (e.g. accepting a horizontal slice it should reject).
- **LLM-judge assertions** detect qualitative decay that no keyword check can
  catch (e.g. ACs that use GIVEN/WHEN/THEN syntax but have non-testable THEN
  clauses).

Run the full suite on a schedule or after any Copilot / Claude model update to
get a drift baseline. If scores drop, compare the new output to `examples/`
golden files to identify which rule is no longer being followed, then tighten
the SKILL.md instruction that governs it.
