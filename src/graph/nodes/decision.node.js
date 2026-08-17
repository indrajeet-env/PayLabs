import { SystemMessage, HumanMessage } from "@langchain/core/messages";

import {
  getDecisionAgent,
  DECISION_SYSTEM_PROMPT,
  DecisionOutputSchema,
} from "../../agents/decision.agent.js";

export async function decisionNode(state) {
  const messages = [
    new SystemMessage(DECISION_SYSTEM_PROMPT),

    new HumanMessage(`
Produce the final investigation decision.

Payment Reference:
${state.paymentReference}

Payment Context:
${JSON.stringify(state.payment || {}, null, 2)}

Planner Reasoning:
${state.plannerReasoning || "N/A"}

Selected Agents:
${JSON.stringify(state.selectedAgents || [], null, 2)}

Specialist Findings:
${JSON.stringify(state.evidences || [], null, 2)}

Reflection:
${JSON.stringify(state.reflection || {}, null, 2)}
`),
  ];

  try {
    const decisionAgent =
      getDecisionAgent().withStructuredOutput(
        DecisionOutputSchema
      );

    const decision = await decisionAgent.invoke(messages);

    return {
      decision,
    };
  } catch (error) {
    console.error("Decision agent error:", error);

    return {
      decision: {
        rootCause: "DECISION_FAILED",
        confidence: 0,
        priority: "HIGH",
        businessAction: "ESCALATE_TO_BANK",
        finalReport:
          "The investigation could not produce a reliable final decision. Human investigation is required.",
      },
    };
  }
}