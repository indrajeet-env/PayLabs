import { tool } from "@langchain/core/tools";
import { z } from "zod";
import networkService from "../services/network.service.js";

const networkTool = tool(
  async ({ paymentReference }) => {
    return await networkService.getNetworkStatus(paymentReference);
  },
  {
    name: "network_checker",

    description: "Fetches raw gateway response codes, bank response codes, ACK flags, latency, retry counts, and network logs for a payment reference.",

    schema: z.object({
      paymentReference: z.string().describe("Payment reference number"),
    }),
  }
);

export default networkTool;
