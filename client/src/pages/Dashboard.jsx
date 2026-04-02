import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar.jsx";
import UploadZone from "../components/dashboard/UploadZone.jsx";
import DocumentCard from "../components/dashboard/DocumentCard.jsx";
import documentService from "../services/document.service.js";

const DashboardPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getAll();
      setDocuments(data.documnets || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleUploaded = (newDoc) => setDocuments((prev) => [newDoc, ...prev]);
  const handleDeleteRequest = (docId) => setDeleteConfirm(docId);

  const handleDeleteConfirm = async () => {
    try {
      await documentService.delete(deleteConfirm);
      setDocuments((prev) => prev.filter((d) => d._id !== deleteConfirm));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--color-bg)" }}>
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">My Documents</h1>
          <p className="text-sm" style={{ color: "#64748b" }}>
            Upload a PDF and start a conversation with it
          </p>
        </div>

        {/* Upload zone */}
        <UploadZone onUploaded={handleUploaded} />

        {/* Documents section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent Documents</h2>
            {documents.length > 0 && (
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: "#0f2035", color: "#64748b", border: "1px solid #1e3a5f" }}
              >
                {documents.length} {documents.length === 1 ? "file" : "files"}
              </span>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="animate-spin">
                <circle cx="12" cy="12" r="10" stroke="#1e3a5f" strokeWidth="2" />
                <path d="M12 2a10 10 0 0110 10" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}

          {/* Empty state */}
          {!loading && documents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "#0f2035" }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2v6h6" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: "#475569" }}>No documents yet</p>
              <p className="text-xs" style={{ color: "#334155" }}>Upload a PDF above to get started</p>
            </div>
          )}

          {/* Grid */}
          {!loading && documents.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {documents.map((doc) => (
                <DocumentCard key={doc._id} document={doc} onDelete={handleDeleteRequest} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="rounded-xl p-6 w-full max-w-sm mx-4"
            style={{ backgroundColor: "var(--color-card)", border: "1px solid #1e3a5f" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#2d1515" }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M9 6V4h6v2"
                  stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-base mb-1">Delete document?</h3>
            <p className="text-sm mb-6" style={{ color: "#64748b" }}>
              This will permanently delete the document and all its chat history. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: "#0f2035", color: "#94a3b8", border: "1px solid #1e3a5f" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: "#7f1d1d", color: "#fca5a5" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#991b1b")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#7f1d1d")}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;