import { SystemMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { getComplianceAgent, COMPLIANCE_SYSTEM_PROMPT } from "../../agents/compliance.agent.js";
import complianceTool from "../../tools/compliance.tool.js";
import complianceService from "../../services/compliance.service.js";

export async function complianceNode(state) {
  if (state.selectedAgents && !state.selectedAgents.includes("compliance")) {
    return {};
  }

  const messages = [
    new SystemMessage(COMPLIANCE_SYSTEM_PROMPT),
    new HumanMessage(`Investigate compliance evidence for payment reference: ${state.paymentReference}`),
  ];

  const complianceAgent = getComplianceAgent();
  const agentResponse = await complianceAgent.invoke(messages);

  let complianceData = null;
  let reasoning = agentResponse.content || "";

  if (agentResponse.tool_calls && agentResponse.tool_calls.length > 0) {
    const toolCall = agentResponse.tool_calls[0];
    complianceData = await complianceTool.invoke(toolCall.args);

    const toolMessage = new ToolMessage({
      tool_call_id: toolCall.id,
      content: JSON.stringify(complianceData),
    });

    const finalResponse = await complianceAgent.invoke([
      ...messages,
      agentResponse,
      toolMessage,
    ]);

    reasoning = finalResponse.content;
  } else {
    complianceData = await complianceService.getComplianceStatus(state.paymentReference);
  }

  return {
    evidences: [
      {
        type: "COMPLIANCE_CHECK",
        data: complianceData,
        reasoning,
      },
    ],
  };
}
