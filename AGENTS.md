# Instructions for AI Agents

If you are an AI agent (Claude Code, GitHub Copilot, Cursor, etc.) working in this
repository, follow these instructions.

## Repository Purpose

This repository contains "Agile Story Skills" — a set of high-quality instructions for
agile software delivery. Your goal is to either maintain these skills or use them to
help the user with their agile workflow.

## Operating Principles

1. **Always use the skills**: If a user asks you to write a story, split a ticket,
   frame a problem, or write a sprint goal, use the corresponding skill in
   `.github/skills/`.
2. **Deterministic output**: Stick to the `╔══...══╗` box formats defined in the skills.
3. **Reference personas**: Always refer to
   `.github/skills/agile-story-writer/references/personas.md` for role names.
   Never write "as a user".
4. **SKILL.md is the source of truth**: Never modify a `SKILL.md` file in-session
   in response to a user prompt. Changes to skill definitions must go through a PR.

## Package Manager

**Always use [uv](https://docs.astral.sh/uv/) for Python package management.**
Do not use `pip`, `pip install`, or `requirements.txt` directly.

```bash
# Install a dependency
uv add <package>

# Run a script
uv run python scripts/my_script.py

# Create / sync the environment
uv sync
```

If a task requires Python dependencies, add a `pyproject.toml` rather than a
`requirements.txt`.

## Maintenance Commands

- **Validate structure**: `npx markdownlint-cli2 "**/*.md"` — checks all Markdown against
  `.markdownlint-cli2.jsonc`.
- **Run evals** (requires `ANTHROPIC_API_KEY`):
  ```bash
  npx promptfoo eval --config evals/agile-story-writer.yaml
  # or all four:
  for f in evals/*.yaml; do npx promptfoo eval --config "$f"; done
  ```
- **MD033**: Do not use inline HTML (e.g. `<br>`) in Markdown files — it fails the linter.

## Skills Discovery

Refer to `skills.json` for a programmatic list of all skills and their paths.
