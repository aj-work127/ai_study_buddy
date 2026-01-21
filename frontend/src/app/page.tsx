"use client";

import { Fullscreen } from "lucide-react";
import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("explain");

  async function sendMessage(): Promise<void> {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage.content,
          mode,
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "assistant",
        content: data.answer,
      };

      setMessages((prev: Message[]) => [...prev, aiMessage]);
    } catch {
      setMessages((prev: Message[]) => [
        ...prev,
        { role: "assistant", content: "Backend error" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
  style={{
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
    background: "#0b0f19",
    color: "#e5e7eb",
  }}
>
  
  <div
    style={{
      padding: "16px",
      borderBottom: "8px solid #1f2937",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "25px"
    }}
  >
    <strong>AI Study Buddy</strong>

    <select
      value={mode}
      onChange={(e) => setMode(e.target.value)}
      style={{
        background: "#020617",
        color: "#e5e7eb",
        border: "1px solid #1f2937",
        padding: "6px 8px",
        borderRadius: 6,
        fontSize: "25px"
      }}
    >
      <option value="explain">Explain</option>
      <option value="summary">Summary</option>
      <option value="exam">Exam</option>
      <option value="steps">Steps</option>
    </select>
  </div>

  {/* Chat area */}
  <div
    style={{
      flex: 1,
      overflowY: "auto",
      padding: "20px",
      background: "#020617",
    }}
  >
    {messages.map((m, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          justifyContent: m.role === "user" ? "flex-end" : "flex-start",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            maxWidth: "70%",
            padding: "10px 14px",
            borderRadius: 12,
            background:
              m.role === "user" ? "#2563eb" : "#111827",
            color: "#f9fafb",
            whiteSpace: "pre-wrap",
            lineHeight: 1.5,
          }}
        >
          {m.content}
        </div>
      </div>
    ))}

    {loading && (
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: "#111827",
            color: "#9ca3af",
          }}
        >
          Thinking…
        </div>
      </div>
    )}
  </div>

  {/* Input bar */}
  <div
    style={{
      padding: "12px",
      borderTop: "1px solid #1f2937",
      display: "flex",
      gap: 8,
      background: "#020617",
    }}
  >
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") sendMessage();
      }}
      placeholder="Ask a question"
      style={{
        flex: 1,
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid #1f2937",
        background: "#020617",
        color: "#e5e7eb",
        outline: "none",
        fontSize: "20px"
      }}
    />

    <button
      onClick={sendMessage}
      disabled={loading}
      style={{
        padding: "10px 16px",
        borderRadius: 8,
        border: "none",
        background: "#2563eb",
        color: "white",
        cursor: "pointer",
        opacity: loading ? 0.6 : 1,
      }}
    >
      Send
    </button>
  </div>
</div>
  );
}
