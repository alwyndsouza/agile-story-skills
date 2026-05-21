# Agile Story Anti-Patterns Reference

## 1) Vague title
❌ **Bad:** `Update pipeline`

**Why this fails:**
- No action detail, no specific system, and no measurable outcome.
- Reviewers cannot infer scope, intent, or success criteria.

✅ **Fix:**
- `Migrate daily revenue aggregation from Redshift to Databricks DLT for DEV reliability`
- This title uses an action verb, concrete system names, and a clear outcome.

## 2) Generic persona
❌ **Bad:** `As a user, I want data, So that I can see it.`

**Why this fails:**
- "User" is not actionable for engineering prioritization.
- "Data" and "see it" are ambiguous and not outcome-based.

✅ **Fix:**
- `As a finance analyst, I want validated daily revenue aggregates published by 7:00 AM, so that I can finalize daily margin reporting before market open.`
- Persona is explicit, the action is concrete, and the outcome is measurable.

## 3) Untestable ACs
❌ **Bad:**
- `The pipeline should work correctly.`
- `Data should be accurate.`
- `UI should be fast.`

**Why this fails:**
- Each criterion is subjective and lacks objective pass/fail thresholds.
- None includes preconditions or trigger actions for deterministic testing.

✅ **Fix:**
- `GIVEN valid source extracts are available WHEN the nightly pipeline runs THEN the run finishes with status SUCCESS and no failed tasks.`
- `GIVEN reconciliation input for day D WHEN totals are compared THEN the aggregated revenue variance is <= 0.1%.`
- `GIVEN a dashboard request with a 30-day filter WHEN the page loads THEN p95 response time is <= 2 seconds.`

## 4) Missing scope boundary
❌ **Bad:**
- Scope lists only included work and has no explicit exclusions.

**Why this fails:**
- Teams cannot defend scope during sprint execution.
- Unplanned work is likely to be pulled in and derail delivery.

✅ **Fix:**
- **Scope — IN ✅**: Build DLT pipeline and deploy to DEV.
- **Scope — OUT ❌**: UAT/Prod rollout, dashboard redesign, and source schema refactor.

## 5) Story too large / epic in disguise
❌ **Bad:**
- `13 points: Build entire platform`

**Why this fails:**
- This represents multiple initiatives, domains, and release cycles.
- It cannot be delivered and validated within one sprint.

✅ **Fix (split into 4 sub-stories):**
1. `Create core Databricks workspace infrastructure for analytics workloads` (5 points)
2. `Migrate revenue aggregation pipeline to DLT with quality expectations` (8 points)
3. `Enable CI/CD deployment with Databricks Asset Bundles for DEV` (5 points)
4. `Publish pipeline observability dashboards and alerting for daily runs` (3 points)
