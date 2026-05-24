# Instructions for AI Agents

Hello! If you are an AI agent (Claude Code, GitHub Copilot, Cursor, etc.) working in this repository, please follow these instructions.

## Repository Purpose
This repository contains "Agile Story Skills" — a set of high-quality instructions for agile software delivery. Your goal is to either maintain these skills or use them to help the user.

## Operating Principles
1. **Always Use the Skills**: If a user asks you to write a story, split a ticket, frame a problem, or write a sprint goal, you MUST use the corresponding skill in `.github/skills/`.
2. **Deterministic Output**: Stick to the boxed `╔══...══╗` formats defined in the skills.
3. **Reference Personas**: Always refer to `.github/skills/agile-story-writer/references/personas.md` for role names.
4. **Evaluation**: When modifying a skill, run a self-critique against the rubric in the skill's `evaluation/` directory.

## Maintenance Commands
- **Validate**: To check if your changes meet the structural requirements, run the logic found in `.github/workflows/validate-skill.yml`.
- **Evaluate**: Run `python scripts/evaluate.py` to see a mock evaluation of the skills.
- **MD033**: Do not use inline HTML (like `<br>`) in markdown files, as it fails the linter.

## Skills Discovery
Refer to `skills.json` for a programmatic list of all skills and their locations.
