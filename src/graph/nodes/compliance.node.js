import {
  SystemMessage,
  HumanMessage,
  ToolMessage,
} from "@langchain/core/messages";

import {
  getComplianceAgent,
  getComplianceLlm,
  COMPLIANCE_SYSTEM_PROMPT,
  SpecialistOutputSchema,
} from "../../agents/compliance.agent.js";

import complianceTool from "../../tools/compliance.tool.js";

export async function complianceNode(state) {
  if (!state.selectedAgents?.includes("compliance")) {
    return {};
  }

  try {
    const messages = [
      new SystemMessage(COMPLIANCE_SYSTEM_PROMPT),

      new HumanMessage(
        `Investigate payment reference: ${state.paymentReference}`
      ),
    ];

    const agent = getComplianceAgent();

    const agentResponse = await agent.invoke(messages);

    if (!agentResponse.tool_calls?.length) {
      throw new Error(
        "Compliance agent did not call compliance_checker."
      );
    }

    const toolCall = agentResponse.tool_calls[0];

    const complianceData =
      await complianceTool.invoke(toolCall.args);

    const toolMessage = new ToolMessage({
      tool_call_id: toolCall.id,
      content: JSON.stringify(complianceData),
    });

    const structuredAgent =
      getComplianceLlm().withStructuredOutput(
        SpecialistOutputSchema
      );

    const finding = await structuredAgent.invoke([
      ...messages,
      agentResponse,
      toolMessage,
    ]);

    return {
      evidences: [finding],
    };
  } catch (error) {
    console.error("Compliance agent error:", error);

    return {
      evidences: [
        {
          type: "AGENT_ERROR",
          agent: "compliance",
          error: error.message,
        },
      ],
    };
  }
}