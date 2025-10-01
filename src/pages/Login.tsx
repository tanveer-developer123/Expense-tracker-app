// src/pages/Login.tsx
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const friendlyError = (code: string | undefined) => {
    switch (code) {
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/popup-closed-by-user":
        return "Google sign-in cancelled.";
      default:
        return "Something went wrong. Try again.";
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(friendlyError(err.code) || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoadingGoogle(true);
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err: any) {
      setError(friendlyError(err.code) || err.message);
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-extrabold mb-6 text-center">Welcome Back</h2>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center font-medium">{error}</p>
          )}

          <button
            onClick={handleGoogle}
            disabled={loadingGoogle}
            className="w-full flex items-center justify-center gap-3 py-2 rounded-xl bg-white text-black font-semibold mb-4 shadow-md hover:opacity-95 transition disabled:opacity-50"
          >
            <FcGoogle size={20} />
            {loadingGoogle ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="flex items-center text-sm text-gray-400 my-3">
            <div className="flex-1 h-px bg-zinc-800" />
            <div className="px-3">or</div>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="flex items-center bg-zinc-800 rounded-lg px-3">
                <FaEnvelope className="text-gray-400 mr-2" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-2 focus:outline-none text-white placeholder-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="flex items-center bg-zinc-800 rounded-lg px-3">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-transparent py-2 focus:outline-none text-white placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="ml-2 p-1 text-gray-300 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold text-lg shadow-md hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm mt-5 text-center text-gray-400">
            Don't have an account?{" "}
            <a href="/signup" className="text-white font-semibold hover:underline">
              Create account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
