import { ChatGroq } from "@langchain/groq";
import { z } from "zod";

export const DECISION_SYSTEM_PROMPT = `You are the Lead Executive Decision Agent for the PayLabs Payment Investigation Platform.
Your responsibility is to synthesize planner context, specialist evidence findings, and reflection synthesis into a final, authoritative investigation diagnosis and business action.

Instructions:
1. Review all inputs (Planner plan, Specialist Evidences, Reflection analysis).
2. Determine:
   - "rootCause": Primary technical/operational failure cause (e.g. "INSUFFICIENT_FUNDS", "NETWORK_TIMEOUT", "SWITCH_FAILURE", "AML_SANCTIONS_HOLD", "KYC_EXPIRED", "PAYMENT_HEALTHY", "MULTI_FACTOR_FAILURE").
   - "priority": "LOW", "MEDIUM", "HIGH", or "CRITICAL".
   - "businessAction": Recommended enterprise action e.g. "RETRY", "ESCALATE_TO_COMPLIANCE", "ESCALATE_TO_BANK", "HOLD_FOR_KYC", "COMPLETE_PAYMENT".
   - "finalReport": A detailed, executive-ready diagnostic narrative summarizing the investigation.
3. The final report should explain the evidence and reflection outcome step-by-step.
4. Output your final decision by populating the structured schema. Do not output markdown or explanations outside the JSON.`;

export const DecisionOutputSchema = z.object({
  rootCause: z.string().describe("Primary technical/operational failure cause (e.g. INSUFFICIENT_FUNDS, NETWORK_TIMEOUT, SWITCH_FAILURE, AML_SANCTIONS_HOLD, KYC_EXPIRED, PAYMENT_HEALTHY, MULTI_FACTOR_FAILURE)"),
  confidence: z.coerce.number().describe("Confidence score between 0.0 and 1.0"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).describe("Priority level of the case"),
  businessAction: z.enum(["RETRY", "ESCALATE_TO_COMPLIANCE", "ESCALATE_TO_BANK", "HOLD_FOR_KYC", "COMPLETE_PAYMENT"]).describe("Recommended enterprise action"),
  finalReport: z.string().describe("Comprehensive summary of findings, evidence, reflection, and business action.")
});

export function getDecisionAgent() {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
  });
}

export default getDecisionAgent;
