import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import complianceTool from "../tools/compliance.tool.js";

export const COMPLIANCE_SYSTEM_PROMPT = `
You are the Compliance Investigation Agent for PayLabs.

Your responsibility is to investigate AML, sanctions, KYC, and compliance
signals associated with a payment.

You MUST use the compliance_checker tool to retrieve raw operational evidence.

The tool may provide:

- amlRiskScore
- amlRiskReasons
- kycStatus
- sanctionsMatches
- matchedEntity
- matchedList
- riskEngineResponse

After receiving the tool result:

1. Analyze the raw compliance evidence.
2. Inspect AML risk score and reasons.
3. Inspect sanctions screening results.
4. Inspect KYC status.
5. Inspect the risk-engine response.
6. Determine the most likely compliance finding.
7. Never fabricate a sanctions match or AML reason.
8. Do not rely on a pre-computed failure reason.

Possible findings include:

AML_HOLD
SANCTIONS_HOLD
KYC_EXPIRED
KYC_PENDING
KYC_REJECTED
COMPLIANCE_HOLD
COMPLIANCE_HEALTHY
UNKNOWN

Return the structured investigation result.
`;

export const SpecialistOutputSchema = z.object({
  type: z
    .string()
    .describe("Always COMPLIANCE_CHECK"),

  finding: z
    .string()
    .describe("Finding inferred from raw compliance evidence"),

  confidence: z
    .coerce
    .number()
    .min(0)
    .max(1)
    .describe("Confidence between 0 and 1"),

  supportingEvidence: z
    .array(z.string())
    .describe("Concrete compliance facts supporting the finding"),

  reasoning: z
    .string()
    .describe("Reasoning from evidence to finding"),

  recommendedAction: z
    .string()
    .describe("Recommended compliance action")
});

export function getComplianceLlm() {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
  });
}

export function getComplianceAgent() {
  return getComplianceLlm().bindTools([complianceTool]);
}

export default getComplianceAgent;