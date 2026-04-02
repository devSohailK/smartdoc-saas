import { useState, useRef } from "react";
import documentService from "../../services/document.service.js";

const UploadZone = ({ onUploaded }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      return;
    }

    setError("");
    setUploading(true);
    setProgress(0);

    try {
      const data = await documentService.upload(file, setProgress);
      onUploaded(data.document);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div className="mb-8">
      {/* Drop zone */}
      <div
        onClick={() => !uploading && inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className="flex flex-col items-center justify-center gap-3 py-10 px-6 rounded-xl transition-all"
        style={{
          border: `2px dashed ${dragging ? "var(--color-primary)" : "#1e3a5f"}`,
          backgroundColor: dragging ? "#0a1628" : "transparent",
          cursor: uploading ? "not-allowed" : "pointer",
        }}
      >
        {uploading ? (
          <>
            {/* Progress state */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
              style={{ backgroundColor: "#0f2035" }}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="animate-spin">
                <circle cx="12" cy="12" r="10" stroke="#1e3a5f" strokeWidth="2" />
                <path d="M12 2a10 10 0 0110 10" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-medium text-white">Processing your PDF...</p>
            <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#1e293b" }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: "var(--color-primary)" }}
              />
            </div>
            <p className="text-xs" style={{ color: "#475569" }}>{progress}% uploaded</p>
          </>
        ) : (
          <>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
              style={{ backgroundColor: "#0f2035" }}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white">
                Drop your PDF here, or{" "}
                <span style={{ color: "var(--color-primary)" }}>browse</span>
              </p>
              <p className="text-xs mt-1" style={{ color: "#475569" }}>
                PDF files only · Max 5MB
              </p>
            </div>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs mt-2 flex items-center gap-1.5" style={{ color: "#fca5a5" }}>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#fca5a5" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
};

export default UploadZone;
