const axios = require("axios");

const getPrediction = async (
  cpuValue,
  memoryValue
) => {
  try {

    console.log(
      "Sending to AI:",
      cpuValue,
      memoryValue
    );

    const response =
      await axios.get(
        "http://127.0.0.1:8000/predict",
        {
          params: {
            cpu: cpuValue,
            memory: memoryValue,
          },
        }
      );

    return response.data;

  } catch (error) {

    console.error(
      "AI Service Error ❌"
    );

    console.error(
      error.response?.data ||
      error.message
    );

    return {
      status: "error",
      prediction:
        "AI service unavailable",
    };
  }
};

module.exports =
  getPrediction;