
console.log("✅ chatbotService loaded");

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const askChatbot = async (question, metrics) => {
  console.log("🔥 askChatbot called");

  try {
    console.log("Question:", question);
    console.log("Metrics:", metrics);

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing from server .env");
    }

    const cpu =
      metrics?.cpuValue ??
      metrics?.cpuUsage ??
      "unknown";

    const freeMemory =
      metrics?.freeMemory ?? "unknown";

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `You are PulseAI Assistant.
You help users monitor their PC health.

Current system information:
CPU Usage: ${cpu}%
Free Memory: ${freeMemory} GB

Answer questions about system performance.
Keep answers short, clear and helpful.
Use simple English.`,
        },
        {
          role: "user",
          content: String(question),
        },
      ],

      temperature: 0.7,
      max_completion_tokens: 512,
    });

    const aiReply =
      response.choices?.[0]?.message?.content;

    console.log("✅ Groq Success");
    console.log("AI Reply:", aiReply);

    return aiReply || "No response received from AI.";

  } catch (error) {
    console.error("========== GROQ ERROR ==========");
    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Code:", error.code);
    console.error("Error details:", error.error);
    console.error("================================");

    return "❌ AI unavailable. Check the server terminal for the Groq error.";
  }
};

module.exports = {
  askChatbot,
};
