import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { getDecisionAgent, DECISION_SYSTEM_PROMPT, DecisionOutputSchema } from "../../agents/decision.agent.js";

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
    const decisionAgent = getDecisionAgent().withStructuredOutput(DecisionOutputSchema);
    decisionResult = await decisionAgent.invoke(prompt);
  } catch (e) {
    console.error("Decision LLM parsing error:", e.message);
    decisionResult = {
      rootCause: "INVESTIGATION_COMPLETED",
      confidence: 0.5,
      priority: "MEDIUM",
      businessAction: "ESCALATE_TO_BANK",
      finalReport: `Synthesis failed to parse. Fallback report generated due to error: ${e.message}`,
    };
  }

  return {
    decision: decisionResult,
  };
}