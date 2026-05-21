# Worked Example — Splitting a 13-point Story

## Input — the oversized story

```text
TITLE:    Build self-service data quality monitoring for the warehouse
POINTS:   13
EPIC:     Data Reliability

As a data engineer, I want to monitor freshness, volume, schema, and null-rate of
the top 200 warehouse tables and get alerts when any check breaches threshold, so
that consumers can trust the data without ad-hoc spot checks.
```

The Data Reliability team flagged this as too large to estimate.

---

## Pattern selected

**P2 — Business Rule Variations.**

The story bundles four independent rule families (freshness, volume, schema, null-rate).
Each rule ships on its own and reduces ad-hoc spot checks for a subset of consumers, so
each slice is independently valuable. P1 (workflow steps) was considered but rejected —
the user journey is the same for every rule, so a workflow split would collapse to
horizontal slicing.

---

## Sub-story 1 of 3

```text
╔══════════════════════════════════════════════════════════════╗
║  AGILE STORY                                                 ║
╚══════════════════════════════════════════════════════════════╝

TITLE:      Add freshness monitoring for the top-200 warehouse tables with paging alerts
TYPE:       Story
PRIORITY:   High
POINTS:     5 — One rule family, instrumentation on existing observability stack, paging
            integration already exists.
LABELS:     data-quality, observability, warehouse
EPIC:       Data Reliability

──────────────────────────────────────────────────────────────
DESCRIPTION
──────────────────────────────────────────────────────────────

### Context & Background
Stale tables are the largest single cause of dashboard incidents. Freshness checks against
the top-200 tables cover ~85% of consumer queries and ship the most value first.

### User Story
As a data engineer on the Reliability team,
I want hourly freshness checks against the top-200 warehouse tables with paging when a
table is more than 2× its expected SLA stale,
So that consumers stop discovering staleness via failed dashboards.

### Scope — IN ✅
- Configure hourly freshness probe (max last-load-timestamp per table) for the 200 tables
  listed in the consumer-priority catalog.
- Compute per-table SLA from the existing freshness baseline table.
- Page on-call via existing PagerDuty service when stale_age > 2 × SLA.

### Scope — OUT ❌
- Volume, schema, and null-rate checks (delivered in sibling slices).
- Self-service UI to add/remove monitored tables (separate epic).

──────────────────────────────────────────────────────────────
ACCEPTANCE CRITERIA
──────────────────────────────────────────────────────────────

**AC1:** GIVEN the 200 catalog tables and their freshness SLAs are loaded WHEN the hourly
freshness job runs THEN every table receives a check result row and the job exits with
status SUCCESS.

**AC2:** GIVEN a table whose latest load timestamp is older than 2 × its SLA WHEN the
hourly freshness job evaluates it THEN a PagerDuty incident is opened tagged with the
table name and SLA breach delta.

**AC3:** GIVEN a freshness check is re-evaluated after remediation WHEN the latest load
timestamp returns within SLA THEN the open PagerDuty incident is auto-resolved within
one hour.

──────────────────────────────────────────────────────────────
TECHNICAL NOTES
──────────────────────────────────────────────────────────────

### Dependencies
| Type       | Reference                                      |
|------------|------------------------------------------------|
| Blocked by | None                                           |
| Blocks     | Sub-stories 2 and 3 (shared catalog loader)    |
| Input from | Data Governance (table priority catalog)       |

### Non-Functional Requirements
| Dimension     | Requirement                                                |
|---------------|------------------------------------------------------------|
| Performance   | Hourly job completes in under 5 minutes across 200 tables. |
| Security      | Uses read-only catalog role; no warehouse mutation rights. |
| Observability | Failure-rate metric in Grafana, alert if > 2 failures/day. |
```

---

## Sub-story 2 of 3

```text
╔══════════════════════════════════════════════════════════════╗
║  AGILE STORY                                                 ║
╚══════════════════════════════════════════════════════════════╝

TITLE:      Add row-volume anomaly detection for the top-200 warehouse tables
TYPE:       Story
PRIORITY:   High
POINTS:     5 — Reuses the catalog loader from slice 1; volume baseline computation is the
            main new effort.
LABELS:     data-quality, observability, warehouse
EPIC:       Data Reliability

──────────────────────────────────────────────────────────────
DESCRIPTION
──────────────────────────────────────────────────────────────

### Context & Background
Sudden row-count drops or spikes catch upstream pipeline bugs and source-system outages.
This slice extends the slice-1 instrumentation with volume checks against a rolling
baseline.

### User Story
As a data engineer on the Reliability team,
I want hourly row-volume checks comparing each table's load against its 14-day rolling
baseline with paging on > 30% deviation,
So that volume regressions are detected before they reach downstream marts.

### Scope — IN ✅
- Compute rolling 14-day mean and stddev of rows-per-load per monitored table.
- Page on-call when a load deviates by more than 30% from the rolling mean.
- Re-use the catalog and PagerDuty integration from sub-story 1.

### Scope — OUT ❌
- Schema and null-rate checks (sibling slice 3).
- Backfill of historical baselines beyond 14 days.

──────────────────────────────────────────────────────────────
ACCEPTANCE CRITERIA
──────────────────────────────────────────────────────────────

**AC1:** GIVEN at least 14 days of load history exists for a monitored table WHEN the
hourly volume job runs THEN a per-load deviation value is written for that table.

**AC2:** GIVEN a table load whose row count deviates more than 30% from the 14-day mean
WHEN the volume job evaluates it THEN a PagerDuty incident is opened tagged with the table
name, observed rows, and baseline mean.

**AC3:** GIVEN a table with fewer than 14 days of history WHEN the volume job evaluates it
THEN the check is skipped and a "warming-up" status is written rather than paging.

──────────────────────────────────────────────────────────────
TECHNICAL NOTES
──────────────────────────────────────────────────────────────

### Dependencies
| Type       | Reference                                      |
|------------|------------------------------------------------|
| Blocked by | Sub-story 1 (shared catalog + paging glue)     |
| Blocks     | None                                           |
| Input from | None                                           |

### Non-Functional Requirements
| Dimension     | Requirement                                                |
|---------------|------------------------------------------------------------|
| Performance   | Volume job completes in under 8 minutes across 200 tables. |
| Security      | Uses read-only role; no aggregation persisted to PII.      |
| Observability | Coverage metric (tables with ≥ 14d history) on dashboard.  |
```

