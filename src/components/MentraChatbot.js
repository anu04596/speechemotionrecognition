import React, { useState, useEffect, useRef, useCallback } from "react";
import "./MentraChatbot.css";
import { scriptureInfo } from "./scriptureInfo";
import { emotionKeywords } from "./emotionKeywords";

const MentraChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm Mentra 👋 How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  // Updated sendMessage function using useCallback
  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { from: "user", text: trimmed };
    const botMsg = getScriptureResponse(trimmed.toLowerCase());
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  }, [input]);

  // Scroll to bottom when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getScriptureResponse = (userInput) => {
    const matchedEmotions = [];

    // Match user input with emotion keywords
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      for (let keyword of keywords) {
        if (userInput.includes(keyword)) {
          matchedEmotions.push(emotion);
          break; // Match one keyword per emotion
        }
      }
    }

    if (matchedEmotions.length > 0) {
      const primaryEmotion = matchedEmotions[0];

      // Check if the primaryEmotion exists in scriptureInfo
      const scripture = scriptureInfo[primaryEmotion];
      if (scripture) {
        const { title, description, solution } = scripture;
        return {
          from: "bot",
          text: `🧠 *${title}*\n\n${description}\n\n*Solution:*\n${solution}`,
        };
      }
    }

    // Fallback response if no emotion matched or scripture not found
    return {
      from: "bot",
      text:
        "🙏 I'm here to help, but I couldn't quite identify how you're feeling. Try expressing your emotion with words like *anxious*, *stressed*, *alone*, *angry*, or *low*.",
    };
  };

  return (
    <div className="mentra-chatbot">
      <div className="chat-icon" onClick={toggleChat} title="Open Mentra Bot">
        💬
      </div>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            Mentra Bot
            <button className="close-btn" onClick={toggleChat}>
              ×
            </button>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your feelings..."
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentraChatbot;
