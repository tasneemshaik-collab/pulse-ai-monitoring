require("dotenv").config();

const express =
  require("express");

const mongoose =
  require("mongoose");

const cors =
  require("cors");

const metricsRoutes =
  require(
    "./routes/metricsRoutes"
  );
const authRoutes =
require("./routes/authRoutes");

const chatbotRoutes =
  require(
    "./routes/chatbotRoutes"
  );

const app = express();

const PORT =
  process.env.PORT ||
  5000;


/* Middleware */
app.use(cors());

app.use(
  express.json()
);

/* MongoDB Connection */
mongoose
  .connect(
    process.env
      .MONGO_URI
  )
  .then(() => {
    console.log(
      "MongoDB Connected Successfully ✅"
    );
  })
  .catch((err) => {
    console.error(
      "MongoDB Error:",
      err
    );
  });

/* Routes */
app.use(
  "/api/metrics",
  metricsRoutes
);
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/chatbot",
  chatbotRoutes
);

/* Home Route */
app.get(
  "/",
  (
    req,
    res
  ) => {
    res.send(
      "PulseAI Backend Running 🚀"
    );
  }
);

/* Start Server */
app.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT}`
    );

    console.log(
      "Socket service disabled for now ✅"
    );
  }
);