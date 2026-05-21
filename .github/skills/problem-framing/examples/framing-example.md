# Worked Example — "Make the pipeline faster"

## Scenario

The platform engineering team receives this Slack message from a finance VP:

> "The reporting pipeline is too slow. Can we make it faster? Maybe spin up a bigger
> cluster?"

The team is tempted to immediately resize the cluster. Instead they invoke
`/problem-framing` before writing any stories.

---

## Phase 1 — Look Inward

### Q1. What is the problem? Describe symptoms, not solutions

> **Facilitator:** Hold off on the cluster. What are we observing going wrong?
>
> **Team:** The daily revenue close report is landing in finance's inbox at 09:40
> instead of the committed 07:00. Finance has to either delay their morning standup or
> work from stale numbers. This has happened on 14 of the last 20 business days.

*Restated: revenue close report lands ~2h 40m late on most weekdays, forcing finance
to choose between delay and staleness.* ✅

### Q2. Why hasn't it been solved yet?

> **Team:** It crept in gradually as ingestion volume grew — nobody owns end-to-end
> pipeline performance, so each team optimised their own stage and the cumulative
> regression went unnoticed (systemic + authority gap). Also no SLA was ever formally
> written down, so nobody could point at "broken".

*Restated: gradual onset, no end-to-end owner, no formal SLA = both systemic and
authority gap.* ✅

### Q3. How might we (or our team) be part of the problem?

> **Team:** We've been treating every slowdown as an infra problem — "throw more compute
> at it" — without looking at whether the upstream transformations have grown more
> expensive. Our default mental model is "scale up", which is solution-first and is
> exactly what the VP's note assumed too.

*Restated: team's bias is "scale up first"; mirrors the VP's framing, so neither side has
challenged the underlying transformation logic.* ✅

---

## Phase 2 — Look Outward

### Q4. Who experiences this problem? When, where, what consequences?

> **Team:** Finance analysts (4 of them) every weekday morning between 07:00 and 09:30.
> The consequence is either a delayed standup (loss of decision time) or decisions made
> against the prior day's close (revenue mis-attribution risk during month-end).

*Restated: 4 finance analysts daily 07:00–09:30; consequence is delayed decisions or
mis-attributed revenue at month-end.* ✅

### Q5. Who else has this problem? Who doesn't have it — and what's different about them?

> **Team:** The EMEA finance team has the same pipeline but doesn't feel the pain
> because their morning starts at 09:00 UK — by then the report has landed. The
> marketing analytics team uses a separate pipeline that runs hourly and isn't
> affected. The differentiator is *batch cadence vs. expected freshness window*, not
> infrastructure size.

*Restated: EMEA insulated by timezone; marketing insulated by a different (hourly)
pipeline pattern. The real differentiator is cadence vs. freshness expectation, not
compute.* ✅

### Q6. Who has been left out? Who benefits when the problem exists or is solved?

> **Team:** Nobody talked to the upstream POS engineering team whose late-arriving
> records trigger the longest transformation stage — they have been outside the
> conversation. The status quo benefits the POS team (no pressure to send earlier) and
> hurts finance. A solved state would also help month-end auditors who currently chase
> the same stale numbers.

*Restated: POS engineering team has been excluded; their late records drive the slowest
stage. Month-end auditors are an overlooked beneficiary.* ✅

---

## Phase 3 — Reframe

### Q7. Refined problem statement

> **Drafted:**
> The problem is: **finance analysts** struggle to **publish the 07:00 revenue close
> report on time** because **the longest transformation stage waits on POS records that
> arrive 90+ minutes late and no end-to-end SLA owner exists**, which leads to **delayed
> standups and risk of revenue mis-attribution at month-end**. This disproportionately
> affects **the AMER finance team and month-end auditors** and has been overlooked
> because **the platform team defaults to "scale up the cluster" instead of looking
> upstream**.
>
> **Team:** Approved.

### Q8. How Might We statement

> **Drafted:**
> How might we **shift the bottleneck upstream of the revenue pipeline** as we aim to
> **deliver the daily close report to finance by 07:00 on at least 19 of every 20
> business days**?
>
> **Team:** Approved.

---

## Filled Canvas

```text
╔══════════════════════════════════════════════════════════════╗
║  PROBLEM FRAMING CANVAS                                      ║
╚══════════════════════════════════════════════════════════════╝

PHASE 1 — LOOK INWARD
─────────────────────
Problem (symptoms):       Daily revenue close report lands at ~09:40 instead of the
                          committed 07:00; 14 of last 20 business days.
Why unsolved:             Gradual onset; no end-to-end pipeline owner; no formal SLA
                          (systemic + authority gap).
Our assumptions / bias:   Default "scale up the cluster" framing; mirrors the VP's
                          note. Neither side has challenged transformation logic.

PHASE 2 — LOOK OUTWARD
──────────────────────
Who experiences it:       Four AMER finance analysts; weekdays 07:00–09:30; consequence
                          is delayed standups or revenue mis-attribution at month-end.
Who else / who not:       Same pain for AMER not for EMEA (timezone); marketing analytics
                          insulated by an hourly pipeline pattern. Real differentiator
                          is cadence vs. freshness expectation, not compute size.
Left out / beneficiaries: POS engineering team excluded — their late records drive the
                          slowest stage. Month-end auditors are an overlooked beneficiary
                          of solving it.

PHASE 3 — REFRAME
─────────────────
Problem statement:        Finance analysts struggle to publish the 07:00 revenue close
                          report on time because the longest transformation stage waits
                          on POS records that arrive 90+ minutes late and no end-to-end
                          SLA owner exists, which leads to delayed standups and risk of
                          revenue mis-attribution at month-end. This disproportionately
                          affects the AMER finance team and month-end auditors and has
                          been overlooked because the platform team defaults to "scale
                          up the cluster" instead of looking upstream.
How Might We:             How might we shift the bottleneck upstream of the revenue
                          pipeline as we aim to deliver the daily close report to
                          finance by 07:00 on at least 19 of every 20 business days?

──────────────────────────────────────────────────────────────
NEXT STEP
──────────────────────────────────────────────────────────────
Use the HMW statement as input to /agile-story-writer to generate
the first story for this problem space.
```

---

## What the team would have built without framing

Resize the Databricks cluster, fail to move the 07:00 SLA, then resize it again. Cost:
~$18k/month, zero benefit.

## What the team built after framing

The HMW pointed at the POS team. The first story written by `/agile-story-writer` was:

> *Negotiate and instrument a 06:00 POS export SLA with monitoring and breach paging.*

That one story, plus a second to parallelise the dependent transformation stage, moved
the 07:00 SLA hit rate from 30% to 95% — and the cluster size never changed.
