const express =
  require("express");

const router =
  express.Router();

const protect =
  require(
    "../middleware/authMiddleware"
  );

const {
  chatWithAI,
  getChatHistory,
} = require(
  "../controllers/chatbotController"
);

router.post(
  "/",
  protect,
  chatWithAI
);

router.get(
  "/history",
  protect,
  getChatHistory
);

module.exports =
  router;