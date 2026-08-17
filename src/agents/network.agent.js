import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import networkTool from "../tools/network.tool.js";

export const NETWORK_SYSTEM_PROMPT = `You are a specialized Payment Network & Rail Diagnostics Agent.
Your objective is to analyze raw gateway response codes, bank response codes, ACK flags, network latency, retry counts, and system logs to identify rail or network failures.

Strict Instructions:
1. Always invoke the compliance_checker/balance_checker/network_checker tools when provided to retrieve real-time raw operational evidence.
2. Analyze the operational facts:
   - Inspect gatewayResponseCode (e.g. 504 Gateway Timeout, 502 Bad Gateway/Switch Failure, 200 OK).
   - Inspect bankResponseCode and switch/gateway logs.
   - Check ackReceived (false indicates acknowledgement timeout).
   - Check networkLatency (latency >= 10000ms indicates severe delay/timeout).
   - Check retryCount.
3. Formulate independent diagnostic conclusions based on raw facts.
4. Output your analysis by populating the structured schema.`;

export const SpecialistOutputSchema = z.object({
  type: z.string().describe("The type of checking, always 'NETWORK_CHECK' for this agent"),
  finding: z.string().describe("The primary finding/diagnostic outcome inferred from the raw facts (e.g., 'NETWORK_TIMEOUT', 'ACK_TIMEOUT', 'SWITCH_FAILURE', 'GATEWAY_ERROR', 'NETWORK_HEALTHY')"),
  confidence: z.coerce.number().describe("Confidence score between 0.0 and 1.0"),
  supportingEvidence: z.array(z.string()).describe("A list of concrete raw evidence facts used in reasoning"),
  reasoning: z.string().describe("Step-by-step explanation of how the raw facts lead to the finding"),
  recommendedAction: z.string().describe("The suggested business action based on this domain (e.g., 'RETRY', 'HOLD', 'ESCALATE')")
});

export function getNetworkLlm() {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
  });
}

export function getNetworkAgent() {
  const llm = getNetworkLlm();
  return llm.bindTools([networkTool]);
}

export default getNetworkAgent;