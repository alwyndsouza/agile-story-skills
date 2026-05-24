# Test Cases: Sprint Goal Writer

| ID | Input | Expected Characteristics |
|---|---|---|
| TC1 | List of 5 stories about API security hardening | - Goal focuses on "Protecting customer data" (outcome)<br>- Not "Implement OAuth and mask PII" (feature list)<br>- Names "Security Team" or "Customer" as beneficiary |
| TC2 | List of 2 stories | - Skill asks for more stories/context before drafting |
| TC3 | List of 5 unrelated stories | - Skill flags lack of common thread<br>- Offers two candidate goals (Goal A vs Goal B) |
