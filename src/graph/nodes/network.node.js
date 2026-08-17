import {
  SystemMessage,
  HumanMessage,
  ToolMessage,
} from "@langchain/core/messages";

import {
  getNetworkAgent,
  getNetworkLlm,
  NETWORK_SYSTEM_PROMPT,
  SpecialistOutputSchema,
} from "../../agents/network.agent.js";

import networkTool from "../../tools/network.tool.js";

export async function networkNode(state) {
  if (!state.selectedAgents?.includes("network")) {
    return {};
  }

  try {
    const messages = [
      new SystemMessage(NETWORK_SYSTEM_PROMPT),

      new HumanMessage(
        `Investigate payment reference: ${state.paymentReference}`
      ),
    ];

    const agent = getNetworkAgent();

    const agentResponse = await agent.invoke(messages);

    if (!agentResponse.tool_calls?.length) {
      throw new Error(
        "Network agent did not call network_checker."
      );
    }

    const toolCall = agentResponse.tool_calls[0];

    const networkData = await networkTool.invoke(toolCall.args);

    const toolMessage = new ToolMessage({
      tool_call_id: toolCall.id,
      content: JSON.stringify(networkData),
    });

    const structuredAgent =
      getNetworkLlm().withStructuredOutput(
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
    console.error("Network agent error:", error);

    return {
      evidences: [
        {
          type: "AGENT_ERROR",
          agent: "network",
          error: error.message,
        },
      ],
    };
  }
}