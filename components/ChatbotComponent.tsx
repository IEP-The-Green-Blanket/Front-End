"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, User, Sparkles, AlertCircle } from "lucide-react";

export default function ChatbotComponent() {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsTyping(true);

    try {
      // NOTE: Added "/ask" to the endpoint based on your CORS logs showing a 404 at the base route.
      const res = await fetch("http://localhost:5000/api/Chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (res.status === 404) throw new Error("404");

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { text: data.response || "Telemetry response null.", sender: "bot" },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { 
          text: err.message === "404" 
            ? "CRITICAL: Intelligence Endpoint (/api/Chatbot/ask) not found. Verify backend routing." 
            : "ERROR: Failed to establish uplink with Harties Intelligence Engine.", 
          sender: "bot" 
        },
      ]);
    }
    setIsTyping(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ 
      padding: "40px 20px", 
      textAlign: "center", 
      minHeight: "100vh",
      background: "transparent"
    }}>
      
      {/* HEADER: Technical Intelligence Style */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ 
          fontSize: "14px", 
          fontWeight: 900, 
          fontStyle: "italic", 
          textTransform: "uppercase", 
          letterSpacing: "0.3em", 
          color: "#10b981", // Emerald-500
          marginBottom: "8px"
        }}>
          Environmental Intelligence Engine
        </h1>
        <h2 style={{ 
          fontSize: "42px", 
          fontWeight: 900, 
          color: "#0f172a", // Slate-900
          letterSpacing: "-0.03em",
          textTransform: "uppercase"
        }}>
          Chatbot Assistant
        </h2>
      </div>

      {/* CHAT CONTAINER: Glassmorphism / Shadow-2xl */}
      <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.85)", 
          backdropFilter: "blur(16px)", 
          borderRadius: "2.5rem", 
          padding: "35px",
          height: "650px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", 
          border: "2px solid #0f172a" // Brutalist High-Contrast Border
        }}
      >
        {/* MESSAGES AREA */}
        <div style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}
        >
          {messages.length === 0 && (
            <div style={{ marginTop: "120px", opacity: 0.6 }}>
                <Sparkles style={{ margin: "0 auto 15px", color: "#10b981" }} size={40} />
                <p style={{ 
                  color: "#475569", 
                  fontSize: "13px", 
                  fontWeight: 900, 
                  textTransform: "uppercase", 
                  letterSpacing: "0.15em" 
                }}>
                    Awaiting Ingestion Inquiry... <br />
                    <span style={{ fontStyle: "italic", color: "#10b981" }}>"Can I swim in the dam today?"</span>
                </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} style={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                alignItems: "flex-end",
                gap: "12px"
              }}
            >
              {msg.sender === "bot" && (
                <div style={{ background: "#0f172a", padding: "8px", borderRadius: "12px", color: "#10b981" }}>
                  <Bot size={18} />
                </div>
              )}
              
              <div style={{
                  padding: "16px 24px",
                  borderRadius: msg.sender === "user" ? "24px 24px 4px 24px" : "24px 24px 24px 4px",
                  background: msg.sender === "user" ? "#10b981" : "#f1f5f9", 
                  color: msg.sender === "user" ? "white" : "#0f172a",
                  maxWidth: "80%",
                  fontSize: "15px",
                  fontWeight: msg.sender === "user" ? 700 : 500,
                  lineHeight: "1.6",
                  textAlign: "left",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  border: msg.sender === "bot" ? "1px solid #e2e8f0" : "none"
                }}
              >
                {msg.text}
              </div>

              {msg.sender === "user" && (
                <div style={{ background: "#10b981", padding: "8px", borderRadius: "12px", color: "white" }}>
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div style={{ display: "flex", justifyContent: "flex-start", gap: "12px", alignItems: "center" }}>
                <div style={{ background: "#0f172a", padding: "8px", borderRadius: "12px", color: "#10b981" }}>
                  <Bot size={18} />
                </div>
                <div style={{ 
                  padding: "12px 20px", 
                  borderRadius: "20px", 
                  background: "#f1f5f9", 
                  color: "#64748b", 
                  fontSize: "12px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em"
                }}>
                   Analyzing Telemetry...
                </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT: Industrial UI Style */}
        <div style={{
            display: "flex",
            gap: "15px",
            marginTop: "30px",
            padding: "12px",
            background: "#f8fafc",
            borderRadius: "1.75rem",
            border: "2px solid #0f172a",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Query the Green Blanket Intelligence..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "16px",
              fontWeight: 700,
              color: "#0f172a",
              paddingLeft: "15px"
            }}
          />

          <button
            onClick={sendMessage}
            disabled={isTyping}
            style={{
                width: "54px",
                height: "54px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#0f172a", 
                color: "#10b981",
                border: "none",
                borderRadius: "16px",
                cursor: isTyping ? "not-allowed" : "pointer",
                transition: "transform 0.1s ease",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)"
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {isTyping ? <Bot className="animate-pulse" /> : <Send size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
}