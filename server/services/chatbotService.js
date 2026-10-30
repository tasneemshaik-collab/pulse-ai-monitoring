
console.log("✅ chatbotService loaded");

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const askChatbot = async (question, metrics) => {
  console.log("🔥 askChatbot called");

  try {
    console.log("Question:", question);
    console.log("Metrics received:", metrics);

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing from server environment");
    }

    // Pass ALL available dashboard metrics to the AI
    const systemInformation = metrics
      ? JSON.stringify(metrics, null, 2)
      : "No dashboard metrics are currently available.";

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `
You are PulseAI Assistant, an intelligent PC monitoring assistant.

You help users understand their computer's live performance.

Here is the complete dashboard information:

${systemInformation}

IMPORTANT INSTRUCTIONS:

1. Answer questions using the dashboard information above.
2. You can answer questions about:
   - CPU Usage
   - Total Memory
   - Used Memory
   - Free Memory
   - Uptime
   - Operating System / Platform
   - Hostname
   - AI Prediction Status
   - AI Confidence Score
   - AI Prediction Reason

3. If asked about uptime, use the uptime value.
4. If asked about AI confidence, use the confidence value inside aiPrediction.
5. If asked about AI status, use the status inside aiPrediction.
6. If asked about CPU usage, use cpuValue or cpuUsage.
7. If asked about memory, use the corresponding memory values.
8. Never say information is unavailable if it exists in the dashboard data.
9. Never invent or guess values.
10. If a requested value is genuinely missing, clearly say so.
11. Explain technical terms in simple English.
12. Keep answers short, friendly and helpful.
13. You are PulseAI Assistant. Answer questions about the user's PC and dashboard.
          `,
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

    return "❌ AI unavailable. Please try again.";
  }
};

module.exports = {
  askChatbot,
};
