import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";

const features = [
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 2v6h6M9 13h6M9 17h4" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Upload any PDF",
    desc: "Drag and drop your document. Contracts, research papers, manuals — anything up to 5MB.",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" stroke="var(--color-primary)" strokeWidth="2" />
        <path d="M21 21l-4.35-4.35" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Ask in plain English",
    desc: "No commands, no syntax. Just ask questions like you would ask a colleague.",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Instant AI answers",
    desc: "Powered by Gemini AI. Get accurate, context-aware answers from your document in seconds.",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Full chat history",
    desc: "Every conversation is saved. Come back anytime and pick up right where you left off.",
  },
];

const steps = [
  { number: "01", title: "Upload your PDF", desc: "Drop any PDF document into SmartDocs." },
  { number: "02", title: "Ask your question", desc: "Type anything you want to know about the document." },
  { number: "03", title: "Get your answer", desc: "Gemini AI reads the document and answers instantly." },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-20">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
          style={{ backgroundColor: "#0f2035", border: "1px solid #1e3a5f", color: "var(--color-primary)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--color-primary)" }} />
          Powered by Gemini AI
        </div>

        <h1
          className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
        >
          Chat with your{" "}
          <span style={{ color: "var(--color-primary)" }}>PDF documents</span>
          <br />like never before.
        </h1>

        <p className="text-base md:text-lg max-w-xl mb-10" style={{ color: "#64748b", lineHeight: "1.8" }}>
          Stop scrolling through pages. Upload your PDF and ask questions — SmartDocs finds the answers instantly using AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => navigate("/auth")}
            className="px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all"
            style={{ backgroundColor: "var(--color-primary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primary)")}
          >
            Get started for free
          </button>
          <button
            className="px-6 py-3 rounded-lg text-sm font-medium transition-all"
            style={{ color: "#64748b", border: "1px solid #1e3a5f" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
          >
            See how it works ↓
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>
            Everything you need
          </h2>
          <p className="text-sm" style={{ color: "#64748b" }}>
            Simple, powerful tools to get answers from any document.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-xl flex flex-col gap-4 transition-all"
              style={{ backgroundColor: "var(--color-card)", border: "1px solid #1e3a5f" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2563eb66")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e3a5f")}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#0f2035" }}
              >
                {f.icon}
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">{f.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 w-full" style={{ backgroundColor: "#0a1628" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>
              How it works
            </h2>
            <p className="text-sm" style={{ color: "#64748b" }}>Three steps to get answers from any PDF.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="flex flex-col items-start gap-4 relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-5 left-16 right-0 h-px"
                    style={{ backgroundColor: "#1e3a5f" }}
                  />
                )}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 relative z-10"
                  style={{ backgroundColor: "#0f2035", color: "var(--color-primary)", border: "1px solid #1e3a5f" }}
                >
                  {step.number}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{step.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center text-center px-6 py-24">
        <h2
          className="text-4xl font-bold text-white mb-4 max-w-xl"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Ready to stop searching and start asking?
        </h2>
        <p className="text-sm mb-8 max-w-md" style={{ color: "#64748b", lineHeight: "1.8" }}>
          Join thousands of users who save hours every week by chatting with their documents.
        </p>
        <button
          onClick={() => navigate("/auth")}
          className="px-8 py-3 rounded-lg text-sm font-semibold text-white transition-all"
          style={{ backgroundColor: "var(--color-primary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primary)")}
        >
          Start for free — no credit card needed
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;