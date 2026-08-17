import { SystemMessage, HumanMessage } from "@langchain/core/messages";

import {
  getReflectionAgent,
  REFLECTION_SYSTEM_PROMPT,
  ReflectionOutputSchema,
} from "../../agents/reflection.agent.js";

export async function reflectionNode(state) {
  const messages = [
    new SystemMessage(REFLECTION_SYSTEM_PROMPT),

    new HumanMessage(`
Review the specialist investigation results.

Payment Reference:
${state.paymentReference}

Planner Reasoning:
${state.plannerReasoning || "N/A"}

Specialist Findings:
${JSON.stringify(state.evidences || [], null, 2)}
`),
  ];

  try {
    const reflectionAgent =
      getReflectionAgent().withStructuredOutput(
        ReflectionOutputSchema
      );

    const result = await reflectionAgent.invoke(messages);

    return {
      reflection: result,
    };
  } catch (error) {
    console.error("Reflection agent error:", error);

    return {
      reflection: {
        consensusFinding: "REFLECTION_FAILED",
        conflictResolution:
          "Reflection could not be completed.",
        requiresMoreEvidence: true,
        reflectionReasoning: error.message,
      },
    };
  }
}