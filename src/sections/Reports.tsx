import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, onSnapshot, doc, getDoc } from "firebase/firestore";
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

type ReportsProps = {
  filters: {
    category: string;
    start: string;
    end: string;
  };
};

export default function Reports({ filters }: ReportsProps) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [dataType, setDataType] = useState<"monthly" | "category" | "budget">("category");
  const [chartType, setChartType] = useState("bar");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [budgetData, setBudgetData] = useState({
    budget: 0,
    spent: 0,
    remaining: 0,
    currency: "PKR",
  });

  // 🔹 Firestore subscription
  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "users", auth.currentUser.uid, "expenses"));
    const unsub = onSnapshot(q, (snap) => {
      setExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // 🔹 Load budget info
  useEffect(() => {
  if (!auth.currentUser) return;

  const userRef = doc(db, "users", auth.currentUser.uid);

  // 🔥 real-time listener on user doc
  const unsubUser = onSnapshot(userRef, (snap) => {
    if (snap.exists()) {
      const userData = snap.data();
      const monthlyBudget = userData.monthlyBudget || 0;
      const currency = userData.currency || "PKR";

      // calculate total spent of selected month
      let total = 0;
      expenses.forEach((e) => {
        const d = e.date?.toDate ? e.date.toDate() : new Date(e.date);
        if (d.getMonth() === selectedMonth && d.getFullYear() === selectedYear) {
          total += Number(e.amount || 0);
        }
      });

      setBudgetData({
        budget: monthlyBudget,
        spent: total,
        remaining: monthlyBudget - total,
        currency,
      });
    }
  });

  return () => unsubUser();
}, [expenses, selectedMonth, selectedYear]);


  // 🔹 Color generator
  function randomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  }

  // 🔹 Category breakdown
  const byCategory: Record<string, number> = {};
  let totalThisMonth = 0;
  expenses.forEach((e: any) => {
    const amt = Number(e.amount || 0);
    const d = e.date?.toDate ? e.date.toDate() : new Date(e.date);
    const cat = e.category || "Other";

    const isSameMonth = d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    const isSameDate = selectedDate ? d.toISOString().split("T")[0] === selectedDate : true;

    if (isSameMonth && isSameDate) {
      byCategory[cat] = (byCategory[cat] || 0) + amt;
      totalThisMonth += amt;
    }
  });

  // 🔹 Monthly data
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const dayAmounts = new Array(daysInMonth).fill(0);
  expenses.forEach((e: any) => {
    const amt = Number(e.amount || 0);
    const d = e.date?.toDate ? e.date.toDate() : new Date(e.date);
    if (d.getMonth() === selectedMonth && d.getFullYear() === selectedYear) {
      const dayIndex = d.getDate() - 1;
      dayAmounts[dayIndex] += amt;
    }
  });

  // 🔹 Chart datasets
  const categoryData = {
    labels: Object.keys(byCategory),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(byCategory),
        backgroundColor: Object.keys(byCategory).map(() => randomColor()),
      },
    ],
  };

  const monthlyData = {
    labels: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
    datasets: [
      {
        label: "Daily Spending",
        data: dayAmounts,
        backgroundColor: Array.from({ length: daysInMonth }, () => randomColor()),
      },
    ],
  };

  const budgetChartData = {
    labels: ["Spent", "Remaining"],
    datasets: [
      {
        data: [
          budgetData.spent,
          budgetData.remaining < 0 ? 0 : budgetData.remaining,
        ],
        backgroundColor: ["#EF4444", "#22C55E"],
      },
    ],
  };

  const chartOptions = { responsive: true, plugins: { legend: { display: true } } };

  // 🔹 Chart renderer
  const renderChart = () => {
    let dataToShow;
    if (dataType === "monthly") dataToShow = monthlyData;
    else if (dataType === "category") dataToShow = categoryData;
    else dataToShow = budgetChartData;

    switch (chartType) {
      case "pie":
        return <Pie data={dataToShow} options={chartOptions} />;
      case "line":
        return <Line data={dataToShow} options={chartOptions} />;
      case "doughnut":
        return <Doughnut data={dataToShow} options={chartOptions} />;
      default:
        return <Bar data={dataToShow} options={chartOptions} />;
    }
  };

  // 🔹 Export Excel
  const exportExcel = () => {
  const expenseSheet = XLSX.utils.json_to_sheet(
    expenses.map((ex) => ({
      Date: ex.date?.toDate ? ex.date.toDate().toLocaleDateString() : "-",
      Category: ex.category,
      Amount: ex.amount,
      Notes: ex.notes,
    }))
  );

  // ✅ Budget sheet
  const budgetSheet = XLSX.utils.json_to_sheet([
    {
      Budget: budgetData.budget,
      Spent: budgetData.spent,
      Remaining: budgetData.remaining,
      Currency: budgetData.currency,
    },
  ]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, expenseSheet, "Expenses");
  XLSX.utils.book_append_sheet(workbook, budgetSheet, "Budget Overview");

  XLSX.writeFile(workbook, "report.xlsx");
};
const exportPDF = () => {
  const doc = new jsPDF();
  doc.text("Expense Report", 14, 10);

  const tableData = expenses.map((ex) => [
    ex.date?.toDate ? ex.date.toDate().toLocaleDateString() : "-",
    ex.category,
    ex.amount,
    ex.notes,
  ]);

  autoTable(doc, {
    head: [["Date", "Category", "Amount", "Notes"]],
    body: tableData,
    startY: 20,
  });

  // ✅ Budget Overview section
  doc.text("Budget Overview", 14, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: [["Budget", "Spent", "Remaining", "Currency"]],
    body: [
      [
        budgetData.budget,
        budgetData.spent,
        budgetData.remaining,
        budgetData.currency,
      ],
    ],
  });

  doc.save("report.pdf");
};


  // 🔹 UI
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-lg font-semibold text-white">📊 Reports</h3>
        <div className="flex gap-2">
          <button onClick={exportExcel} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm">
            ⬇ Excel
          </button>
          <button onClick={exportPDF} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm">
            ⬇ PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        {/* Month Selector */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        {/* Year Selector */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>

        {/* Data Type Selector */}
        <select
          value={dataType}
          onChange={(e) =>
            setDataType(e.target.value as "monthly" | "category" | "budget")
          }
          className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white"
        >
          <option value="monthly">📅 Monthly Breakdown</option>
          <option value="category">📂 Expenses by Category</option>
          <option value="budget">💰 Budget Overview</option>
        </select>

        {/* Chart Type Selector */}
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white"
        >
          <option value="bar">📊 Bar</option>
          <option value="pie">🥧 Pie</option>
          <option value="line">📈 Line</option>
          <option value="doughnut">🍩 Doughnut</option>
        </select>
      </div>

      {/* Daily Filter */}
      {dataType === "category" && (
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400 whitespace-nowrap">📆 Filter by Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white flex-1"
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate("")}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm"
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* Chart */}
      <div className="bg-gray-900 p-4 rounded-lg shadow-md">{renderChart()}</div>

      {/* Budget Summary */}
      {dataType === "budget" && (
        <p className="text-center text-gray-300 mt-3">
          💰 Budget: <b>{budgetData.budget} {budgetData.currency}</b> &nbsp; | &nbsp;
          📊 Spent: <b>{budgetData.spent} {budgetData.currency}</b> &nbsp; | &nbsp;
          {budgetData.remaining < 0
            ? `⚠️ Over by ${Math.abs(budgetData.remaining)} ${budgetData.currency}`
            : `✅ Remaining ${budgetData.remaining} ${budgetData.currency}`}
        </p>
      )}
    </div>
  );
}
