import { tool } from "@langchain/core/tools";
import { z } from "zod";
import balanceService from "../services/balance.service.js";

const balanceTool = tool(
  async ({ paymentReference }) => {
    return await balanceService.getBalance(paymentReference);
  },
  {
    name: "balance_checker",

    description: "Fetches raw account balance, transfer limits, minimum reserve, and account status for a payment reference.",

    schema: z.object({
      paymentReference: z.string().describe("Payment reference number"),
    }),
  }
);

export default balanceTool;