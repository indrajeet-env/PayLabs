import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import {
  getPlannerAgent,
  PLANNER_SYSTEM_PROMPT,
  PlannerOutputSchema,
} from "../../agents/planner.agent.js";

import paymentService from "../../services/payment.service.js";

export async function plannerNode(state) {
  const paymentContext = await paymentService.getPaymentContext(
    state.paymentReference
  );

  const messages = [
    new SystemMessage(PLANNER_SYSTEM_PROMPT),

    new HumanMessage(`
Plan the investigation for this payment.

Payment Context:
${JSON.stringify(paymentContext, null, 2)}
`),
  ];

  const plannerAgent =
    getPlannerAgent().withStructuredOutput(PlannerOutputSchema);

  const result = await plannerAgent.invoke(messages);

  return {
    payment: paymentContext,
    selectedAgents: result.selectedAgents,
    plannerReasoning: result.reasoning,
  };
}