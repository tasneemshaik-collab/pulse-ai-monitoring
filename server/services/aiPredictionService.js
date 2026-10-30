
const axios = require("axios");

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

const getPrediction = async (cpuValue, memoryValue) => {
  try {
    console.log("Calling AI...");
    console.log("AI Service:", AI_SERVICE_URL);
    console.log("CPU:", cpuValue);
    console.log("Memory:", memoryValue);

    const response = await axios.get(
      `${AI_SERVICE_URL}/predict`,
      {
        params: {
          cpu: cpuValue,
          memory: memoryValue,
        },
        timeout: 60000,
      }
    );

    console.log("AI Response:");
    console.log(response.data);

    return response.data;

  } catch (err) {
    console.log("========== AI ERROR ==========");
    console.log(err.message);

    if (err.response) {
      console.log(err.response.data);
    }

    return {
      status: "error",
      confidence: 0,
      reason: err.message,
    };
  }
};

module.exports = getPrediction;
