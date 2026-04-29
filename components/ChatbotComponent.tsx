"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatbotComponent() {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsTyping(true); // Shows Chatbot is typing

    try {
      const res = await fetch("http://localhost:5000/api/Chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { text: data.response || "No response", sender: "bot" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Error connecting to chatbot.", sender: "bot" },
      ]);
    }
    setIsTyping(false);
  };

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ padding: "30px 20px", textAlign: "center" }}>
      <h1 style={{ marginBottom: "20px" }}>Chatbot Assistant</h1>

      {/* Chat container */}
      <div
        style={{
          maxWidth: "650px",
          margin: "0 auto",
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          height: "450px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "5px",
          }}
        >
          {messages.length === 0 && (
            <p style={{ color: "#777" }}>
              Ask something like: <br />
              <strong>“Can I swim?”</strong>
            </p>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background:
                    msg.sender === "user" ? "#2e7d32" : "#f1f1f1",
                  color: msg.sender === "user" ? "white" : "black",
                  maxWidth: "75%",
                  fontSize: "14px",
                  lineHeight: "1.4",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div
                style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "10px",
                }}
            >
                <div
                style={{
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: "#f1f1f1",
                    color: "black",
                    maxWidth: "75%",
                    fontSize: "14px",
                }}
                >
                Typing...
                </div>
            </div>
            )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your question..."
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px",
            }}
          />

          <button
            onClick={sendMessage}
            disabled={isTyping}
            style={{
                padding: "12px 18px",
                backgroundColor: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: isTyping ? "not-allowed" : "pointer",
                opacity: isTyping ? 0.6 : 1,
                fontWeight: "bold",
            }}
            >
            {isTyping ? "..." : "Send"}
         </button>
        </div>
      </div>
    </div>
  );
}