# Humanizing Work Story Splitting Patterns

Reference card for the eight split patterns popularised by Richard Lawrence and Peter
Green at Humanizing Work. Apply them in order — stop at the first pattern that yields
2–5 vertically-sliced, sprint-sized sub-stories.

A vertical slice changes behaviour visible to the named persona. If a slice cannot ship on
its own and produce value, it is not a valid story.

---

## P1 — Workflow Steps

**One-line:** The story spans a sequential user journey; deliver one step at a time.

**Ask:** "What ordered steps does the persona move through to reach the outcome? Can each
step ship as its own thin slice?"

**Before — 13 points**
- "Build customer onboarding flow" covering: identity check → KYC questionnaire → bank
  account verification → first deposit → welcome email.

**After — three slices**
1. Capture identity and KYC answers (persist + show success) — 5 pts
2. Verify linked bank account through provider callback — 5 pts
3. Trigger welcome email on first qualifying deposit event — 3 pts

**Pitfall:** Don't split into UI vs API vs DB — that is horizontal slicing. Each workflow
slice must change end-to-end behaviour for the persona.

---

## P2 — Business Rule Variations

**One-line:** The story bundles several rule scenarios; ship the simplest rule first.

**Ask:** "Which rule covers the largest, simplest population? Can each rule variant ship
independently and add value on its own?"

**Before — 13 points**
- "Calculate sales commission" covering: standard tier, accelerator on quota over-attainment,
  team override for leads, clawback on returned orders.

**After — three slices**
1. Calculate standard tier commission for individual sellers — 5 pts
2. Add accelerator multiplier when quota attainment > 100% — 3 pts
3. Apply clawback when an order is returned within 90 days — 5 pts

**Pitfall:** Don't write four slices that share the same "so that" clause. If they all
unlock the same outcome, they are tasks. Find a different value driver per rule.

---

## P3 — Data Variations

**One-line:** The same logic handles many data shapes; ship the dominant shape first.

**Ask:** "Which data variant covers the 80% case? Which can be deferred without blocking
the dominant value?"

**Before — 13 points**
- "Ingest partner sales feeds" covering CSV, JSON, XML, and EDI 850 formats from 12
  partners.

**After — three slices**
1. Ingest CSV sales feeds from the top-five partners (covers 78% of volume) — 5 pts
2. Add JSON feed parser for the four mid-tier partners — 5 pts
3. Add EDI 850 parser for the three legacy retail partners — 8 pts

**Pitfall:** Don't split by "happy path / edge cases" if the edge cases are required for
the persona to use the feature at all. Edge cases that block real users belong in the same
slice.

---

## P4 — Acceptance Criteria Complexity

**One-line:** The story has many WHEN/THEN pairs that each represent meaningful value.

**Ask:** "Which AC would the persona pay for in isolation? Which ACs only matter once a
prior AC is shipped?"

**Before — 13 points** — a single story with 9 ACs covering search, filter, sort,
pagination, saved searches, shareable URLs, export, email digest, and audit log.

**After — three slices**
1. Search and filter results (ACs 1–3) — 5 pts
2. Sort, paginate, and shareable URL (ACs 4–6) — 5 pts
3. Saved searches, export to CSV, and audit log (ACs 7–9) — 5 pts

**Pitfall:** Don't keep all ACs in one story to "preserve coherence". If three ACs are
shippable without the other six, they should be three separate stories.

---

## P5 — Major Effort

**One-line:** A single technical milestone is large but can ship in incremental layers.

**Ask:** "Is there a thin end-to-end layer we can ship first, then enrich? Bronze →
Silver → Gold is the classic data-platform shape."

**Before — 13 points**
- "Build customer 360 mart on Databricks" delivering 24 attributes across 6 source systems.

**After — three slices**
1. Bronze ingestion of all 6 source systems with raw delta tables — 5 pts
2. Silver-layer joins producing 8 high-priority attributes for finance — 5 pts
3. Gold-layer mart with full 24 attributes published to BI — 8 pts

**Pitfall:** Don't deliver "all of Bronze, all of Silver, all of Gold" as three slices —
that is horizontal slicing. Each slice must change behaviour for a real consumer.

---

## P6 — External Dependencies

**One-line:** The work spans a third-party / API / vendor boundary; carve along it.

**Ask:** "What can we deliver against a stub or sandbox while the real dependency is being
provisioned, and what truly requires the real integration?"

**Before — 13 points**
- "Integrate payment processor for refunds" requires vendor sandbox keys (in legal review),
  callback signature library, and reconciliation report.

**After — three slices**
1. Implement refund flow against vendor sandbox stub with contract tests — 5 pts
2. Replace stub with real vendor sandbox once keys are provisioned — 3 pts
3. Add reconciliation report comparing vendor settlement file to internal ledger — 5 pts

**Pitfall:** Don't park the entire story behind the dependency. The carve-off lets the team
make progress on everything that does not require the real vendor.

---

## P7 — DevOps Steps

**One-line:** Deployment or infrastructure work splits along environment / platform
boundaries.

**Ask:** "Which environment, region, or platform unlocks the most value first? Can the
control plane and the data plane ship separately?"

**Before — 13 points**
- "Roll out new feature flag service to all environments and regions" covering DEV, UAT,
  PROD across EU and US.

**After — three slices**
1. Deploy feature flag service to DEV in EU with SDK smoke tests — 5 pts
2. Promote to UAT in EU with SLO instrumentation — 3 pts
3. Promote to PROD in EU and US with rollout playbook — 5 pts

**Pitfall:** Don't split into "set up Terraform / write Helm chart / deploy to cluster" —
those are tasks, not stories. Each slice should land a working environment that someone
can actually use.

---

## P8 — Tiny Acts of Discovery (TADs)

**One-line:** Unknowns block sizing; spend a small time-box answering one question.

**Ask:** "What is the single most expensive unknown right now? What experiment, prototype,
or measurement would unblock estimation?"

**Before — 13 points**
- "Migrate ML feature store from in-house cache to vendor feature platform" with unknown
  latency under production load.

**After — two slices**
1. Spike: benchmark vendor feature platform p95 read latency under shadow traffic — 3 pts
2. Migrate top-five online models to vendor feature platform with rollback plan — 8 pts

**Pitfall:** Don't use TADs as a substitute for delivery. A TAD always feeds a follow-up
delivery story; never let a TAD ship alone as the "solution".

---

## Cross-pattern: choosing between candidates

If two patterns look applicable, prefer in this order:

1. P1 (Workflow steps) — it almost always produces independently valuable slices.
2. P2 / P3 — they segment by population, which preserves Independence.
3. P5 (Major effort) — when the team needs a thin end-to-end layer fast.
4. P4 — when the existing story is AC-heavy and the ACs ship independently.
5. P6 / P7 — when the boundary is technical or organisational.
6. P8 — only when an unknown genuinely blocks estimation.

If none of the eight apply, the input is probably already small enough — re-check the
estimate before splitting further.
