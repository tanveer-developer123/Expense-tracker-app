import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // set full name in profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: fullName });
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form
        onSubmit={handleSignup}
        className="bg-zinc-900 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center">
          Create Account
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center font-medium">
            {error}
          </p>
        )}

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Full Name</label>
          <div className="flex items-center bg-zinc-800 rounded-lg px-3">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="John Doe"
              className="w-full bg-transparent py-2 focus:outline-none text-white placeholder-gray-400"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Email</label>
          <div className="flex items-center bg-zinc-800 rounded-lg px-3">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="example@email.com"
              className="w-full bg-transparent py-2 focus:outline-none text-white placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className=" block text-sm font-medium mb-1">Password</label>
          <div className="mb-6 flex items-center bg-zinc-800 rounded-lg px-3">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type={password ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-transparent py-2 focus:outline-none text-white placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setPassword((s) => !s)}
              className="ml-2 p-1 text-gray-300 hover:text-white"
              aria-label={password ? "Hide password" : "Show password"}
            >
              {password ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Modern Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-white text-black font-semibold text-lg shadow-md hover:bg-gray-200 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-sm mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-white font-semibold hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
