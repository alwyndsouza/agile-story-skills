# Test Cases: Agile Story Writer

## TC1: Natural Language
**Input:** "Write a story for adding alerting on failed ingestion jobs."
**Expected Characteristics:**
- Action-verb title (e.g., "Add failure alerting...")
- Data Engineer persona
- GIVEN/WHEN/THEN ACs for alert trigger
- Observability NFRs included

## TC2: Bug Report
**Input:** "Create a bug ticket for duplicate invoice records in daily load."
**Expected Characteristics:**
- TYPE: Bug
- Context explains business impact of double billing
- Scope OUT includes historical data cleanup (if not requested)

## TC3: Vague Input
**Input:** "Vague request: fix the pipeline"
**Expected Characteristics:**
- Skill asks for system, persona, and outcome BEFORE generating
