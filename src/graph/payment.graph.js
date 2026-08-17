import {
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";

import { PaymentState } from "./state.js";

import { plannerNode } from "./nodes/planner.node.js";
import { balanceNode } from "./nodes/balance.node.js";
import { networkNode } from "./nodes/network.node.js";
import { complianceNode } from "./nodes/compliance.node.js";
import { reflectionNode } from "./nodes/reflection.node.js";
import { decisionNode } from "./nodes/decision.node.js";

const workflow = new StateGraph(PaymentState);

workflow.addNode("planner", plannerNode);
workflow.addNode("balance", balanceNode);
workflow.addNode("network", networkNode);
workflow.addNode("compliance", complianceNode);
workflow.addNode("reflection_node", reflectionNode);
workflow.addNode("decision_node", decisionNode);

workflow.addEdge(START, "planner");

function routeFromPlanner(state) {
  const selectedAgents = state.selectedAgents || [];

  const validAgents = new Set([
    "balance",
    "network",
    "compliance",
  ]);

  const targets = selectedAgents.filter((agent) =>
    validAgents.has(agent)
  );

  if (targets.length === 0) {
    throw new Error(
      "Planner selected no valid specialist agents."
    );
  }

  return targets;
}

workflow.addConditionalEdges(
  "planner",
  routeFromPlanner,
  {
    balance: "balance",
    network: "network",
    compliance: "compliance",
  }
);

workflow.addEdge("balance", "reflection_node");
workflow.addEdge("network", "reflection_node");
workflow.addEdge("compliance", "reflection_node");

workflow.addEdge("reflection_node", "decision_node");

workflow.addEdge("decision_node", END);

export default workflow.compile();