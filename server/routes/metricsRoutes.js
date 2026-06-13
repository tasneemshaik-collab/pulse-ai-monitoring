const express = require("express");

const router = express.Router();

const {
  getSystemMetrics,
} = require(
  "../controllers/metricsController"
);

router.get("/", getSystemMetrics);

module.exports = router;