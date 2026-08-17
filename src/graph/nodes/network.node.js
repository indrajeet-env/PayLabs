import { SystemMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { getNetworkAgent, getNetworkLlm, NETWORK_SYSTEM_PROMPT, SpecialistOutputSchema } from "../../agents/network.agent.js";
import networkTool from "../../tools/network.tool.js";
import networkService from "../../services/network.service.js";

export async function networkNode(state) {
  if (state.selectedAgents && !state.selectedAgents.includes("network")) {
    return {};
  }

  try {
    const messages = [
      new SystemMessage(NETWORK_SYSTEM_PROMPT),
      new HumanMessage(`Investigate network operational evidence for payment reference: ${state.paymentReference}`),
    ];

    const networkAgent = getNetworkAgent();
    const agentResponse = await networkAgent.invoke(messages);

    let networkData = null;
    let structuredFinding = null;

    if (agentResponse.tool_calls && agentResponse.tool_calls.length > 0) {
      const toolCall = agentResponse.tool_calls[0];
      networkData = await networkTool.invoke(toolCall.args);

      const toolMessage = new ToolMessage({
        tool_call_id: toolCall.id,
        content: JSON.stringify(networkData),
      });

      const structuredAgent = getNetworkLlm().withStructuredOutput(SpecialistOutputSchema);
      structuredFinding = await structuredAgent.invoke([
        ...messages,
        agentResponse,
        toolMessage,
      ]);
    } else {
      networkData = await networkService.getNetworkStatus(state.paymentReference);
      
      const structuredAgent = getNetworkLlm().withStructuredOutput(SpecialistOutputSchema);
      structuredFinding = await structuredAgent.invoke([
        ...messages,
        new HumanMessage(`Here are the raw network facts retrieved: ${JSON.stringify(networkData)}`)
      ]);
    }

    return {
      evidences: [structuredFinding],
    };
  } catch (err) {
    console.error("Error in networkNode:", err);
    return {
      evidences: [
        {
          type: "AGENT_ERROR",
          agent: "network",
          error: err.message,
        }
      ],
    };
  }
}
