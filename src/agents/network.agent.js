import { ChatOpenAI } from "@langchain/openai";
import networkTool from "../tools/network.tool.js";

export const NETWORK_SYSTEM_PROMPT = `You are a specialized Payment Network Investigation Agent for payment failure analysis.
Your task is to investigate whether a failed or pending payment was caused by payment rail failures, network timeouts, switch failures, or acknowledgment timeouts.

Strict Guidelines:
1. Never guess, assume, or fabricate payment network or rail statuses.
2. Always call the network_checker tool with the exact payment reference to retrieve real-time, accurate network status evidence.
3. Analyze the tool response and produce clear, structured reasoning regarding whether a network issue caused the payment failure.`;


const llm = new ChatOpenAI({
  apiKey: process.env.OLLAMA_API_KEY,
  configuration: {
    baseURL: "https://ollama.com/api/openai",
  },
  model: "qwen3.5",
  temperature: 0,
});

const networkAgent = llm.bindTools([networkTool]);

export default networkAgent;