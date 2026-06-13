import {
  useState,
  useEffect,
  useRef,
} from "react";
import axios from "axios";
import "./ChatBot.css";

function ChatBot({
  metrics,
}) {
  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const chatEndRef =
    useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView(
      {
        behavior:
          "smooth",
      }
    );
  }, [messages]);

  // Load old chat history
  useEffect(() => {
    const loadHistory =
      async () => {
        try {
          const user =
            JSON.parse(
              localStorage.getItem(
                "user"
              )
            );

          if (
            !user?.token
          )
            return;

          const res =
            await axios.get(
              "https://pulse-ai-monitoring.onrender.com/api/chatbot/history",
              {
                headers:
                  {
                    Authorization: `Bearer ${user.token}`,
                  },
              }
            );

          const formatted =
            res.data.flatMap(
              (
                chat
              ) => [
                {
                  role:
                    "user",
                  text:
                    chat.message,
                },
                {
                  role:
                    "assistant",
                  text:
                    chat.response,
                },
              ]
            );

          setMessages(
            formatted
          );
        } catch (
          error
        ) {
          console.error(
            "History Error:",
            error
          );
        }
      };

    loadHistory();
  }, []);

  const askAI =
    async () => {
      if (
        !question.trim()
      )
        return;

      const currentQuestion =
        question;

      const userMsg =
        {
          role:
            "user",
          text:
            currentQuestion,
        };

      setMessages(
        (prev) => [
          ...prev,
          userMsg,
        ]
      );

      setQuestion(
        ""
      );

      setLoading(
        true
      );

      try {
        const user =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          );

        const res =
          await axios.post(
            "https://pulse-ai-monitoring.onrender.com/api/chatbot",
            {
              question:
                currentQuestion,
              metrics,
            },
            {
              headers:
                {
                  Authorization: `Bearer ${user.token}`,
                },
            }
          );

        setMessages(
          (prev) => [
            ...prev,
            {
              role:
                "assistant",
              text:
                res
                  .data
                  .reply ||
                "No response received.",
            },
          ]
        );
      } catch (
        error
      ) {
        console.error(
          "Chat Error:",
          error
        );

        setMessages(
          (prev) => [
            ...prev,
            {
              role:
                "assistant",
              text:
                "❌ AI unavailable.",
            },
          ]
        );
      }

      setLoading(
        false
      );
    };

  return (
    <div className="chatbot-container">

      {/* Header */}
      <div className="chat-header">
        <h2>
          🤖 PulseAI
          Assistant
        </h2>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map(
          (
            msg,
            index
          ) => (
            <div
              key={
                index
              }
              className={`message ${
                msg.role ===
                "user"
                  ? "user-message"
                  : "ai-message"
              }`}
            >
              <strong>
                {msg.role ===
                "user"
                  ? "You"
                  : "AI"}
              </strong>

              <p>
                {
                  msg.text
                }
              </p>
            </div>
          )
        )}

        {loading && (
          <div className="typing">
            AI is typing...
          </div>
        )}

        <div
          ref={
            chatEndRef
          }
        />
      </div>

      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask about your system..."
          value={
            question
          }
          onChange={(
            e
          ) =>
            setQuestion(
              e
                .target
                .value
            )
          }
          onKeyDown={(
            e
          ) => {
            if (
              e.key ===
              "Enter"
            ) {
              askAI();
            }
          }}
        />

        <button
          onClick={
            askAI
          }
          disabled={
            loading
          }
        >
          {loading
            ? "..."
            : "Ask AI"}
        </button>
      </div>
    </div>
  );
}

export default ChatBot;