import { tool } from "@langchain/core/tools";
import { z } from "zod";
import complianceService from "../services/compliance.service.js";

const complianceTool = tool(
  async ({ paymentReference }) => {
    return await complianceService.getComplianceStatus(paymentReference);
  },
  {
    name: "compliance_checker",

    description: "Fetches raw AML risk scores, risk reasons, KYC status, sanctions matches, matched entities, and risk engine responses for a payment reference.",

    schema: z.object({
      paymentReference: z.string().describe("Payment reference number"),
    }),
  }
);

export default complianceTool;
