import { tool } from "@langchain/core/tools";
import { z } from "zod";
import networkService from "../services/network.service.js";

const networkTool = tool(
  async ({ paymentReference }) => {
    return await networkService.getNetworkStatus(paymentReference);
  },
  {
    name: "network_checker",

    description: "Checks payment network status and rail health for a payment reference.",

    schema: z.object({
      paymentReference: z.string().describe("Payment reference number"),
    }),
  }
);

export default networkTool;
