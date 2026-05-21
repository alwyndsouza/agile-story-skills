# Agile Story Format Guide

## TITLE

**Rule:**
Use: `[Action Verb] + [What] + [For/To] + [Outcome or System]`

**Approved action verbs:**
Build, Create, Migrate, Fix, Refactor, Add, Remove, Expose, Validate, Enable, Deprecate

### Bad vs Good title examples

| Bad Title | Why It Fails | Good Title |
|---|---|---|
| Update data | No action detail, no system, no outcome | Migrate customer revenue mart to Databricks DLT for daily finance reporting |
| Fix bug | Missing defect context and impacted area | Fix duplicate order events in checkout stream to prevent double billing |
| Pipeline work | Not specific, cannot estimate reliably | Refactor nightly returns pipeline to reduce retry failures in DEV |
| Improve dashboard | Subjective and broad | Add load-time caching for finance KPI dashboard to keep p95 < 2s |

## TYPE

| Type | Use When |
|---|---|
| Story | Delivering end-user or stakeholder value with defined outcome and acceptance criteria. |
| Bug | Correcting observed behavior that deviates from expected functionality. |
| Task | Performing implementation/maintenance work that supports delivery but may not be user-facing. |
| Spike | Time-boxed investigation to reduce uncertainty before committing to full implementation. |

## STORY POINTS (Fibonacci)

| Points | Complexity Signals |
|---|---|
| 1 | Tiny, low-risk change in one component with straightforward validation. |
| 2 | Small change with minor testing and one dependency touchpoint. |
| 3 | Moderate change spanning one service/module plus clear acceptance boundaries. |
| 5 | Multi-step implementation with cross-team coordination or non-trivial testing. |
| 8 | Migration/integration effort with several dependencies and risk management needs. |
| 13 | Too large for a story; usually an epic candidate that should be split. |

## ACCEPTANCE CRITERIA

### GIVEN / WHEN / THEN breakdown
- **GIVEN**: Initial state, preconditions, or required context.
- **WHEN**: Trigger action, event, or execution step.
- **THEN**: Objective and testable result with clear pass/fail behavior.

### Banned phrases and fixes

| Banned Phrase | Why Banned | Better Alternative |
|---|---|---|
| should work correctly | Subjective and undefined | returns HTTP 200 and persists record in target table |
| data should be accurate | No threshold or comparison basis | variance against source total is <= 0.1% |
| UI should be fast | No measurable performance target | p95 page load is <= 2 seconds for 30-day filter |
| handle errors gracefully | Ambiguous behavior | logs structured error and returns user-safe message without stack trace |

## SCOPE OUT (Mandatory)

Scope OUT prevents accidental expansion, protects sprint commitments, and improves estimation accuracy.
Every story must include explicit exclusions, even when scope is uncertain.

### Fallback OUT items when uncertain
1. "UAT and production rollout are excluded from this story."
2. "No changes to downstream dashboards/reports in this implementation."
3. "No schema redesign beyond fields required for stated acceptance criteria."

## NON-FUNCTIONAL REQUIREMENTS

| Dimension | What to Specify | Example Values |
|---|---|---|
| Performance | Throughput, latency, SLA/SLO, batch duration | API p95 < 200ms; pipeline completes < 30 min |
| Security | Data handling, secrets, access controls, logging constraints | PII masked in logs; no plaintext credentials; least-privilege roles |
| Observability | Metrics, logs, tracing, alert thresholds | Add failure-rate metric and alert when error rate > 2% for 10 min |
