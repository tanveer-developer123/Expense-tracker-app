import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { FaWallet, FaChartPie, FaSignOutAlt } from "react-icons/fa";

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center">
        {/* Icon / Logo */}
        <div className="flex justify-center mb-6">
          <FaWallet size={70} className="text-white" />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Expense Tracker App
        </h1>

        {/* Tagline */}
        <p className="text-gray-400 text-lg mb-8">
          Track your daily expenses, manage categories, and visualize your spending with charts.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition shadow-md"
          >
            Go to Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition shadow-md"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-300">
          <div className="bg-zinc-900 p-6 rounded-xl shadow-md hover:bg-zinc-800 transition">
            <FaWallet size={30} className="mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Easy Expense Logging</h3>
            <p className="text-sm">Quickly add, edit, or delete expenses in just a few clicks.</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-xl shadow-md hover:bg-zinc-800 transition">
            <FaChartPie size={30} className="mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Reports & Charts</h3>
            <p className="text-sm">Visualize your spending habits with beautiful charts.</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-xl shadow-md hover:bg-zinc-800 transition">
            <FaWallet size={30} className="mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Secure & Private</h3>
            <p className="text-sm">All your data is stored safely in your account.</p>
          </div>
        </div>

        {/* User Info */}
        <p className="mt-10 text-gray-500 text-sm">
          Logged in as <span className="font-semibold">{currentUser?.email}</span>
        </p>
      </div>
    </div>
  );
};

export default Home;
