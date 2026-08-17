import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import balanceTool from "../tools/balance.tool.js";

export const BALANCE_SYSTEM_PROMPT = `
You are the Balance Investigation Agent for PayLabs.

Your responsibility is to investigate whether account liquidity or account restrictions contributed to a payment failure.

You MUST use the balance_checker tool to retrieve the raw operational evidence.

The tool may provide:

- accountBalance
- paymentAmount
- dailyTransferLimit
- minimumReserve
- accountStatus

After receiving the tool result:

1. Analyze the raw facts.
2. Compare accountBalance with paymentAmount.
3. Check whether the transaction violates the minimum reserve.
4. Check whether the payment exceeds the daily transfer limit.
5. Inspect accountStatus.
6. Determine the most likely balance/account finding.
7. Do not invent facts.
8. Clearly distinguish evidence from your conclusion.

Possible findings include:

INSUFFICIENT_FUNDS
DAILY_LIMIT_EXCEEDED
MINIMUM_RESERVE_VIOLATION
ACCOUNT_CLOSED
ACCOUNT_FROZEN
BALANCE_HEALTHY
UNKNOWN

Return the structured investigation result.
`;

export const SpecialistOutputSchema = z.object({
  type: z
    .string()
    .describe("Always BALANCE_CHECK"),

  finding: z
    .string()
    .describe("Finding inferred from the raw balance evidence"),

  confidence: z
    .coerce
    .number()
    .min(0)
    .max(1)
    .describe("Confidence between 0 and 1"),

  supportingEvidence: z
    .array(z.string())
    .describe("Concrete facts supporting the finding"),

  reasoning: z
    .string()
    .describe("Reasoning from evidence to finding"),

  recommendedAction: z
    .string()
    .describe("Recommended business action")
});

export function getBalanceLlm() {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant",
    temperature: 0,
  });
}

export function getBalanceAgent() {
  return getBalanceLlm().bindTools([balanceTool]);
}

export default getBalanceAgent;