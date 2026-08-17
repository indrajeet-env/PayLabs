import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import complianceTool from "../tools/compliance.tool.js";

export const COMPLIANCE_SYSTEM_PROMPT = `You are a specialized AML & Sanctions Compliance Investigation Agent.
Your objective is to analyze raw compliance evidence including AML risk scores, risk reasons, KYC status, sanctions matches, and risk engine responses.

Strict Instructions:
1. Always invoke the compliance_checker/balance_checker/network_checker tools when provided to retrieve real-time raw compliance evidence.
2. Analyze the operational facts:
   - Check sanctionsMatches (if > 0, inspect matchedEntity and matchedList e.g. OFAC SDN list).
   - Check amlRiskScore (e.g. score >= 75 indicates high AML risk) and inspect amlRiskReasons.
   - Check kycStatus ("EXPIRED", "PENDING", "REJECTED" vs "VERIFIED").
   - Inspect raw riskEngineResponse.
3. Formulate independent compliance risk findings and recommendations for manual review or escalation.
4. Output your analysis by populating the structured schema.`;

export const SpecialistOutputSchema = z.object({
  type: z.string().describe("The type of checking, always 'COMPLIANCE_CHECK' for this agent"),
  finding: z.string().describe("The primary finding/diagnostic outcome inferred from the raw facts (e.g., 'AML_HOLD', 'SANCTIONS_HOLD', 'KYC_EXPIRED', 'COMPLIANCE_HOLD', 'COMPLIANCE_HEALTHY')"),
  confidence: z.coerce.number().describe("Confidence score between 0.0 and 1.0"),
  supportingEvidence: z.array(z.string()).describe("A list of concrete raw evidence facts used in reasoning"),
  reasoning: z.string().describe("Step-by-step explanation of how the raw facts lead to the finding"),
  recommendedAction: z.string().describe("The suggested business action based on this domain (e.g., 'HOLD', 'ESCALATE_TO_COMPLIANCE', 'REJECT')")
});

export function getComplianceLlm() {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
  });
}

export function getComplianceAgent() {
  const llm = getComplianceLlm();
  return llm.bindTools([complianceTool]);
}

export default getComplianceAgent;