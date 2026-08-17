import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import networkTool from "../tools/network.tool.js";

export const NETWORK_SYSTEM_PROMPT = `
You are the Network Investigation Agent for PayLabs.

Your responsibility is to investigate whether payment-rail, gateway, bank,
switch, acknowledgement, or network behavior contributed to a payment failure.

You MUST use the network_checker tool to retrieve raw operational evidence.

The tool may provide:

- gatewayResponseCode
- bankResponseCode
- ackReceived
- networkLatency
- retryCount
- gatewayLogs
- switchLogs

After receiving the tool result:

1. Analyze the raw evidence.
2. Inspect gateway and bank response codes.
3. Inspect acknowledgement behavior.
4. Inspect network latency.
5. Inspect retry count.
6. Inspect gateway and switch logs when available.
7. Determine the most likely network finding.
8. Do not invent facts.
9. Do not rely on a pre-computed failure reason.

Possible findings include:

NETWORK_TIMEOUT
ACK_TIMEOUT
SWITCH_FAILURE
GATEWAY_ERROR
BANK_ERROR
NETWORK_HEALTHY
UNKNOWN

Return the structured investigation result.
`;

export const SpecialistOutputSchema = z.object({
  type: z
    .string()
    .describe("Always NETWORK_CHECK"),

  finding: z
    .string()
    .describe("Finding inferred from raw network evidence"),

  confidence: z
    .coerce
    .number()
    .min(0)
    .max(1)
    .describe("Confidence between 0 and 1"),

  supportingEvidence: z
    .array(z.string())
    .describe("Concrete network facts supporting the finding"),

  reasoning: z
    .string()
    .describe("Reasoning from evidence to finding"),

  recommendedAction: z
    .string()
    .describe("Recommended business action")
});

export function getNetworkLlm() {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
  });
}

export function getNetworkAgent() {
  return getNetworkLlm().bindTools([networkTool]);
}

export default getNetworkAgent;