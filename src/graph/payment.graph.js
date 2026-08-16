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
workflow.addEdge("planner", "balance");
workflow.addEdge("balance", "network");
workflow.addEdge("network", "compliance");
workflow.addEdge("compliance", "reflection_node");
workflow.addEdge("reflection_node", "decision_node");
workflow.addEdge("decision_node", END);

export default workflow.compile();