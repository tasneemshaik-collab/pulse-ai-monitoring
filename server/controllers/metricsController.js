const os = require("os");
const Metrics = require(
  "../models/Metrics"
);

const getPrediction =
  require(
    "../services/aiPredictionService"
  );

const User = require(
  "../models/User"
);

const {
  sendAlertEmail,
} = require(
  "../services/emailService"
);

/* ==========================
   EMAIL COOLDOWNS
========================== */

let lastRamAlert = 0;
let lastCpuAlert = 0;
let lastUptimeAlert = 0;

const RAM_COOLDOWN =
  30 * 60 * 1000; // 30 mins

const CPU_COOLDOWN =
  30 * 60 * 1000; // 30 mins

const UPTIME_COOLDOWN =
  6 * 60 * 60 * 1000; // 6 hrs

const getSystemMetrics =
  async (req, res) => {
    try {

      /* ==========================
         CPU
      ========================== */

      const cpus =
        os.cpus();

      let idle = 0;
      let total = 0;

      cpus.forEach(
        (cpu) => {
          for (
            let type in
            cpu.times
          ) {
            total +=
              cpu.times[
                type
              ];
          }

          idle +=
            cpu.times
              .idle;
        }
      );

      const cpuUsage =
        (
          100 -
          (idle /
            total) *
            100
        ).toFixed(2);

      /* ==========================
         MEMORY
      ========================== */

      const totalMemory =
        (
          os.totalmem() /
          1024 /
          1024 /
          1024
        ).toFixed(2);

      const freeMemory =
        (
          os.freemem() /
          1024 /
          1024 /
          1024
        ).toFixed(2);

      const usedMemory =
        (
          totalMemory -
          freeMemory
        ).toFixed(2);

      const ramPercent =
        (
          (usedMemory /
            totalMemory) *
          100
        ).toFixed(2);

      /* ==========================
         UPTIME
      ========================== */

      const uptime =
        (
          os.uptime() /
          3600
        ).toFixed(2);

      /* ==========================
         AI Prediction
      ========================== */

      const aiPrediction =
        await getPrediction(
          parseFloat(
            cpuUsage
          ),
          parseFloat(
            usedMemory
          )
        );

      /* ==========================
         FINAL DATA
      ========================== */

      const metricsData =
        {
          cpuUsage:
            `${cpuUsage}%`,

          cpuValue:
            parseFloat(
              cpuUsage
            ),

          totalMemory:
            `${totalMemory} GB`,

          usedMemory:
            `${usedMemory} GB`,

          usedMemoryValue:
            parseFloat(
              usedMemory
            ),

          freeMemory:
            `${freeMemory} GB`,

          uptime:
            `${uptime} hours`,

          platform:
            os.platform(),

          hostname:
            os.hostname(),

          aiPrediction,
        };

      /* ==========================
         SAVE TO DB
      ========================== */

      const savedMetric =
        await Metrics.create(
          metricsData
        );

      console.log(
        "Saved to MongoDB ✅",
        savedMetric._id
      );

      /* ==========================
         ALERT SYSTEM
      ========================== */

      const users =
        await User.find();

      const now =
        Date.now();

      for (
        const user of users
      ) {

        /* RAM ALERT */
        if (
          ramPercent >
            80 &&
          now -
            lastRamAlert >
            RAM_COOLDOWN
        ) {

          await sendAlertEmail(
            user.email,
            "⚠️ PulseAI RAM Alert",
            `
PulseAI Warning

Your RAM usage is high.

RAM Usage:
${ramPercent}%

Consider closing apps or restarting.
            `
          );

          console.log(
            `RAM alert sent to ${user.email}`
          );

          lastRamAlert =
            now;
        }

        /* CPU ALERT */
        if (
          cpuUsage >
            80 &&
          now -
            lastCpuAlert >
            CPU_COOLDOWN
        ) {

          await sendAlertEmail(
            user.email,
            "🔥 PulseAI CPU Alert",
            `
PulseAI Warning

CPU usage is critical.

CPU Usage:
${cpuUsage}%

High CPU may slow your PC.
            `
          );

          console.log(
            `CPU alert sent to ${user.email}`
          );

          lastCpuAlert =
            now;
        }

        /* UPTIME ALERT */
        if (
          uptime >
            9 &&
          now -
            lastUptimeAlert >
            UPTIME_COOLDOWN
        ) {

          await sendAlertEmail(
            user.email,
            "⏰ PulseAI Reminder",
            `
Your system has been ON for more than 9 hours.

Current uptime:
${uptime} hours

You may want to restart or rest your system.
            `
          );

          console.log(
            `Uptime reminder sent to ${user.email}`
          );

          lastUptimeAlert =
            now;
        }
      }

      res.json(
        metricsData
      );

    } catch (
      error
    ) {

      console.error(
        "Mongo Save Error ❌"
      );

      console.error(
        error
      );

      res.status(
        500
      ).json({
        message:
          "Error fetching metrics",
        error:
          error.message,
      });
    }
  };

module.exports = {
  getSystemMetrics,
};