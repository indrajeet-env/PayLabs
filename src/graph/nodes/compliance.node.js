import { SystemMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { getComplianceAgent, getComplianceLlm, COMPLIANCE_SYSTEM_PROMPT, SpecialistOutputSchema } from "../../agents/compliance.agent.js";
import complianceTool from "../../tools/compliance.tool.js";
import complianceService from "../../services/compliance.service.js";

export async function complianceNode(state) {
  if (state.selectedAgents && !state.selectedAgents.includes("compliance")) {
    return {};
  }

  try {
    const messages = [
      new SystemMessage(COMPLIANCE_SYSTEM_PROMPT),
      new HumanMessage(`Investigate compliance evidence for payment reference: ${state.paymentReference}`),
    ];

    const complianceAgent = getComplianceAgent();
    const agentResponse = await complianceAgent.invoke(messages);

    let complianceData = null;
    let structuredFinding = null;

    if (agentResponse.tool_calls && agentResponse.tool_calls.length > 0) {
      const toolCall = agentResponse.tool_calls[0];
      complianceData = await complianceTool.invoke(toolCall.args);

      const toolMessage = new ToolMessage({
        tool_call_id: toolCall.id,
        content: JSON.stringify(complianceData),
      });

      const structuredAgent = getComplianceLlm().withStructuredOutput(SpecialistOutputSchema);
      structuredFinding = await structuredAgent.invoke([
        ...messages,
        agentResponse,
        toolMessage,
      ]);
    } else {
      complianceData = await complianceService.getComplianceStatus(state.paymentReference);
      
      const structuredAgent = getComplianceLlm().withStructuredOutput(SpecialistOutputSchema);
      structuredFinding = await structuredAgent.invoke([
        ...messages,
        new HumanMessage(`Here are the raw compliance facts retrieved: ${JSON.stringify(complianceData)}`)
      ]);
    }

    return {
      evidences: [structuredFinding],
    };
  } catch (err) {
    console.error("Error in complianceNode:", err);
    return {
      evidences: [
        {
          type: "AGENT_ERROR",
          agent: "compliance",
          error: err.message,
        }
      ],
    };
  }
}
