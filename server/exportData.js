const mongoose = require("mongoose");
require("dotenv").config();

const Metrics = require("./models/Metrics");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected ✅");

    const metrics =
      await Metrics.find().sort({
        createdAt: 1,
      });

    const fs = require("fs");

    let csv =
      "cpu,memory,label\n";

    metrics.forEach((item) => {
      const cpu =
        parseFloat(
          item.cpuUsage
        );

      const memory =
        parseFloat(
          item.usedMemory
        );

      // Smart labeling
      const label =
        cpu > 70 ||
        memory > 14
          ? -1
          : 1;

      csv += `${cpu},${memory},${label}\n`;
    });

    fs.writeFileSync(
      "../ml-service/dataset/metrics.csv",
      csv
    );

    console.log(
      "Dataset exported successfully ✅"
    );

    process.exit();
  })
  .catch((err) => {
    console.error(err);
  });