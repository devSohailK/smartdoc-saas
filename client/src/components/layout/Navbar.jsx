import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";

const Navbar = () => {

    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuthStore();
    const [menuOpen, setMenuOpen] = useState(false);


    const handleLogout = () => {
        logout();
        navigate("/auth");
    }

    return (
        <nav className="w-full px-6 py-4 flex items-center justify-between bg-[#0a1628] border-b border-[#1e3a5f] relative">

            <div
                className="flex gap-2.5 items-center cursor-pointer"
                onClick={() => { navigate("/") }}
            >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                        <path
                            d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
                <span className="text-white font-semibold text-lg">SmartDocs</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
                {["Features", "Pricing", "About"].map((item) => (
                    <button
                        key={item}
                        className="text-sm text-slate-500 hover:text-white transition-colors"
                    >
                        {item}
                    </button>
                ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
                {isAuthenticated ? (
                    <>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="text-sm font-medium px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium px-4 py-2 rounded-lg bg-[#0f2035] border border-[#1e3a5f] text-slate-400 hover:text-red-300 transition-all"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => navigate("/auth")}
                            className="text-sm font-medium px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                            Sign in
                        </button>

                        <button
                            onClick={() => navigate("/auth")}
                            className="text-sm font-medium px-4 py-2 rounded-lg text-white bg-primary hover:bg-blue-700 transition-colors"
                        >
                            Get started
                        </button>
                    </>
                )}
            </div>

            
            <button
                className="md:hidden flex flex-col gap-1.5 p-1"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span className="w-5 h-0.5 bg-slate-400"></span>
                <span className="w-5 h-0.5 bg-slate-400"></span>
                <span className="w-5 h-0.5 bg-slate-400"></span>
            </button>


            {menuOpen && (
                <div className="absolute top-16 left-0 right-0 z-50 px-6 py-4 flex flex-col gap-3 md:hidden bg-[#0a1628] border-b border-[#1e3a5f]">

                    {["Features", "Pricing", "About"].map((item) => (
                        <button
                            key={item}
                            className="text-sm text-left py-1 text-slate-500"
                        >
                            {item}
                        </button>
                    ))}

                    <div className="flex flex-col gap-2 pt-2 border-t border-[#1e3a5f]">
                        {isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => {
                                        navigate("/dashboard");
                                        setMenuOpen(false);
                                    }}
                                    className="text-sm py-2 text-left text-slate-400"
                                >
                                    Dashboard
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="text-sm py-2 text-left text-red-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        navigate("/auth");
                                        setMenuOpen(false);
                                    }}
                                    className="text-sm py-2 text-left text-slate-400"
                                >
                                    Sign in
                                </button>

                                <button
                                    onClick={() => {
                                        navigate("/auth");
                                        setMenuOpen(false);
                                    }}
                                    className="text-sm py-2 px-4 rounded-lg text-white text-center bg-primary"
                                >
                                    Get started
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

        </nav>
    )
}

export default Navbar;