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

### Automated Evaluation (LLM-as-a-Judge)
You can use a more capable model (e.g., GPT-4o) to evaluate the output of these skills by providing the rubric as part of the evaluation prompt.

**Prompt Example:**
> "Evaluate the following agile story against this rubric: [Paste Rubric]. Provide a score for each category and a total score out of 35."

## Skills Evaluation Links
- [Agile Story Writer Rubric](.github/skills/agile-story-writer/evaluation/rubric.md)
- [Agile Story Splitter Rubric](.github/skills/agile-story-splitter/evaluation/rubric.md)
- [Problem Framing Rubric](.github/skills/problem-framing/evaluation/rubric.md)
- [Sprint Goal Writer Rubric](.github/skills/sprint-goal-writer/evaluation/rubric.md)
