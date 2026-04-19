import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Account created! Welcome 🎉");
        } else toast.error(data.message);
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Welcome back! 👋");
        } else toast.error(data.message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-primary to-accent p-14 text-white">
        <div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-8">
            <span className="text-white font-bold">Rx</span>
          </div>
          <h2 className="text-4xl font-display font-800 leading-tight">
            Your health journey
            <br />
            starts here.
          </h2>
          <p className="mt-4 text-blue-100 text-base leading-relaxed max-w-sm">
            Access 500+ verified doctors, book appointments instantly, and take
            control of your healthcare.
          </p>
        </div>
        <div className="space-y-4">
          {[
            { icon: "✓", text: "500+ Verified Specialists" },
            { icon: "✓", text: "Instant booking, no wait times" },
            { icon: "✓", text: "Secure payments via Stripe" },
          ].map((f) => (
            <div key={f.text} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                {f.icon}
              </div>
              <p className="text-blue-100 text-sm">{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-display font-800 text-gray-900">
              {state === "Sign Up" ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {state === "Sign Up"
                ? "Join thousands of patients today"
                : "Sign in to your account"}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-7">
            {["Sign Up", "Login"].map((s) => (
              <button
                key={s}
                onClick={() => setState(s)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${state === s ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {s}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {state === "Sign Up" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 shadow-md hover:shadow-glow flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Processing...
                </>
              ) : state === "Sign Up" ? (
                "Create Account →"
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {state === "Sign Up"
              ? "Already have an account? "
              : "New to MedCare? "}
            <button
              onClick={() =>
                setState(state === "Sign Up" ? "Login" : "Sign Up")
              }
              className="text-primary font-semibold hover:underline"
            >
              {state === "Sign Up" ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
