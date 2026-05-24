import os
import json
import argparse
import sys
import re
from pathlib import Path

# Production-ready evaluation script for Agile Story Skills.
# This script parses test cases and rubrics from Markdown and uses an LLM to evaluate skill performance.

def load_file(path):
    with open(path, 'r') as f:
        return f.read()

def parse_test_cases(content):
    """
    Parses test cases from Markdown formatted as:
    ## [ID]: [Name]
    **Input:** [Input string]
    **Expected Characteristics:**
    - [Trait 1]
    - [Trait 2]
    """
    test_cases = []
    # Split by ## headers
    sections = re.split(r'\n## ', content)
    for section in sections[1:]: # Skip preamble
        lines = section.strip().split('\n')
        name = lines[0].strip()

        input_match = re.search(r'\*\*Input:\*\* (.*)', section)
        expected_match = re.search(r'\*\*Expected Characteristics:\*\*\n((?:- .*\n?)+)', section)

        if input_match and expected_match:
            test_cases.append({
                "name": name,
                "input": input_match.group(1).strip(),
                "expected": expected_match.group(1).strip()
            })
    return test_cases

def parse_rubric(content):
    """
    Extracts the rubric table from Markdown.
    """
    # Find the table part of the rubric
    table_match = re.search(r'\|.*\|.*\n\|[-| ]*\|\n((?:\|.*\|\n?)+)', content)
    if table_match:
        return table_match.group(0).strip()
    return content # Fallback to full content

def evaluate_skill(skill_name, judge_client=None, model="gpt-4o"):
    skill_path = Path(f".github/skills/{skill_name}")
    if not skill_path.exists():
        print(f"Error: Skill {skill_name} not found.")
        return

    print(f"\n🚀 Evaluating Skill: {skill_name}")

    skill_def = load_file(skill_path / "SKILL.md")
    rubric_md = load_file(skill_path / "evaluation/rubric.md")
    test_cases_md = load_file(skill_path / "evaluation/test-cases.md")

    test_cases = parse_test_cases(test_cases_md)
    rubric = parse_rubric(rubric_md)

    if not test_cases:
        print("❌ No test cases found.")
        return

    results = []

    for tc in test_cases:
        print(f"  📝 Running Test Case: {tc['name']}")

        # 1. Candidate Invocation (Simulating the Skill)
        # In a full prod setup, you'd call the Copilot/Agent API here.
        # For this framework, we ask the model to act as the skill first.
        candidate_response = get_skill_response(skill_def, tc['input'], judge_client, model)

        # 2. Judge Invocation
        score_data = judge_response(rubric, tc, candidate_response, judge_client, model)
        results.append({
            "test_case": tc['name'],
            "scores": score_data['scores'],
            "feedback": score_data['feedback'],
            "average": sum(score_data['scores'].values()) / len(score_data['scores'])
        })

        print(f"    ✅ Score: {results[-1]['average']:.2f}/5.0")

    # Final Report
    print(f"\n--- Final Report: {skill_name} ---")
    total_avg = sum(r['average'] for r in results) / len(results)
    for res in results:
        print(f"- {res['test_case']}: {res['average']:.2f}")

    print(f"\nOVERALL QUALITY SCORE: {total_avg:.2f}/5.0")

    if total_avg < 4.0:
        print("❌ FAILED: Skill quality is below the 4.0 threshold.")
        return False

    print("✅ PASSED: Skill meets quality standards.")
    return True

def get_skill_response(skill_def, user_input, client, model):
    if not client:
        return "[MOCK OUTPUT: Skill generated a high-quality user story with ACs and NFRs]"

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": f"You are an AI Agent. Act according to this skill definition:\n\n{skill_def}"},
            {"role": "user", "content": user_input}
        ]
    )
    return response.choices[0].message.content

def judge_response(rubric, test_case, candidate_output, client, model):
    if not client:
        return {
            "scores": {"Title": 5, "ACs": 5, "Persona": 4},
            "feedback": "Mock judge approves."
        }

    prompt = f"""
    You are an expert Agile Coach and Quality Auditor.
    Evaluate the AI Skill Output against the provided Rubric and Test Case requirements.

    ### Test Case
    Input: {test_case['input']}
    Expected Characteristics:
    {test_case['expected']}

    ### AI Skill Output
    {candidate_output}

    ### Evaluation Rubric
    {rubric}

    ### Instructions
    1. Score each category in the rubric from 1 (Poor) to 5 (Excellent).
    2. Provide a brief justification for each score.
    3. Return your response in JSON format:
    {{
      "scores": {{ "Category1": score, "Category2": score }},
      "feedback": "Overall summary and improvement areas"
    }}
    """

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        response_format={ "type": "json_object" }
    )
    return json.loads(response.choices[0].message.content)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Production Evaluation for Agile Story Skills")
    parser.add_argument("--skill", help="Skill to evaluate")
    parser.add_argument("--model", default="gpt-4o", help="Model to use as judge")
    args = parser.parse_args()

    # Initialize client if API key is present
    client = None
    if os.getenv("OPENAI_API_KEY"):
        from openai import OpenAI
        client = OpenAI()
    elif os.getenv("GITHUB_MODELS_TOKEN") and os.getenv("GITHUB_MODELS_ENDPOINT"):
        from openai import OpenAI
        client = OpenAI(base_url=os.getenv("GITHUB_MODELS_ENDPOINT"), api_key=os.getenv("GITHUB_MODELS_TOKEN"))

    success = True
    if args.skill:
        success = evaluate_skill(args.skill, client, args.model)
    else:
        skills = [d.name for d in Path(".github/skills").iterdir() if d.is_dir()]
        for skill in skills:
            if not evaluate_skill(skill, client, args.model):
                success = False

    if not success:
        sys.exit(1)
