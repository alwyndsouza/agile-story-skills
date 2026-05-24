# Agent Compatibility Guide

This guide explains how to use the Agile Story Skills with various agentic AI tools and platforms.

## 1. Claude Code / Anthropic Agent Skills

Claude Code supports loading skills via the `SKILL.md` standard.

### Installation
1. Clone this repository or copy the `.github/skills/` directory into your project.
2. In your `claude` session, ensure the agent has read access to the `.github/skills/` folder.
3. You can explicitly point Claude to a skill:
   > "Use the agile-story-writer skill in .github/skills/agile-story-writer/SKILL.md to write a story for..."

### Best Practices
- Claude benefits from the **Self-Evaluation & Rewriting** sections. If the output isn't meeting your standards, ask: *"Claude, self-evaluate your story-writing performance against the rubric."*

---

## 2. OpenAI Codex / Custom GPTs

For Custom GPTs or persistent Codex sessions, use the "Knowledge" feature.

### Installation
1. Zip the desired skill folder (e.g., `agile-story-writer/`).
2. Upload the zip file to the GPT's Knowledge base.
3. In the Instructions/System Prompt, add:
   > "When writing agile stories, refer to the instructions and templates in the uploaded `agile-story-writer` folder."

---

## 3. Cursor

Cursor uses the `@Codebase` or `@Folder` indexing feature.

### Usage
1. Open the repository in Cursor.
2. When prompting in Chat (Cmd+L), mention the skill folder:
   > "@agile-story-writer write a story for adding SSO support."
3. Cursor will index the `SKILL.md` and associated references to provide the correct format.

---

## 4. Google Gemini CLI / AI Studio

### Usage
1. Upload the `SKILL.md` and `references/` files as part of the context or a Project in Google AI Studio.
2. For CLI usage, provide the skill definition as a system instruction or a preamble file.

---

## Summary of Portable Skill Standard
All skills in this repo follow a portable Markdown-based standard:
- **YAML Frontmatter**: For discovery and metadata.
- **Instructional Headings**: For behavior definition.
- **Boxed Output Templates**: For deterministic formatting across different models.
- **Progressive Context Loading**: Reference files are linked but separated to minimize token usage until needed.
