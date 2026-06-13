const {
  askChatbot,
} = require(
  "../services/chatbotService"
);

const Chat = require(
  "../models/Chat"
);

exports.chatWithAI =
  async (
    req,
    res
  ) => {
    console.log(
  "🚀 chatWithAI hit"
);
    try {
      const {
        question,
        metrics,
      } = req.body;

      if (!question) {
        return res
          .status(400)
          .json({
            message:
              "Question required",
          });
      }

      // Ask AI
      const aiReply =
        await askChatbot(
          question,
          metrics
        );

      // Save chat
      if (req.user) {
        await Chat.create({
          user:
            req.user._id,
          message:
            question,
          response:
            aiReply,
        });
      }

      res.json({
        reply:
          aiReply,
      });
    } catch (
      error
    ) {
      console.error(
        "Chat Error:",
        error
      );

      res.status(500).json({
        message:
          "Server error",
      });
    }
  };

exports.getChatHistory =
  async (
    req,
    res
  ) => {
    try {
      const chats =
        await Chat.find({
          user:
            req.user._id,
        }).sort({
          createdAt:
            1,
        });

      res.json(chats);
    } catch (
      error
    ) {
      res.status(500).json({
        message:
          "Failed to fetch history",
      });
    }
  };