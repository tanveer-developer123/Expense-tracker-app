import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import {
  Wallet,
  PieChart,
  ShieldCheck,
  LogOut,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center px-6">
      <div className="max-w-4xl w-full text-center space-y-10">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl shadow-lg border border-white/10">
            <Wallet className="text-white w-16 h-16" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Expense Tracker
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Manage your finances smartly — track expenses, visualize insights,
            and stay in control.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold hover:from-blue-600 hover:to-purple-700 transition transform hover:scale-105"
          >
            Go to Dashboard <ArrowRight size={18} />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 font-semibold transition transform hover:scale-105"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-200">
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:scale-105 transition-transform shadow-lg">
            <Wallet className="mx-auto mb-4 text-blue-400" size={36} />
            <h3 className="font-bold text-lg mb-2">Quick Expense Logging</h3>
            <p className="text-sm text-gray-400">
              Add, edit, or delete your expenses effortlessly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:scale-105 transition-transform shadow-lg">
            <PieChart className="mx-auto mb-4 text-purple-400" size={36} />
            <h3 className="font-bold text-lg mb-2">Reports & Insights</h3>
            <p className="text-sm text-gray-400">
              Visualize your spending patterns with interactive charts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:scale-105 transition-transform shadow-lg">
            <ShieldCheck className="mx-auto mb-4 text-green-400" size={36} />
            <h3 className="font-bold text-lg mb-2">Secure & Private</h3>
            <p className="text-sm text-gray-400">
              Your financial data stays encrypted and secure.
            </p>
          </div>
        </div>

        {/* User Info */}
        <p className="mt-10 text-gray-500 text-sm">
          Logged in as{" "}
          <span className="font-semibold text-white">
            {currentUser?.email}
          </span>
        </p>
      </div>
    </div>
  );
}
