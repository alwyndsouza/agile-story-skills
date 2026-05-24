# Test Cases: Problem Framing

| ID | Input | Expected Characteristics |
|---|---|---|
| TC1 | "/problem-framing" | - Starts with Q1: "What is the problem?"<br>- Asks only ONE question per turn<br>- Restates answer before next Q |
| TC2 | "Just frame this: We need a dashboard for pipeline latency." | - Infer Phase 1 and 2<br>- Identifies "dashboard" as a solution, not a symptom<br>- Outputs full Canvas with "Assumptions made" footer |
| TC3 | Context dump of a messy incident report | - Parses dump into Phases<br>- Asks for confirmation PER PHASE |
