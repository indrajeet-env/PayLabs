import { SystemMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { getBalanceAgent, BALANCE_SYSTEM_PROMPT } from "../../agents/balance.agent.js";
import balanceTool from "../../tools/balance.tool.js";
import balanceService from "../../services/balance.service.js";

export async function balanceNode(state) {
  if (state.selectedAgents && !state.selectedAgents.includes("balance")) {
    return {};
  }

  const messages = [
    new SystemMessage(BALANCE_SYSTEM_PROMPT),
    new HumanMessage(`Investigate balance facts for payment reference: ${state.paymentReference}`),
  ];

  const balanceAgent = getBalanceAgent();
  const agentResponse = await balanceAgent.invoke(messages);

  let balanceData = null;
  let reasoning = agentResponse.content || "";

  if (agentResponse.tool_calls && agentResponse.tool_calls.length > 0) {
    const toolCall = agentResponse.tool_calls[0];
    balanceData = await balanceTool.invoke(toolCall.args);

    const toolMessage = new ToolMessage({
      tool_call_id: toolCall.id,
      content: JSON.stringify(balanceData),
    });

    const finalResponse = await balanceAgent.invoke([
      ...messages,
      agentResponse,
      toolMessage,
    ]);

    reasoning = finalResponse.content;
  } else {
    balanceData = await balanceService.getBalance(state.paymentReference);
  }

  return {
    evidences: [
      {
        type: "BALANCE_CHECK",
        data: balanceData,
        reasoning,
      },
    ],
  };
}