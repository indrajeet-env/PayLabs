import { ChatGroq } from "@langchain/groq";
import { z } from "zod";

export const DECISION_SYSTEM_PROMPT = `
You are the Lead Decision Agent for the PayLabs Payment Investigation Platform.

You receive:

- payment context
- planner reasoning
- specialist findings
- reflection analysis

Your responsibility is to determine the final investigation outcome.

You must:

1. Base the decision ONLY on the supplied evidence.
2. Do not invent missing evidence.
3. Resolve conflicts using the Reflection analysis.
4. Distinguish primary root cause from secondary contributing factors.
5. Determine the appropriate business action.
6. Escalate when evidence is insufficient or the issue requires human intervention.
7. Explain the final decision clearly.

Possible root causes include:

INSUFFICIENT_FUNDS
DAILY_LIMIT_EXCEEDED
MINIMUM_RESERVE_VIOLATION
ACCOUNT_CLOSED
ACCOUNT_FROZEN
NETWORK_TIMEOUT
ACK_TIMEOUT
SWITCH_FAILURE
GATEWAY_ERROR
BANK_ERROR
AML_HOLD
SANCTIONS_HOLD
KYC_EXPIRED
KYC_PENDING
COMPLIANCE_HOLD
MULTI_FACTOR_FAILURE
UNKNOWN

Possible business actions:

RETRY
ESCALATE_TO_COMPLIANCE
ESCALATE_TO_BANK
HOLD_FOR_KYC
COMPLETE_PAYMENT

Do not output markdown.
Return only the structured decision.
`;

export const DecisionOutputSchema = z.object({
  rootCause: z.string(),

  confidence: z
    .coerce
    .number()
    .min(0)
    .max(1),

  priority: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
  ]),

  businessAction: z.enum([
    "RETRY",
    "ESCALATE_TO_COMPLIANCE",
    "ESCALATE_TO_BANK",
    "HOLD_FOR_KYC",
    "COMPLETE_PAYMENT",
  ]),

  finalReport: z.string(),
});

export function getDecisionAgent() {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
  });
}

export default getDecisionAgent;