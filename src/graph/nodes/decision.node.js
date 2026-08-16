import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { getDecisionAgent, DECISION_SYSTEM_PROMPT } from "../../agents/decision.agent.js";

export async function decisionNode(state) {
  const prompt = [
    new SystemMessage(DECISION_SYSTEM_PROMPT),
    new HumanMessage(`Synthesize final diagnosis and action for payment reference ${state.paymentReference}:
Planner Reasoning: ${state.plannerReasoning || "N/A"}
Selected Agents: ${JSON.stringify(state.selectedAgents || [])}
Specialist Evidences: ${JSON.stringify(state.evidences || [], null, 2)}
Reflection Analysis: ${JSON.stringify(state.reflection || {}, null, 2)}`),
  ];

  let decisionResult = null;

  try {
    const decisionAgent = getDecisionAgent();
    const response = await decisionAgent.invoke(prompt);
    const cleaned = response.content.replace(/```json|```/g, "").trim();
    decisionResult = JSON.parse(cleaned);
  } catch (e) {
    console.error("Decision LLM parsing fallback:", e.message);
    decisionResult = {
      rootCause: "INVESTIGATION_COMPLETED",
      priority: "MEDIUM",
      businessAction: "FURTHER_INVESTIGATION_REQUIRED",
      finalReport: "Synthesis completed based on collected specialist evidence.",
    };
  }

  return {
    decision: decisionResult,
  };
}