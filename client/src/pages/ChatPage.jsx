import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
import chatService from "../services/chat.service.js";

const ChatPage = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await chatService.getHistory(docId);
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setFetching(false);
      }
    };
    loadHistory();
  }, [docId]);

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // Optimistically add user message
    const userMessage = { role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await chatService.sendMessage(docId, text);
      const aiMessage = { role: "assistant", content: data.reply, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errMessage = {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--color-bg)" }}>
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <div
          className="flex items-center gap-3 px-6 py-4 shrink-0"
          style={{ backgroundColor: "#0a1628", borderBottom: "1px solid #1e3a5f" }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: "#64748b" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>

          <div className="w-px h-4" style={{ backgroundColor: "#1e3a5f" }} />

          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#0f2035" }}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                  stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 2v6h6" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-medium text-white truncate">Document Chat</p>
          </div>

          {/* Message count badge */}
          {messages.length > 0 && (
            <span
              className="ml-auto text-xs px-2 py-1 rounded-full shrink-0"
              style={{ backgroundColor: "#0f2035", color: "#64748b", border: "1px solid #1e3a5f" }}
            >
              {messages.length} messages
            </span>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">

          {/* Loading history */}
          {fetching && (
            <div className="flex items-center justify-center py-16">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="animate-spin">
                <circle cx="12" cy="12" r="10" stroke="#1e3a5f" strokeWidth="2" />
                <path d="M12 2a10 10 0 0110 10" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}

          {/* Empty state */}
          {!fetching && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 gap-4 py-16">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#0f2035" }}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                    stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white font-medium text-sm mb-1">Start the conversation</p>
                <p className="text-xs" style={{ color: "#475569" }}>
                  Ask anything about your document
                </p>
              </div>
              {/* Suggested questions */}
              <div className="flex flex-col gap-2 mt-2 w-full max-w-sm">
                {[
                  "Summarize this document",
                  "What are the key points?",
                  "What is the main conclusion?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-xs px-4 py-2.5 rounded-lg text-left transition-all"
                    style={{
                      backgroundColor: "#0f2035",
                      border: "1px solid #1e3a5f",
                      color: "#64748b",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {!fetching && messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col gap-1 max-w-2xl ${msg.role === "user" ? "ml-auto items-end" : "items-start"}`}
            >
              {/* Role label */}
              <span className="text-xs px-1" style={{ color: "#334155" }}>
                {msg.role === "user" ? "You" : "SmartDocs AI"}
              </span>

              {/* Bubble */}
              <div
                className="px-4 py-3 rounded-xl text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? { backgroundColor: "var(--color-primary)", color: "#fff", borderRadius: "16px 16px 4px 16px" }
                    : {
                        backgroundColor: msg.isError ? "#2d1515" : "var(--color-card)",
                        color: msg.isError ? "#fca5a5" : "#e2e8f0",
                        border: `1px solid ${msg.isError ? "#7f1d1d" : "#1e3a5f"}`,
                        borderRadius: "16px 16px 16px 4px",
                      }
                }
              >
                {msg.content}
              </div>

              {/* Timestamp */}
              <span className="text-xs px-1" style={{ color: "#1e3a5f" }}>
                {formatTime(msg.timestamp)}
              </span>
            </div>
          ))}

          {/* AI typing indicator */}
          {loading && (
            <div className="flex flex-col gap-1 max-w-2xl items-start">
              <span className="text-xs px-1" style={{ color: "#334155" }}>SmartDocs AI</span>
              <div
                className="px-4 py-3 rounded-xl flex items-center gap-1.5"
                style={{ backgroundColor: "var(--color-card)", border: "1px solid #1e3a5f", borderRadius: "16px 16px 16px 4px" }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: "#475569",
                      animation: `bounce 1.2s infinite ${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div
          className="px-6 py-4 shrink-0"
          style={{ backgroundColor: "#0a1628", borderTop: "1px solid #1e3a5f" }}
        >
          <div
            className="flex items-end gap-3 px-4 py-3 rounded-xl"
            style={{ backgroundColor: "var(--color-card)", border: "1px solid #1e3a5f" }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your document..."
              rows={1}
              className="flex-1 text-sm text-white outline-none resize-none"
              style={{
                backgroundColor: "transparent",
                caretColor: "var(--color-primary)",
                lineHeight: "1.6",
                maxHeight: "120px",
                color: "#e2e8f0",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
              style={{
                backgroundColor: input.trim() && !loading ? "var(--color-primary)" : "#0f2035",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                  stroke={input.trim() && !loading ? "#fff" : "#334155"}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-center mt-2" style={{ color: "#1e3a5f" }}>
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Bounce animation for typing indicator */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ChatPage;