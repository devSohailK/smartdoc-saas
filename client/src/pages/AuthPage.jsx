import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import authService from "../services/auth.service.js";
import LoginForm from "../components/auth/LoginForm.jsx";
import RegisterForm from "../components/auth/RegisterForm.jsx";


const AuthPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async ({ email, password }) => {
    setLoading(true); setError("");
    try {
      const data = await authService.login(email, password);
      setAuth(data.user, data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally { setLoading(false); }
  };

  const handleRegister = async ({ name, email, password }) => {
    setLoading(true); setError("");
    try {
      const data = await authService.register(name, email, password);
      setAuth(data.user, data.accessToken);
      {console.log(data.accessToken);}
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally { setLoading(false); }
  };

  const toggle = () => { setIsLogin(!isLogin); setError(""); };

  return (
    <div
      className="min-h-screen flex justify-center items-center px-4" >

      {/* CARD */}
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl flex">

        {/* LEFT PANEL */}
        <div
          className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-card border-r border-[#1e3a5f]"
          
        >
          <div className="flex justify-center items-center gap-3 mb-12">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary"              
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-text font-semibold text-lg tracking-tight">
              SmartDocs
            </span>
          </div>

          <div>
            <h1
              className="text-4xl font-bold text-text leading-tight mb-6 font-['Georgia',serif]"
              
            >
              Turn your documents<br />
              <span className="text-primary">
                into conversations.
              </span>
            </h1>

            <p
              className="text-base mb-10 leading-[1.7] text-muted">
              Upload any PDF and start asking questions. Our AI reads,
              understands, and answers — instantly.
            </p>

            <div className="flex flex-col gap-5">
              {[
                { icon: "📄", label: "Upload PDF", desc: "Any document up to 5MB" },
                { icon: "🔍", label: "Ask anything", desc: "Natural language questions" },
                { icon: "⚡", label: "Instant answers", desc: "Powered by Gemini AI" },
              ].map((f) => (
                <div key={f.label} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-base shrink-0 bg-[#1e3a5f]"
                  >
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{f.label}</p>
                    <p className="text-sm text-[#64748b]">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm italic text-[#334155] mt-12 text-center">
            "Stop scrolling through pages. Just ask."
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 py-12 sm:px-16 bg-card">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text mb-1">
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-sm text-[#64748b]">
                {isLogin
                  ? "Sign in to access your documents"
                  : "Start chatting with your PDFs for free"}
              </p>
            </div>

            {isLogin ? (
              <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
            ) : (
              <RegisterForm
                onSubmit={handleRegister}
                loading={loading}
                error={error}
              />
            )}

            <p className="text-sm text-center mt-6 text-[#64748b]">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={toggle}
                className="font-medium text-primary"            
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;