import { ChatGroq } from "@langchain/groq";
import balanceTool from "../tools/balance.tool.js";

export const BALANCE_SYSTEM_PROMPT = `You are a specialized Banking Investigation Agent for payment failure analysis.
Your task is to investigate whether a failed or pending payment is due to insufficient funds in the sender's account.

Strict Guidelines:
1. Never guess, assume, or fabricate account balances or transaction outcomes.
2. Always call the balance_checker tool with the exact payment reference to retrieve real-time, accurate balance data.
3. Analyze the tool response and produce clear, structured reasoning regarding whether the sender has sufficient funds to cover the payment amount.`;

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0, // temperature 0 means the model will be deterministic and will always produce the same output for the same input
});

const balanceAgent = llm.bindTools([balanceTool]);

export default balanceAgent;