---

## Sub-story 3 of 3

```text
╔══════════════════════════════════════════════════════════════╗
║  AGILE STORY                                                 ║
╚══════════════════════════════════════════════════════════════╝

TITLE:      Add schema-drift and null-rate checks for the top-200 warehouse tables
TYPE:       Story
PRIORITY:   Medium
POINTS:     5 — Two related rule families bundled; both consume the same Information
            Schema snapshot.
LABELS:     data-quality, observability, warehouse
EPIC:       Data Reliability

──────────────────────────────────────────────────────────────
DESCRIPTION
──────────────────────────────────────────────────────────────

### Context & Background
Schema drift and silent null-rate jumps are the slowest defects to detect today. This slice
closes the remaining two rule families using a daily Information Schema snapshot.

### User Story
As a data engineer on the Reliability team,
I want daily schema-drift and null-rate checks against the top-200 tables with paging on
breaking changes,
So that contract regressions are caught before consumers raise tickets.

### Scope — IN ✅
- Snapshot Information Schema (columns, types, nullability) daily; diff against last
  snapshot.
- Compute per-column null rate against 14-day baseline; page on > 10pp absolute increase.
- Page only for breaking schema changes (column drop, type narrowing, nullability flip).

### Scope — OUT ❌
- Freshness and volume monitoring (delivered in slices 1 and 2).
- Auto-remediation or schema-rollback workflows.

──────────────────────────────────────────────────────────────
ACCEPTANCE CRITERIA
──────────────────────────────────────────────────────────────

**AC1:** GIVEN a previous-day schema snapshot exists WHEN the daily snapshot job runs
THEN a row-level diff is written for every monitored table and the job exits SUCCESS.

**AC2:** GIVEN a column is dropped, its type narrowed, or its nullability flipped between
snapshots WHEN the schema check evaluates the diff THEN a PagerDuty incident is opened
tagged as a breaking change.

**AC3:** GIVEN a column whose null rate exceeds its 14-day mean by more than 10 percentage
points WHEN the null-rate job runs THEN a PagerDuty incident is opened tagged with column
name, observed null rate, and baseline.

──────────────────────────────────────────────────────────────
TECHNICAL NOTES
──────────────────────────────────────────────────────────────

### Dependencies
| Type       | Reference                                      |
|------------|------------------------------------------------|
| Blocked by | Sub-story 1 (shared catalog + paging glue)     |
| Blocks     | None                                           |
| Input from | Data Contracts (definition of breaking change) |

### Non-Functional Requirements
| Dimension     | Requirement                                                |
|---------------|------------------------------------------------------------|
| Performance   | Daily job completes in under 15 minutes for 200 tables.    |
| Security      | Snapshot tables stored in governed schema with RBAC.       |
| Observability | Snapshot coverage and diff counts on Grafana dashboard.    |
```

---

## Split summary

```text
──────────────────────────────────────────────────────────────
SPLIT SUMMARY
──────────────────────────────────────────────────────────────
Pattern used: P2 — Business Rule Variations

| # | Title                                                            | Pattern | Points |
|---|------------------------------------------------------------------|---------|--------|
| 1 | Add freshness monitoring for top-200 tables with paging          | P2      | 5      |
| 2 | Add row-volume anomaly detection for top-200 tables              | P2      | 5      |
| 3 | Add schema-drift and null-rate checks for top-200 tables         | P2      | 5      |

Original estimate: 13 points
New total:         15 points
Why the totals differ: each slice carries its own integration-test setup against
PagerDuty, and the catalog loader is invoked three times in CI. The extra two points
buy independent deployability — slices 2 and 3 can ship without re-running the slice 1
release.
```

---

## INVEST validation

```text
──────────────────────────────────────────────────────────────
INVEST VALIDATION
──────────────────────────────────────────────────────────────
| # | I | N | V | E | S | T | Flags                                                |
|---|---|---|---|---|---|---|------------------------------------------------------|
| 1 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | —                                                    |
| 2 | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | Blocked by #1's catalog loader; sequenced not        |
|   |   |   |   |   |   |   | strictly independent.                                |
| 3 | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | Same shared catalog dependency on #1.                |
```

I — Independent · N — Negotiable · V — Valuable · E — Estimable · S — Small · T — Testable

The independence warnings on slices 2 and 3 are acceptable: the shared catalog loader is
delivered by slice 1 and is not duplicated. If slice 1 slips, the team should pull the
catalog loader out into its own enabler story rather than block the rule families.
