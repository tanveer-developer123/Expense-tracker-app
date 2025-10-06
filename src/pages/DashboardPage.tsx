import React, { useState } from "react";
import { LogOut, PieChart, PlusCircle, Settings, ListFilter } from "lucide-react";
import AddExpense from "../sections/AddExpense";
import ExpenseList from "../sections/ExpenseList";
import Filters from "../sections/Filters";
import Reports from "../sections/Reports";
import ProfileSettings from "../sections/ProfileSettings";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const nav = useNavigate();
  const [filters, setFilters] = useState({
    category: "All",
    start: "",
    end: "",
  });

  const logout = async () => {
    await auth.signOut();
    nav("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white flex flex-col">
      {/* 🌟 Header / Navbar */}
      <header className="flex justify-between items-center px-6 py-4 backdrop-blur-md bg-gray-800/60 border-b border-gray-700 sticky top-0 z-10 shadow-lg">
        <h2 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          Expense Tracker
        </h2>
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-all duration-300"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </header>

      {/* 🌈 Main Content */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 flex-1">
        {/* 🧩 Left Column */}
        <div className="flex flex-col gap-6 md:col-span-1">
          <div className="group bg-gray-800/80 p-5 rounded-2xl shadow-lg border border-gray-700 hover:border-teal-500 transition-all duration-300 hover:shadow-teal-500/20">
            <div className="flex items-center gap-2 mb-3 text-teal-400">
              <PlusCircle className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Add Expense</h3>
            </div>
            <AddExpense />
          </div>

          <div className="group bg-gray-800/80 p-5 rounded-2xl shadow-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-purple-500/20">
            <div className="flex items-center gap-2 mb-3 text-purple-400">
              <Settings className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Profile Settings</h3>
            </div>
            <ProfileSettings />
          </div>
        </div>

        {/* 🧠 Right Column */}
        <div className="flex flex-col gap-6 md:col-span-2">
          <div className="group bg-gray-800/80 p-5 rounded-2xl shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-blue-500/20">
            <div className="flex items-center gap-2 mb-3 text-blue-400">
              <ListFilter className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Filters</h3>
            </div>
            <Filters filters={filters} setFilters={setFilters} />
          </div>

          <div className="group bg-gray-800/80 p-5 rounded-2xl shadow-lg border border-gray-700 hover:border-amber-500 transition-all duration-300 hover:shadow-amber-500/20">
            <div className="flex items-center gap-2 mb-3 text-amber-400">
              <PieChart className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Expense List</h3>
            </div>
            <ExpenseList filters={filters} />
          </div>

          <div className="group bg-gray-800/80 p-5 rounded-2xl shadow-lg border border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-green-500/20">
            <div className="flex items-center gap-2 mb-3 text-green-400">
              <PieChart className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Reports</h3>
            </div>
            <Reports filters={filters} />
          </div>
        </div>
      </main>
    </div>
  );
}
