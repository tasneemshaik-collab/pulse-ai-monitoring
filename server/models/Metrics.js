const mongoose = require("mongoose");

const metricsSchema = new mongoose.Schema(
{
    cpuUsage: String,
    cpuValue: Number,

    totalMemory: String,

    usedMemory: String,
    usedMemoryValue: Number,

    freeMemory: String,

    uptime: String,

    platform: String,

    hostname: String,

    aiPrediction: {
        status: String,
        confidence: Number,
        reason: String,
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Metrics", metricsSchema);