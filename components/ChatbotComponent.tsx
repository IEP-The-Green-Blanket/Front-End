"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";

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
            : "ERROR: Failed to establish uplink with Intelligence Engine.", 
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
    <div className="w-full flex flex-col items-center pt-1 pb-24 px-4 sm:px-6 font-sans">
      
      {/* HEADER */}
      <div className="w-full max-w-4xl text-center mb-1.5">
        {/* FIX: Added 'hidden md:block' to hide on mobile but keep on desktop */}
        <h1 className="hidden md:block text-[10px] font-black italic uppercase tracking-[0.2em] text-emerald-600 mb-0">
          Environmental Intelligence Engine
        </h1>
        <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tighter uppercase leading-tight mt-1 md:mt-0">
          Chatbot Assistant
        </h2>
      </div>

      {/* CHAT CONTAINER */}
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-[2rem] p-3 flex flex-col shadow-lg border-2 border-slate-900 h-[calc(100dvh-230px)] min-h-[350px]">
        
        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 scroll-smooth custom-scrollbar">
          
          {/* EMPTY STATE */}
          {messages.length === 0 && (
            <div className="m-auto text-center opacity-60 px-2">
              <Sparkles className="mx-auto mb-2 text-emerald-500 w-8 h-8" />
              <p className="text-slate-600 text-[10px] md:text-xs font-black uppercase tracking-[0.1em] leading-relaxed">
                Awaiting Ingestion Inquiry... <br />
                <span className="italic text-emerald-500 mt-1 block">"Can I swim in the dam today?"</span>
              </p>
            </div>
          )}

          {/* MESSAGE BUBBLES */}
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <div className="hidden sm:flex bg-slate-900 p-2 rounded-xl text-emerald-500 shrink-0">
                  <Bot size={16} />
                </div>
              )}
              
              <div 
                className={`px-3 py-2.5 max-w-[90%] sm:max-w-[85%] text-[13px] leading-relaxed shadow-sm ${
                  msg.sender === "user" 
                    ? "bg-emerald-500 text-white rounded-2xl rounded-br-sm font-bold" 
                    : "bg-slate-100 text-slate-900 rounded-2xl rounded-bl-sm font-medium border border-slate-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* TYPING INDICATOR */}
          {isTyping && (
            <div className="flex items-center gap-2 justify-start">
              <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.1em] border border-slate-200">
                Analyzing Telemetry...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="mt-3 p-1.5 bg-slate-50 rounded-2xl border-2 border-slate-900 flex items-center gap-2 shrink-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Query Intelligence..."
            className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-900 px-3 placeholder:text-slate-400 placeholder:font-medium w-full"
          />

          <button
            onClick={sendMessage}
            disabled={isTyping}
            className="w-10 h-10 flex items-center justify-center bg-slate-900 text-emerald-500 rounded-xl shrink-0 transition-transform active:scale-90 disabled:opacity-50"
          >
            {isTyping ? <Bot className="animate-pulse w-4 h-4" /> : <Send className="w-4 h-4 ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}