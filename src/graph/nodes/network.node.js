import { SystemMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { getNetworkAgent, NETWORK_SYSTEM_PROMPT } from "../../agents/network.agent.js";
import networkTool from "../../tools/network.tool.js";
import networkService from "../../services/network.service.js";

export async function networkNode(state) {
  if (state.selectedAgents && !state.selectedAgents.includes("network")) {
    return {};
  }

  const messages = [
    new SystemMessage(NETWORK_SYSTEM_PROMPT),
    new HumanMessage(`Investigate network operational evidence for payment reference: ${state.paymentReference}`),
  ];

  const networkAgent = getNetworkAgent();
  const agentResponse = await networkAgent.invoke(messages);

  let networkData = null;
  let reasoning = agentResponse.content || "";

  if (agentResponse.tool_calls && agentResponse.tool_calls.length > 0) {
    const toolCall = agentResponse.tool_calls[0];
    networkData = await networkTool.invoke(toolCall.args);

    const toolMessage = new ToolMessage({
      tool_call_id: toolCall.id,
      content: JSON.stringify(networkData),
    });

    const finalResponse = await networkAgent.invoke([
      ...messages,
      agentResponse,
      toolMessage,
    ]);

    reasoning = finalResponse.content;
  } else {
    networkData = await networkService.getNetworkStatus(state.paymentReference);
  }

  return {
    evidences: [
      {
        type: "NETWORK_CHECK",
        data: networkData,
        reasoning,
      },
    ],
  };
}
