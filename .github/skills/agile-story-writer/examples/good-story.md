╔══════════════════════════════════════════════════════════════╗
║  AGILE STORY                                                 ║
╚══════════════════════════════════════════════════════════════╝

TITLE:      Migrate daily revenue aggregation pipeline to Databricks DLT for reliable DEV deployment
TYPE:       Story
PRIORITY:   High
POINTS:     8 — Migration spans orchestration, data quality rules, and environment deployment validation.
LABELS:     data-engineering, databricks, dlt, migration, redshift
EPIC:       Platform Modernisation

──────────────────────────────────────────────────────────────
DESCRIPTION
──────────────────────────────────────────────────────────────

### Context & Background
The platform team currently runs daily revenue aggregation in Redshift with limited built-in quality enforcement and fragile deployment controls. As part of platform modernisation, this workload must move to Databricks Delta Live Tables (DLT) to improve data reliability and release consistency. This story enables the first production-grade DEV rollout using Databricks Asset Bundles with explicit expectations.

### User Story
As a data engineer on the platform team,
I want to migrate the daily revenue aggregation job from Redshift to a Databricks DLT pipeline,
So that we can enforce data quality expectations and deploy repeatably to DEV with lower operational risk.

### Scope — IN ✅
- Implement Databricks DLT pipeline for daily revenue aggregation with source-to-target transformations equivalent to the current Redshift job.
- Define and enforce DLT expectations for null checks, duplicate prevention, and revenue amount validity.
- Configure Databricks Asset Bundles for automated deployment to the DEV workspace.
- Add run-level monitoring outputs (pipeline status, failed expectation counts) for DEV validation.

### Scope — OUT ❌ (explicitly excluded)
- Migration of downstream BI dashboards to new table names.
- UAT or production deployment of the DLT pipeline.
- Redesign of revenue business logic beyond parity with current aggregation rules.

──────────────────────────────────────────────────────────────
ACCEPTANCE CRITERIA
──────────────────────────────────────────────────────────────

**AC1:** GIVEN the Databricks DEV workspace and source datasets are accessible WHEN the DLT pipeline is triggered for a scheduled daily run THEN it completes successfully and writes aggregated revenue to the target Delta table with the expected partition for the run date.

**AC2:** GIVEN input data containing null `customer_id`, duplicate transaction records, or negative revenue values WHEN the DLT pipeline processes the batch THEN configured DLT expectations quarantine or fail invalid records according to rule severity and emit expectation metrics in pipeline output.

**AC3:** GIVEN the Databricks Asset Bundle configuration in the repository WHEN `databricks bundle deploy -t dev` is executed THEN all declared resources deploy without manual workspace edits and the deployment command exits with status code 0.

**AC4:** GIVEN equivalent source data for one historical day in Redshift and Databricks WHEN aggregation outputs are compared THEN total daily revenue differs by no more than 0.1% and any variance is documented in the run notes.

──────────────────────────────────────────────────────────────
TECHNICAL NOTES
──────────────────────────────────────────────────────────────

### Approach
- Model Bronze/Silver/Gold layers in DLT, with quality expectations applied at Silver and final daily aggregation materialized in Gold.
- Keep SQL transformation logic parity with existing Redshift job and document any engine-specific adaptations.
- Use Databricks Asset Bundles target `dev` for environment-specific workspace paths and pipeline IDs.

### Dependencies
| Type       | Reference                                |
|------------|------------------------------------------|
| Blocked by | DE-4121 (DEV service principal access)   |
| Blocks     | AN-2240 (Finance revenue dashboard swap) |
| Input from | Finance Analytics Team (variance review) |

### Non-Functional Requirements
| Dimension     | Requirement                                                                 |
|---------------|-----------------------------------------------------------------------------|
| Performance   | Daily pipeline completes within 30 minutes for up to 50 million rows/day.   |
| Security      | No plaintext secrets in configs; credentials resolved from Databricks scope.|
| Observability | Expose pipeline run status and expectation-failure counts in DEV dashboard. |

──────────────────────────────────────────────────────────────
DEFINITION OF READY ✅
──────────────────────────────────────────────────────────────
- [x] Title starts with an action verb and is specific
- [x] User story names a real persona with a measurable outcome
- [x] ACs are testable (GIVEN/WHEN/THEN), minimum 3
- [x] Scope IN and OUT are explicitly defined
- [x] Dependencies are identified
- [x] Story is estimated (points + rationale)

──────────────────────────────────────────────────────────────
DEFINITION OF DONE ✅
──────────────────────────────────────────────────────────────
- [x] Code reviewed and approved (minimum 1 approver)
- [x] Unit tests written and passing (coverage ≥ 80%)
- [x] Integration tests passing in CI/CD pipeline
- [x] Documentation updated (README / Confluence / runbook)
- [x] Deployed to DEV or UAT and smoke tested
- [x] All ACs signed off by PO or requester
- [x] No unresolved critical or high severity lint/security issues
