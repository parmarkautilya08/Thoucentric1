import OpenAI from "openai";

const apiKey =
  process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;
const baseURL =
  process.env.AI_INTEGRATIONS_OPENAI_BASE_URL ??
  process.env.OPENAI_BASE_URL ??
  "https://api.openai.com/v1";

if (!apiKey) {
  console.warn("WARNING: AI_INTEGRATIONS_OPENAI_API_KEY or OPENAI_API_KEY not set. AI features will fail.");
}

export const openai = apiKey ? new OpenAI({
  apiKey,
  baseURL,
}) : null as unknown as OpenAI;
