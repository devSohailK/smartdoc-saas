import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
  ];

  const creditPercent = Math.min(((user?.credits ?? 0) / 10) * 100, 100);

  return (
    <aside
      className="flex flex-col justify-between h-screen w-60 shrink-0 px-4 py-6"
      style={{ backgroundColor: "#0a1628", borderRight: "1px solid #1e3a5f" }}
    >
      {/* Top */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 mb-8">
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

        {/* Nav items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full"
                style={{
                  backgroundColor: active ? "#0f2035" : "transparent",
                  color: active ? "var(--color-primary)" : "#64748b",
                  border: active ? "1px solid #1e3a5f" : "1px solid transparent",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#94a3b8"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "#64748b"; }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="flex flex-col gap-3">
        {/* Credits bar */}
        <div
          className="px-3 py-3 rounded-lg"
          style={{ backgroundColor: "#0f2035", border: "1px solid #1e3a5f" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: "#64748b" }}>Credits</span>
            <span className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
              {user?.credits ?? 0} left
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#1e293b" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${creditPercent}%`, backgroundColor: "var(--color-primary)" }}
            />
          </div>
        </div>

        {/* User row */}
        <div
          className="flex items-center justify-between px-3 py-2.5 rounded-lg"
          style={{ border: "1px solid #1e3a5f" }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{ backgroundColor: "#1e3a5f", color: "var(--color-primary)" }}
            >
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <p className="text-xs font-medium text-white truncate">{user?.name ?? "User"}</p>
          </div>
          <button
            onClick={handleLogout}
            style={{ color: "#475569" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fca5a5")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
            title="Logout"
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;