import { Annotation } from "@langchain/langgraph";

export const PaymentState = Annotation.Root({
  paymentReference: Annotation({
    default: () => "",
  }),

  payment: Annotation({
    default: () => null,
  }),

  selectedAgents: Annotation({
    default: () => ["balance", "network", "compliance"],
  }),

  plannerReasoning: Annotation({
    default: () => "",
  }),

  evidences: Annotation({
    default: () => [],
    reducer: (current, update) => current.concat(update),
  }),

  reflection: Annotation({
    default: () => null,
  }),

  decision: Annotation({
    default: () => null,
  }),
});