# Test Cases: Agile Story Splitter

## TC1: Large Story Split
**Input:** 13-point story about a full checkout migration
**Expected Characteristics:**
- Splits into 2-5 vertical slices
- Uses Pattern P1 (Workflow) or P2 (Rules)
- Summary table shows points per slice and new total

## TC2: Pattern-Pinned Split
**Input:** "Split this using workflow steps: [Story]"
**Expected Characteristics:**
- Forces usage of Pattern P1
- INVEST validation flags sequencing dependencies

## TC3: Anti-Pattern Handling
**Input:** Horizontal slice input (e.g., "Split into FE and BE")
**Expected Characteristics:**
- Skill refuses anti-pattern
- Recommends vertical slices instead
