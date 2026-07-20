/**
                START
                  │
                  ▼
              Planner Agent
        ┌────────┬────────┬────────┐
        ▼        ▼        ▼        ▼
    Balance   Network  Compliance Duplicate
        └────────┬────────┬────────┘
                 ▼
          Decision Agent
                 │
                 ▼
                END
*/

import {
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";

import { PaymentState } from "./state.js";

import { plannerNode } from "./nodes/planner.node.js";
import { balanceNode } from "./nodes/balance.node.js";
import { networkNode } from "./nodes/network.node.js";
import { decisionNode } from "./nodes/decision.node.js";

const workflow = new StateGraph(PaymentState);

workflow.addNode("planner", plannerNode);

workflow.addNode("balance", balanceNode);

workflow.addNode("network", networkNode);

workflow.addNode("decision_node", decisionNode);

workflow.addEdge(START, "planner"); // Denotes the starting node of the graph

workflow.addEdge("planner", "balance"); // Denotes that the planner node will call the balance node next

workflow.addEdge("balance", "network"); // Denotes that the balance node will call the network node next

workflow.addEdge("network", "decision_node"); // Denotes that the network node will call the decision node next

workflow.addEdge("decision_node", END); // Denotes the end node of the graph

export default workflow.compile(); // Compiles the graph