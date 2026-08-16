import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { getPlannerAgent, PLANNER_SYSTEM_PROMPT } from "../../agents/planner.agent.js";
import paymentService from "../../services/payment.service.js";

export async function plannerNode(state) {
  let paymentContext = null;
  try {
    paymentContext = await paymentService.getPaymentContext(state.paymentReference);
  } catch (e) {
    console.error("Planner context error:", e.message);
  }

  const prompt = [
    new SystemMessage(PLANNER_SYSTEM_PROMPT),
    new HumanMessage(`Analyze payment metadata and plan specialist investigation for reference ${state.paymentReference}: ${JSON.stringify(paymentContext || {})}`),
  ];

  let selectedAgents = ["balance", "network", "compliance"];
  let reasoning = "Default comprehensive investigation plan.";

  try {
    const plannerAgent = getPlannerAgent();
    const response = await plannerAgent.invoke(prompt);
    const cleaned = response.content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (parsed.selectedAgents && Array.isArray(parsed.selectedAgents)) {
      selectedAgents = parsed.selectedAgents;
    }
    if (parsed.reasoning) {
      reasoning = parsed.reasoning;
    }
  } catch (e) {
    console.error("Planner LLM parsing fallback:", e.message);
  }

  return {
    payment: paymentContext,
    selectedAgents,
    plannerReasoning: reasoning,
  };
}