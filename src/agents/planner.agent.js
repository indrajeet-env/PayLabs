import { ChatGroq } from "@langchain/groq";
import { z } from "zod";

export const PLANNER_SYSTEM_PROMPT = `You are an AI Investigation Orchestration & Planning Agent for a high-throughput Payment System.
Your job is to analyze payment metadata and determine which specialist investigation agents should be invoked.

Specialist Agents available:
- "balance": Investigates account balance, liquidity, daily transfer limits, minimum reserves, and account statuses.
- "network": Investigates payment rail issues, gateway response codes, bank response codes, ACK timeouts, latency, and switch logs.
- "compliance": Investigates AML risk scores, risk reasons, KYC status, sanctions matches, and risk engine responses.

Instructions:
1. Carefully analyze payment metadata (rail, amount, status, reference).
2. Determine which specialist agents should run to thoroughly diagnose the root cause.
3. The selected agents must be returned in the selectedAgents array.
4. Provide a clear reasoning explaining why these agents were selected.`;

export const PlannerOutputSchema = z.object({
  selectedAgents: z.array(z.enum(["balance", "network", "compliance"])).describe("The specialist agents selected to investigate"),
  reasoning: z.string().describe("Explanation for why these agents were selected based on payment metadata.")
});

export function getPlannerAgent() {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant",
    temperature: 0,
  });
}

export default getPlannerAgent;
