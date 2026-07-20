/** 
 * Each node is just a JavaScript function.
 * It receives the current graph state.
 * It returns changes to the graph state.
 * */


import { SystemMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import balanceAgent, { BALANCE_SYSTEM_PROMPT } from "../../agents/balance.agent.js";
import balanceTool from "../../tools/balance.tool.js";
import balanceService from "../../services/balance.service.js";

export async function balanceNode(state) { // The graphs initial state: paymentReference:"PAY0002"
  const messages = [
    new SystemMessage(BALANCE_SYSTEM_PROMPT),
    new HumanMessage(`Investigate payment reference: ${state.paymentReference}`), //  The agent will start processing the payment reference number which is been passed in the state 
  ];

  const agentResponse = await balanceAgent.invoke(messages); //  The agent will start processing the payment reference number which is been passed in the state 

  let balanceData = null;
  let reasoning = agentResponse.content || "";

  if (agentResponse.tool_calls && agentResponse.tool_calls.length > 0) { // checks if the agent has called any tool
    const toolCall = agentResponse.tool_calls[0]; // gets the first tool call
    balanceData = await balanceTool.invoke(toolCall.args); // invokes the tool call using toolCall.args which contains the arguments for the tool, and it will run our tool(our backend) and not the LLM 

    // balanceData returns ->
    /* 
      {
        "availableBalance":15000,
        "requiredAmount":5000,
        "sufficientFunds":true 
      }
    */

    const toolMessage = new ToolMessage({
      tool_call_id: toolCall.id, // sends the tool_call_id to the tool
      content: JSON.stringify(balanceData), // sends the tool result to the tool in a string format
    });

    // calling the agent again with the tool message so that it can process the tool result and produce the final response
    const finalResponse = await balanceAgent.invoke([
      ...messages,
      agentResponse,
      toolMessage,
    ]);

    reasoning = finalResponse.content;
  } else {
    balanceData = await balanceService.getBalance(state.paymentReference); // if the agent has not called any tool, then get the balance data from the balance service
  }

  return {
    evidences: [
      {
        type: "BALANCE_CHECK",
        data: balanceData, // it stores the balance data  i.e it tells whether sufficient funds are available or not 
        reasoning, // Agent's explanation
      },
    ],
  };
}