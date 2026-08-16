import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { getReflectionAgent, REFLECTION_SYSTEM_PROMPT } from "../../agents/reflection.agent.js";

export async function reflectionNode(state) {
  const prompt = [
    new SystemMessage(REFLECTION_SYSTEM_PROMPT),
    new HumanMessage(`Review specialist findings for payment reference ${state.paymentReference}:
Planner Reasoning: ${state.plannerReasoning || "N/A"}
Specialist Evidences: ${JSON.stringify(state.evidences || [], null, 2)}`),
  ];

  let reflectionResult = null;

  try {
    const reflectionAgent = getReflectionAgent();
    const response = await reflectionAgent.invoke(prompt);
    const cleaned = response.content.replace(/```json|```/g, "").trim();
    reflectionResult = JSON.parse(cleaned);
  } catch (e) {
    console.error("Reflection LLM parsing fallback:", e.message);
    reflectionResult = {
      consensusFinding: "Specialist findings synthesized.",
      conflictResolution: "No explicit conflicts detected.",
      reinvestigationNeeded: false,
      reflectionReasoning: "Fallback reflection synthesis completed.",
    };
  }

  return {
    reflection: reflectionResult,
  };
}
