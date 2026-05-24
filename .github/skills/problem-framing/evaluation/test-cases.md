# Test Cases: Problem Framing

## TC1: Interactive Flow
**Input:** "/problem-framing"
**Expected Characteristics:**
- Starts with Q1: "What is the problem?"
- Asks only ONE question per turn
- Restates answer before next Q

## TC2: Non-Interactive Framing
**Input:** "Just frame this: We need a dashboard for pipeline latency."
**Expected Characteristics:**
- Infer Phase 1 and 2
- Identifies "dashboard" as a solution, not a symptom
- Outputs full Canvas with "Assumptions made" footer

## TC3: Context Dump
**Input:** Context dump of a messy incident report
**Expected Characteristics:**
- Parses dump into Phases
- Asks for confirmation PER PHASE
