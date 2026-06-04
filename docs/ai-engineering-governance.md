# AI Engineering Governance

This repository treats each skill as production AI behavior, not just documentation.
Changes must preserve output contracts, trigger reliability, and evaluation coverage.

## Quality Principles

- `SKILL.md` is the behavioral contract.
- References and examples support the contract but must not contradict it.
- Output formats are deterministic and intentionally strict.
- Personas must come from `.github/skills/agile-story-writer/references/personas.md`.
- Changes to prompts, examples, or evals require review because small wording changes can
  shift model behavior.

## Change Classes

| Change | Examples | Required checks |
|---|---|---|
| `feat(skill)` | New invoke mode, new trigger pattern, new persona, new output field | `npm run quality`, live promptfoo eval for affected skill |
| `fix(skill)` | Correct refusal behavior, tighten AC rules, repair examples | `npm run quality`, live promptfoo eval for affected skill |
| `docs(skill)` | README, runbook, deployment guidance | `npm run quality` |
| `chore(quality)` | Tooling, workflow, eval harness | `npm run quality`; live eval when eval semantics change |

## Eval Policy

Each skill must have 8-12 automated tests in `evals/*.yaml`.

Every eval file should include:

- Happy path
- Missing or vague input
- Anti-pattern refusal
- Persona specificity
- Scope boundary validation
- Format preservation
- One skill-specific edge case
- One regression test from a real failure

Use deterministic assertions for required structure. Use `llm-rubric` only for quality
judgment that keyword checks cannot verify.

## Model Policy

CI selects `EVAL_MODEL` from configured secrets. If `EVAL_MODEL` is unset, it chooses a
default from the first available provider key.

Run live evals when:

- `SKILL.md` changes
- eval criteria change
- examples that steer behavior change
- supported model changes
- a drift incident is suspected

Record model, date, and failure summary in PR notes when live evals are run.

## Prompt Compression Policy

Do not blindly compress full `SKILL.md` files. Compression can remove trigger words,
weaken refusal rules, or change the exact output contract.

Safe targets:

- `AGENTS.md`
- internal notes
- duplicate prose in docs
- long examples after eval coverage exists

Unsafe targets:

- box output templates
- acceptance criteria rules
- refusal tables
- invoke-mode trigger lists
- persona names

After any compression, run `npm run quality` and live promptfoo evals for affected skills.

## Review Checklist

- Does change preserve deterministic box formats?
- Does it avoid generic "as a user" language?
- Does it keep `SKILL.md`, examples, rubrics, and evals aligned?
- Does every behavioral change add or update an eval?
- Does `skills.json` still match skill paths and versions?
- Does `applyTo` still describe only trigger phrases for the owning skill?
- Does `npm run quality` pass?
- Were live promptfoo evals run when behavior changed?

## Drift Review Cadence

Run full live evals:

- before each release
- after provider model upgrades
- after significant skill rewrites
- quarterly for baseline drift detection

Compare failures against previous outputs, then tighten instructions or eval rubrics.
