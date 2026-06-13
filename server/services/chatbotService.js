console.log(
  "✅ chatbotService loaded"
);
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const askChatbot = async (
  question,
  metrics
) => {
  console.log(
  "🔥 askChatbot called"
);
  try {
    console.log(
      "Question:",
      question
    );
    
    console.log(
      "Metrics:",
      metrics
    );

    const cpu =
      metrics?.cpuValue || "unknown";

    const freeMemory =
      metrics?.freeMemory ||
      "unknown";

    const response =
      await groq.chat.completions.create({
        model:
          "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content: `You are PulseAI Assistant.
You help monitor PC health.
CPU Usage: ${cpu}%
Free Memory: ${freeMemory} GB
Keep answers short and helpful.`,
          },

          {
            role: "user",
            content: String(question),
          },
        ],

        temperature: 0.7,
      });

    console.log(
      "Groq Success"
    );

    return (
      response.choices?.[0]
        ?.message?.content ||
      "No response received."
    );
  } catch (error) {
  console.log("========= GROQ ERROR =========");

  console.log(error);

  console.log(
    error?.response?.data
  );

  console.log("==============================");

  return "❌ AI unavailable.";
}
};

module.exports = {
  askChatbot,
};