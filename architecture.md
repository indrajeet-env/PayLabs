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
                      ▼

               Express Server

                      │
                      ▼

          POST /investigate/:reference

                      │
                      ▼

          Fetch Payment Context (Repository)

                      │
                      ▼

                LangGraph State

                      │
                      ▼

                Planner Agent

                      │
      ┌───────────────┼────────────────┐
      │               │                │
      ▼               ▼                ▼

 Balance Agent   Network Agent   Compliance Agent
      │               │                │
      └───────────────┼────────────────┘
                      │
                      ▼
              Duplicate Agent
                      │
                      ▼
            Evidence Aggregator
                      │
                      ▼
               Decision Agent
             ┌────────┴─────────┐
             ▼                  ▼
      Auto Resolution     Human Escalation
             │                  │
             └────────┬─────────┘
                      ▼
             Audit + PostgreSQL