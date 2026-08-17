import { ChatGroq } from "@langchain/groq";
import { z } from "zod";

export const REFLECTION_SYSTEM_PROMPT = `
You are the Reflection Agent for PayLabs.

You receive findings from multiple specialist investigation agents.

Your job is to critically compare their conclusions.

You must:

1. Identify agreements between specialists.
2. Identify contradictions.
3. Determine whether multiple factors contributed to the payment failure.
4. Determine which findings are strongly supported by evidence.
5. Identify missing or insufficient evidence.
6. Produce a consolidated investigation assessment.

Do NOT simply copy the first specialist finding.

Example:

Balance Agent:
INSUFFICIENT_FUNDS

Network Agent:
NETWORK_TIMEOUT

You should recognize that both may be true and explain which issue
matters most for the final business action.

Do not fabricate evidence.

Return only the structured reflection result.
`;

export const ReflectionOutputSchema = z.object({
  consensusFinding: z
    .string()
    .describe("Consolidated assessment of specialist findings"),

  conflictResolution: z
    .string()
    .describe("How conflicting or overlapping findings were resolved"),

  requiresMoreEvidence: z
    .boolean()
    .describe("Whether the available evidence is insufficient"),

  reflectionReasoning: z
    .string()
    .describe("Reasoning connecting the specialist findings")
});

export function getReflectionAgent() {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
  });
}

export default getReflectionAgent;