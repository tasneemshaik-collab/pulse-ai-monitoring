const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "healthy",
    message: "PulseAI Monitoring API Running 🚀",
  });
});

module.exports = router;