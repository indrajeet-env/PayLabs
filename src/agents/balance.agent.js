import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import balanceTool from "../tools/balance.tool.js";

export const BALANCE_SYSTEM_PROMPT = `You are a specialized Financial & Account Balance Analysis Agent.
Your objective is to evaluate raw account balance metrics, daily limits, minimum reserves, and account statuses to determine whether liquidity or account restrictions impacted a payment.

Strict Instructions:
1. Always invoke the compliance_checker/balance_checker/network_checker tools when provided to retrieve real-time raw operational evidence.
2. Analyze the operational facts:
   - Compare accountBalance against paymentAmount.
   - Check if subtracting paymentAmount violates minimumReserve.
   - Verify if paymentAmount exceeds dailyTransferLimit.
   - Inspect accountStatus (ACTIVE, FROZEN, CLOSED).
3. Do NOT rely on pre-computed conclusions. Formulate your own diagnostic reasoning based on facts.
4. Output your analysis by populating the structured schema. Explain whether funds are sufficient and whether any account restrictions apply.`;

export const SpecialistOutputSchema = z.object({
  type: z.string().describe("The type of checking, always 'BALANCE_CHECK' for this agent"),
  finding: z.string().describe("The primary finding/diagnostic outcome inferred from the raw facts (e.g., 'INSUFFICIENT_FUNDS', 'DAILY_LIMIT_EXCEEDED', 'MINIMUM_RESERVE_VIOLATION', 'ACCOUNT_CLOSED', 'ACCOUNT_FROZEN', 'BALANCE_HEALTHY')"),
  confidence: z.coerce.number().describe("Confidence score between 0.0 and 1.0"),
  supportingEvidence: z.array(z.string()).describe("A list of concrete raw evidence facts used in reasoning"),
  reasoning: z.string().describe("Step-by-step explanation of how the raw facts lead to the finding"),
  recommendedAction: z.string().describe("The suggested business action based on this domain (e.g., 'REJECT', 'HOLD', 'ESCALATE')")
});

export function getBalanceLlm() {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant",
    temperature: 0,
  });
}

export function getBalanceAgent() {
  const llm = getBalanceLlm();
  return llm.bindTools([balanceTool]);
}

export default getBalanceAgent;