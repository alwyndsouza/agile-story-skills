# Test Cases: Agile Story Writer

| ID | Input | Expected Characteristics |
|---|---|---|
| TC1 | "Write a story for adding alerting on failed ingestion jobs." | - Action-verb title (e.g., "Add failure alerting...")<br>- Data Engineer persona<br>- GIVEN/WHEN/THEN ACs for alert trigger<br>- Observability NFRs included |
| TC2 | "Create a bug ticket for duplicate invoice records in daily load." | - TYPE: Bug<br>- Context explains business impact of double billing<br>- Scope OUT includes historical data cleanup (if not requested) |
| TC3 | "Vague request: fix the pipeline" | - Skill asks for system, persona, and outcome BEFORE generating |
