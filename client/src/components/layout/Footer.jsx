import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const links = {
    Product: ["Features", "Pricing", "Changelog"],
    Company: ["About", "Blog", "Careers"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  };

  return (
    <footer
      className="w-full px-8 py-12"
      style={{ backgroundColor: "#0a1628", borderTop: "1px solid #1e3a5f" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div
              className="flex items-center gap-2.5 mb-4 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                  <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                    stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-white font-semibold text-base tracking-tight">SmartDocs</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
              Chat with your PDFs. Get answers instantly using AI.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: "#334155" }}>
                {section}
              </p>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <button
                      className="text-sm transition-colors"
                      style={{ color: "#475569" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
          style={{ borderTop: "1px solid #1e3a5f" }}
        >
          <p className="text-xs" style={{ color: "#334155" }}>
            © {new Date().getFullYear()} SmartDocs. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Twitter / X */}
            <button
              style={{ color: "#334155" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#64748b")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#334155")}
            >
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            {/* GitHub */}
            <button
              style={{ color: "#334155" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#64748b")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#334155")}
            >
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;