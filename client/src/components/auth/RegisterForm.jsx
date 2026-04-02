import { useState } from "react";




const RegisterForm = ({ onSubmit, loading, error }) => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="flex flex-col gap-4">
            {error && (
                <div
                    className="px-4 py-3 rounded-lg text-sm flex items-center gap-2 bg-[#2d1515] border border-[#7f1d1d] text-[#fca5a5]"
                >
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="#fca5a5" strokeWidth="2" />
                        <path d="M12 8v4M12 16h.01" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "#94a3b8" }}>Full name</label>
                <input
                    type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="sohail khan" required
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none bg-[#0f2035] border border-[#1e3a5f]"
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                    onBlur={(e) => (e.target.style.borderColor = "#1e3a5f")}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "#94a3b8" }}>Email address</label>
                <input
                    type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="you@example.com" required
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none bg-[#0f2035] border border-[#1e3a5f]"
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                    onBlur={(e) => (e.target.style.borderColor = "#1e3a5f")}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: "#94a3b8" }}>Password</label>
                <input
                    type="password" name="password" value={form.password} onChange={handleChange}
                    placeholder="••••••••" required
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none bg-[#0f2035] border border-[#1e3a5f]"
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                    onBlur={(e) => (e.target.style.borderColor = "#1e3a5f")}
                />
            </div>

            <button
                type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white mt-1"
                style={{
                    backgroundColor: loading ? "#1e3a5f" : "var(--color-primary)",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                }}
            >
                {loading ? "Creating account..." : "Create account"}
            </button>
        </form>
    );
};

export default RegisterForm;