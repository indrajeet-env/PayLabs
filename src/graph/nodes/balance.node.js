import {
  SystemMessage,
  HumanMessage,
  ToolMessage,
} from "@langchain/core/messages";

import {
  getBalanceAgent,
  getBalanceLlm,
  BALANCE_SYSTEM_PROMPT,
  SpecialistOutputSchema,
} from "../../agents/balance.agent.js";

import balanceTool from "../../tools/balance.tool.js";

export async function balanceNode(state) {
  if (!state.selectedAgents?.includes("balance")) {
    return {};
  }

  try {
    const messages = [
      new SystemMessage(BALANCE_SYSTEM_PROMPT),

      new HumanMessage(
        `Investigate payment reference: ${state.paymentReference}`
      ),
    ];

    const agent = getBalanceAgent();

    const agentResponse = await agent.invoke(messages);

    if (!agentResponse.tool_calls?.length) {
      throw new Error(
        "Balance agent did not call balance_checker."
      );
    }

    const toolCall = agentResponse.tool_calls[0];

    const balanceData = await balanceTool.invoke(toolCall.args);

    const toolMessage = new ToolMessage({
      tool_call_id: toolCall.id,
      content: JSON.stringify(balanceData),
    });

    const structuredAgent =
      getBalanceLlm().withStructuredOutput(
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
    console.error("Balance agent error:", error);

    return {
      evidences: [
        {
          type: "AGENT_ERROR",
          agent: "balance",
          error: error.message,
        },
      ],
    };
  }
}