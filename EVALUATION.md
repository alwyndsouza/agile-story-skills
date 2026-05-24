# Evaluation Framework for Agile Story Skills

This document describes how to evaluate the quality and effectiveness of the skills in this repository.

## Overview

Each skill contains an `evaluation/` directory with:
1. **`rubric.md`**: A scoring guide for evaluating output quality across key dimensions.
2. **`test-cases.md`**: Standard inputs to verify skill behavior and consistency.

## How to Evaluate

### Manual Evaluation
1. Provide the input from a `test-cases.md` to the Copilot Skill.
2. Compare the output against the "Expected Characteristics" in the test case.
3. Score the output using the `rubric.md`.
4. Identify gaps and iterate on the `SKILL.md` or reference files.

### Automated Evaluation (CI/CD)
This repository includes a framework for automated evaluation using GitHub Actions.

1. **Evaluation Script**: Located at `scripts/evaluate.py`, this script loads skill definitions and runs test cases against the associated rubric.
2. **CI Workflow**: The `.github/workflows/automated-evaluation.yml` runs on every PR that modifies a skill.

#### Setting up Automated Scoring (Production)

The evaluation framework is production-ready and supports OpenAI and GitHub Models out of the box.

1. **API Keys**:
   - For **OpenAI**: Add `OPENAI_API_KEY` to your GitHub Repository Secrets.
   - For **GitHub Models**: The workflow uses the default `GITHUB_TOKEN`. Ensure your token has access to the GitHub Models marketplace.

2. **Thresholds**:
   - The script `scripts/evaluate.py` enforces a **4.0/5.0 quality threshold**.
   - If a skill's average score across all test cases falls below 4.0, the CI job will fail, preventing poor-quality skills from being merged.

3. **Running Locally**:
   ```bash
   pip install -r scripts/requirements.txt
   export OPENAI_API_KEY=your_key_here
   python scripts/evaluate.py --skill agile-story-writer
   ```

### LLM-as-a-Judge Prompting
When using a model (e.g., GPT-4o) to evaluate, use the following prompt pattern:

> "You are an expert Agile Coach. Evaluate the following AI Skill output against the provided rubric. For each category, provide a score from 1 to 5 and a brief justification. If the average score is below 4, provide specific instructions for rewriting the skill definition to fix the gaps."

**Inputs:**
- **Skill Definition**: [Paste `SKILL.md`]
- **Test Case**: [Paste from `test-cases.md`]
- **AI Output**: [The output you want to evaluate]
- **Rubric**: [Paste `rubric.md`]

## Skills Evaluation Links
- [Agile Story Writer Rubric](.github/skills/agile-story-writer/evaluation/rubric.md)
- [Agile Story Splitter Rubric](.github/skills/agile-story-splitter/evaluation/rubric.md)
- [Problem Framing Rubric](.github/skills/problem-framing/evaluation/rubric.md)
- [Sprint Goal Writer Rubric](.github/skills/sprint-goal-writer/evaluation/rubric.md)
