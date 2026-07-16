             Payment Failed

                    │

          Classifier Agent

      ┌─────────┼────────────┐

Beneficiary   Network      Balance

      │          │             │

      └─────Evidence───────────┘

              │

       Decision Agent

      ┌───────┼────────┐

Retry  Escalate  Notify




                         API

                          │

                   Express Server

                          │

               Payment Exception API

                          │

                     LangGraph

                          │

        ┌──────────────┬───────────────┐
        │              │               │
 Investigation   Planner Agent   Memory State
        │
        ▼
 ┌──────────────┬─────────────┬─────────────┬────────────┐
 │              │             │             │            │
Beneficiary  Balance     Network     Compliance   Duplicate
   Agent       Agent       Agent         Agent        Agent
        └──────────────┬───────────────┘
                       ▼
              Evidence Aggregator
                       ▼
               Decision Agent
             ┌─────────┴──────────┐
             ▼                    ▼
      Auto Resolution      Human Escalation
             │                    │
             └─────────┬──────────┘
                       ▼
             Audit + PostgreSQL