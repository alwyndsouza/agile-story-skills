# Test Cases: Sprint Goal Writer

## TC1: Focused Stories
**Input:** List of 5 stories about API security hardening
**Expected Characteristics:**
- Goal focuses on "Protecting customer data" (outcome)
- Not "Implement OAuth and mask PII" (feature list)
- Names "Security Team" or "Customer" as beneficiary

## TC2: Too Few Stories
**Input:** List of 2 stories
**Expected Characteristics:**
- Skill asks for more stories/context before drafting

## TC3: Unrelated Stories
**Input:** List of 5 unrelated stories
**Expected Characteristics:**
- Skill flags lack of common thread
- Uses the `SPRINT GOAL OPTIONS` format
- Offers two or more viable candidate goals rather than recommending one forced goal
