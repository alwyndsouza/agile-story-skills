# Worked Example — Sprint Goal for a Data Platform Sprint

## Input — six committed stories

The platform team is planning Sprint 24. PO and tech lead paste these six committed
stories into `/sprint-goal-writer`:

1. **Add freshness monitoring for the top-200 warehouse tables with paging alerts** (5 pts)
   *As a data engineer on the Reliability team, I want hourly freshness checks across the
   top-200 tables with paging when stale > 2× SLA, so consumers stop discovering staleness
   via failed dashboards.*

2. **Add row-volume anomaly detection for the top-200 warehouse tables** (5 pts)
   *As a data engineer on the Reliability team, I want hourly volume checks against a 14d
   rolling baseline with paging on > 30% deviation, so volume regressions are detected
   before they reach downstream marts.*

3. **Publish data-quality status dashboard for downstream consumers** (3 pts)
   *As a BI tool maintainer, I want a public dashboard showing per-table freshness and
   volume health, so I can decide whether to suppress dashboards on a bad day.*

4. **Add Bronze→Silver join coverage for finance attributes** (5 pts)
   *As an analytics engineer on the Finance team, I want the customer-360 mart Silver
   layer to cover the eight finance attributes, so the morning revenue close can be
   reproduced from the new mart.*

5. **Onboard POS engineering team to the 06:00 SLA paging channel** (2 pts)
   *As a DevOps engineer, I want POS engineering on the same paging rotation, so SLA
   breaches reach the upstream owner not just the platform team.*

6. **Refactor warehouse-monitor configs into a shared Terraform module** (3 pts)
   *As a platform architect, I want monitor configs declared in a single shared module,
   so future check additions don't require copy-paste across pipelines.*

Total commitment: **23 points** (team velocity 22 ± 3).

---

## Step 1 — Common thread

Five of six stories advance the same outcome: **the team's ability to detect and
respond to warehouse data-quality issues before consumers do**.

- Stories 1, 2, 3 expose checks and visibility.
- Story 5 puts the breach in front of the upstream owner.
- Story 4 is a parallel finance-mart effort with no link to data-quality detection.
- Story 6 is an enabler — it improves how future checks are added, but ships no
  consumer-visible change this sprint.

---

## Step 2 — Draft three goal options

1. **Detect warehouse data-quality breaches before consumers do, for finance and BI
   stakeholders, so that incident discovery shifts from dashboards-failing to platform
   paging on at least 80% of breaches.**

2. **Cover the top-200 warehouse tables with freshness and volume monitoring so the
   Reliability team has a complete observability surface by sprint end.**

3. **Establish the warehouse data-quality control plane (checks + dashboard + upstream
   paging) so finance and BI consumers can trust morning data without ad-hoc spot
   checks.**

---

## Step 3 — Recommended option

**Option 3** is recommended. It covers stories 1, 2, 3, and 5 (~13 of 23 pts) and gives
the team a clean daily trade-off lever: *if a story drifts, does it still leave consumers
with a usable control plane?* — story 6 (Terraform refactor) and story 4 (finance Silver
layer) are visibly outside that lever, which is the correct signal.

Option 1 was strong but pre-commits to an 80% threshold the team cannot measure mid-sprint.
Option 2 is feature-shaped, not outcome-shaped — finishing it doesn't tell anyone whether
trust improved.

---

## Output

```text
╔══════════════════════════════════════════════════════════════╗
║  SPRINT GOAL                                                 ║
╚══════════════════════════════════════════════════════════════╝

GOAL:       Establish the warehouse data-quality control plane — checks, dashboard, and
            upstream paging — for finance and BI consumers so that morning data can be
            trusted without ad-hoc spot checks.

RATIONALE:  Five of six stories converge on a single observable outcome (consumers stop
            doing manual spot checks), giving the team a clear lever: any story that
            doesn't shrink spot-check load is a candidate to defer.

STORIES IN SCOPE:
- Add freshness monitoring for top-200 tables — contributes because it produces the
  first detection signal consumers can rely on.
- Add row-volume anomaly detection for top-200 tables — contributes because it covers
  the second highest-impact regression mode.
- Publish data-quality status dashboard — contributes because it lets BI maintainers
  decide whether to suppress dashboards proactively.
- Onboard POS engineering to 06:00 SLA paging — contributes because it puts the breach
  in front of the upstream owner, closing the loop.

STORIES THAT DON'T FIT THIS GOAL:
- Add Bronze→Silver join coverage for finance attributes — recommend tracking as a
  separate finance-mart parallel; it ships value but doesn't move the control-plane
  lever.
- Refactor warehouse-monitor configs into shared Terraform module — recommend keeping
  as an enabler with no consumer-visible outcome; if the sprint comes under pressure,
  it should be the first to defer.

ALTERNATIVES CONSIDERED:
1. Detect warehouse data-quality breaches before consumers do, with at least 80% of
   breaches caught via paging — strong but the 80% threshold can't be measured mid-sprint.
2. Cover the top-200 warehouse tables with freshness and volume monitoring — too
   feature-shaped; "done" doesn't mean "trusted".

──────────────────────────────────────────────────────────────
SPRINT GOAL HEALTH CHECK
──────────────────────────────────────────────────────────────
- [x] Single sentence, not a list
- [x] Names who benefits (finance + BI consumers)
- [x] Outcome-based, not feature-based ("morning data trusted")
- [x] Achievable within one sprint (13/23 pts on goal-critical work)
- [x] Team can use it to make daily trade-off decisions (lever: shrinks spot-check load?)
```

---

## How the team uses this mid-sprint

Day 6 of the sprint, the volume-anomaly story (story 2) hits an unexpected snag in the
14-day baseline backfill. The team checks the goal:

> *Does shipping freshness + dashboard + upstream paging without volume detection still
> establish a control plane consumers can trust?*

Answer: partially — freshness covers the largest regression class but not the second. The
team decides to push volume monitoring into Sprint 25 rather than swap it for the
finance-Silver-layer story, because the latter doesn't advance the goal at all. Without
the sprint goal, the obvious move (swap in any unblocked story) would have been the wrong
one.
