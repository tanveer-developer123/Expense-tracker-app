import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
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
  const [dataType, setDataType] = useState("monthly");
  const [chartType, setChartType] = useState("bar");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "users", auth.currentUser.uid, "expenses"));
    const unsub = onSnapshot(q, (snap) => {
      setExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Random color generator
  function randomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  }

  // byCategory calculation
  const byCategory: Record<string, number> = {};
  let totalThisMonth = 0;

  expenses.forEach((e: any) => {
    const amt = Number(e.amount || 0);
    const d = e.date?.toDate ? e.date.toDate() : new Date(e.date);
    const cat = e.category || "Other";

    if (d.getMonth() === selectedMonth && d.getFullYear() === selectedYear) {
      byCategory[cat] = (byCategory[cat] || 0) + amt;
      totalThisMonth += amt;
    }
  });

  const categoryColors = Object.keys(byCategory).map(() => randomColor());
  const categoryData = {
    labels: Object.keys(byCategory),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(byCategory),
        backgroundColor: categoryColors,
      },
    ],
  };

  // monthly breakdown
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

  const monthlyData = {
    labels: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
    datasets: [
      {
        label: "Daily Spent",
        data: dayAmounts,
        backgroundColor: Array.from({ length: daysInMonth }, () => randomColor()),
      },
    ],
  };

  const defaultOptions = { responsive: true, plugins: { legend: { display: true } } };
  const monthlyOptions = { responsive: true, plugins: { legend: { display: false } } };

  const dataToShow = dataType === "monthly" ? monthlyData : categoryData;
  const optionsToShow = dataType === "monthly" ? monthlyOptions : defaultOptions;

  const renderChart = () => {
    switch (chartType) {
      case "pie": return <Pie data={dataToShow} options={optionsToShow} />;
      case "line": return <Line data={dataToShow} options={optionsToShow} />;
      case "doughnut": return <Doughnut data={dataToShow} options={optionsToShow} />;
      default: return <Bar data={dataToShow} options={optionsToShow} />;
    }
  };

  // ✅ Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      expenses.map((ex) => ({
        Date: ex.date?.toDate ? ex.date.toDate().toLocaleDateString() : "-",
        Category: ex.category,
        Amount: ex.amount,
        Notes: ex.notes,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    XLSX.writeFile(workbook, "report.xlsx");
  };

  // ✅ Export PDF
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
    });

    doc.save("report.pdf");
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-6">📊 Reports</h3>

      {/* Month & Year Selector */}
      <div className="flex gap-2 mb-4">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white">
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white">
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-4">
        <select value={dataType} onChange={(e) => setDataType(e.target.value)}
          className="bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white">
          <option value="monthly">📅 Monthly Breakdown</option>
          <option value="category">📂 Expenses by Category</option>
        </select>

        <select value={chartType} onChange={(e) => setChartType(e.target.value)}
          className="bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white">
          <option value="bar">📊 Bar</option>
          <option value="pie">🥧 Pie</option>
          <option value="line">📈 Line</option>
          <option value="doughnut">🍩 Doughnut</option>
        </select>
      </div>

      {/* Chart */}
      <div className="bg-gray-900 p-4 rounded-lg shadow">{renderChart()}</div>

      {/* Total + Export */}
      <div className="mt-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[180px] bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="text-sm text-gray-400">
            Total {new Date(selectedYear, selectedMonth).toLocaleString("default", { month: "long", year: "numeric" })}
          </div>
          <div className="text-xl font-bold text-white">₹ {totalThisMonth}</div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <button onClick={exportExcel} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm">
            ⬇ Excel
          </button>
          <button onClick={exportPDF} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm">
            ⬇ PDF
          </button>
        </div>
      </div>
    </div>
  );
}
