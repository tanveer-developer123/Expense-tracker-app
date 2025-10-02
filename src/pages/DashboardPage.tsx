import React, { useState } from "react";
import AddExpense from "../sections/AddExpense";
import ExpenseList from "../sections/ExpenseList";
import Filters from "../sections/Filters";
import Reports from "../sections/Reports";
import ProfileSettings from "../sections/ProfileSettings";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const nav = useNavigate();

  // 🔹 Global filter state (shared by Filters, ExpenseList, Reports)
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header / Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <h2 className="text-2xl font-bold tracking-wide">Expense Tracker</h2>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold transition"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6 md:col-span-1">
          <div className="bg-gray-800 p-4 rounded-xl shadow-md">
            <AddExpense />
          </div>
          <div className="bg-gray-800 p-4 rounded-xl shadow-md">
            <ProfileSettings />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 md:col-span-2">
          <div className="bg-gray-800 p-4 rounded-xl shadow-md">
            {/* Filters ko global state pass kar diya */}
            <Filters filters={filters} setFilters={setFilters} />
          </div>
          <div className="bg-gray-800 p-4 rounded-xl shadow-md">
            {/* ExpenseList ko filters diye */}
            <ExpenseList filters={filters} />
          </div>
          <div className="bg-gray-800 p-4 rounded-xl shadow-md">
            {/* Reports ko bhi filters diye */}
            <Reports filters={filters} />
          </div>
        </div>
      </main>
    </div>
  );
}
