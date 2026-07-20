import { tool } from "@langchain/core/tools";
import { z } from "zod";
import balanceService from "../services/balance.service.js";

const balanceTool = tool(
  async ({ paymentReference }) => {
    return await balanceService.getBalance(paymentReference);
  },
  {
    name: "balance_checker",

    description:
      "Checks the balance of the sender account.",

    schema: z.object({
      paymentReference: z.string().describe("Payment reference number"),
    }),
  }
);

export default balanceTool;