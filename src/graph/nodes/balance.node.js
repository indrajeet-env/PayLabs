import { SystemMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { getBalanceAgent, getBalanceLlm, BALANCE_SYSTEM_PROMPT, SpecialistOutputSchema } from "../../agents/balance.agent.js";
import balanceTool from "../../tools/balance.tool.js";
import balanceService from "../../services/balance.service.js";

export async function balanceNode(state) {
  if (state.selectedAgents && !state.selectedAgents.includes("balance")) {
    return {};
  }

  try {
    const messages = [
      new SystemMessage(BALANCE_SYSTEM_PROMPT),
      new HumanMessage(`Investigate balance facts for payment reference: ${state.paymentReference}`),
    ];

    const balanceAgent = getBalanceAgent();
    const agentResponse = await balanceAgent.invoke(messages);

    let balanceData = null;
    let structuredFinding = null;

    if (agentResponse.tool_calls && agentResponse.tool_calls.length > 0) {
      const toolCall = agentResponse.tool_calls[0];
      balanceData = await balanceTool.invoke(toolCall.args);

      const toolMessage = new ToolMessage({
        tool_call_id: toolCall.id,
        content: JSON.stringify(balanceData),
      });

      const structuredAgent = getBalanceLlm().withStructuredOutput(SpecialistOutputSchema);
      structuredFinding = await structuredAgent.invoke([
        ...messages,
        agentResponse,
        toolMessage,
      ]);
    } else {
      balanceData = await balanceService.getBalance(state.paymentReference);
      
      const structuredAgent = getBalanceLlm().withStructuredOutput(SpecialistOutputSchema);
      structuredFinding = await structuredAgent.invoke([
        ...messages,
        new HumanMessage(`Here are the raw balance facts retrieved: ${JSON.stringify(balanceData)}`)
      ]);
    }

    return {
      evidences: [structuredFinding],
    };
  } catch (err) {
    console.error("Error in balanceNode:", err);
    return {
      evidences: [
        {
          type: "AGENT_ERROR",
          agent: "balance",
          error: err.message,
        }
      ],
    };
  }
}