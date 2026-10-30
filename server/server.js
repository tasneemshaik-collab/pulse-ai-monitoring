require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const metricsRoutes = require("./routes/metricsRoutes");
const authRoutes = require("./routes/authRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

/* ===========================
   Middleware
=========================== */

app.use(cors());
app.use(express.json());

/* ===========================
   Routes
=========================== */

app.use("/api/metrics", metricsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.get("/", (req, res) => {
  res.send("PulseAI Backend Running 🚀");
});

/* ===========================
   MongoDB + Start Server
=========================== */

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB Connected Successfully ✅");

    mongoose.connection.on("connected", () => {
      console.log("Mongoose Connected ✅");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Mongoose Error ❌");
      console.log(err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose Disconnected ⚠️");
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Socket service disabled for now ✅");
    });

  } catch (err) {
    console.error("MongoDB Connection Failed ❌");
    console.error(err);
    process.exit(1);
  }
};

startServer();