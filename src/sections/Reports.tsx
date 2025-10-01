import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import {
  Pie,
  Bar,
} from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Reports() {
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "users", auth.currentUser.uid, "expenses"));
    const unsub = onSnapshot(q, (snap) => {
      setExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const byCategory: Record<string, number> = {};
  let totalThisMonth = 0;
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  expenses.forEach((e: any) => {
    const amt = Number(e.amount || 0);
    const d = e.date?.toDate ? e.date.toDate() : e.date ? new Date(e.date) : new Date();
    const cat = e.category || "Other";
    byCategory[cat] = (byCategory[cat] || 0) + amt;
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      totalThisMonth += amt;
    }
  });

  const pieData = {
    labels: Object.keys(byCategory),
    datasets: [
      {
        data: Object.values(byCategory),
        backgroundColor: [
          "#4f46e5",
          "#16a34a",
          "#dc2626",
          "#f59e0b",
          "#0ea5e9",
          "#9333ea",
        ],
      },
    ],
  };

  const months: string[] = [];
  const monthAmounts: number[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleString("default", { month: "short" });
    months.push(label);
    monthAmounts.push(0);
  }

  expenses.forEach((e: any) => {
    const amt = Number(e.amount || 0);
    const d = e.date?.toDate ? e.date.toDate() : e.date ? new Date(e.date) : new Date();
    const label = d.toLocaleString("default", { month: "short" });
    const idx = months.indexOf(label);
    if (idx >= 0) monthAmounts[idx] += amt;
  });

  const barData = {
    labels: months,
    datasets: [
      {
        label: "Spent",
        data: monthAmounts,
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-6">📊 Reports</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-gray-900 p-4 rounded-lg shadow">
          <h4 className="mb-3 font-medium">Category Breakdown</h4>
          <Pie data={pieData} />
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-900 p-4 rounded-lg shadow">
          <h4 className="mb-3 font-medium">Last 6 Months</h4>
          <Bar data={barData} />
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[180px] bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="text-sm text-gray-400">Total this month</div>
          <div className="text-xl font-bold text-white">₹ {totalThisMonth}</div>
        </div>
      </div>
    </div>
  );
}
