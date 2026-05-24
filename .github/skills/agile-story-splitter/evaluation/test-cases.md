# Test Cases: Agile Story Splitter

| ID | Input | Expected Characteristics |
|---|---|---|
| TC1 | 13-point story about a full checkout migration | - Splits into 2-5 vertical slices<br>- Uses Pattern P1 (Workflow) or P2 (Rules)<br>- Summary table shows points per slice and new total |
| TC2 | "Split this using workflow steps: [Story]" | - Forces usage of Pattern P1<br>- INVEST validation flags sequencing dependencies |
| TC3 | Horizontal slice input (e.g., "Split into FE and BE") | - Skill refuses anti-pattern<br>- Recommends vertical slices instead |
