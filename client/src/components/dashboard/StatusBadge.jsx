const statusConfig = {
  ready:      { label: "Ready",      bg: "#052e16", border: "#14532d", color: "#4ade80" },
  processing: { label: "Processing", bg: "#1c1007", border: "#78350f", color: "#fbbf24" },
  pending:    { label: "Pending",    bg: "#0c1a2e", border: "#1e3a5f", color: "#60a5fa" },
  failed:     { label: "Failed",     bg: "#2d1515", border: "#7f1d1d", color: "#fca5a5" },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
      }}
    >
      {/* Pulsing dot for processing */}
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          backgroundColor: config.color,
          animation: status === "processing" ? "pulse 1.5s infinite" : "none",
        }}
      />
      {config.label}
    </span>
  );
};

export default StatusBadge;
