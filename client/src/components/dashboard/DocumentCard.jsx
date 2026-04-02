import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  const truncateName = (name, max = 36) =>
    name.length > max ? name.slice(0, max) + "..." : name;

  return (
    <div
      className="flex flex-col justify-between p-5 rounded-xl transition-all group"
      style={{
        backgroundColor: "var(--color-card)",
        border: "1px solid #1e3a5f",
        minHeight: "160px",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2563eb66")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e3a5f")}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        {/* PDF icon + name */}
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#0f2035" }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2v6h6M9 13h6M9 17h4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium leading-snug wrap-break-word">
              {truncateName(document.filename)}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
              {formatDate(document.createdAt)}
            </p>
          </div>
        </div>
        <StatusBadge status={document.status} />
      </div>

      {/* Bottom row — actions */}
      <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: "1px solid #1e293b" }}>
        <button
          onClick={() => navigate(`/chat/${document._id}`)}
          disabled={document.status !== "ready"}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
          style={{
            backgroundColor: document.status === "ready" ? "var(--color-primary)" : "#1e293b",
            color: document.status === "ready" ? "#fff" : "#475569",
            cursor: document.status === "ready" ? "pointer" : "not-allowed",
          }}
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Chat
        </button>

        <button
          onClick={() => onDelete(document._id)}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
          style={{ color: "#475569" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fca5a5";
            e.currentTarget.style.backgroundColor = "#2d1515";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#475569";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
            <path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M9 6V4h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
