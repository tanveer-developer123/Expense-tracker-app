import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
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
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) totalThisMonth += amt;
  });

  const pieData = { labels: Object.keys(byCategory), datasets: [{ data: Object.values(byCategory) }] };

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

  const barData = { labels: months, datasets: [{ label: "Spent", data: monthAmounts }] };

  return (
    <div style={{padding:16, background:'#fff', borderRadius:8}}>
      <h3 style={{fontWeight:700, marginBottom:8}}>Reports</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <div>
          <h4 style={{marginBottom:8}}>Category Breakdown</h4>
          <Pie data={pieData} />
        </div>
        <div>
          <h4 style={{marginBottom:8}}>Last 6 Months</h4>
          <Bar data={barData} />
        </div>
      </div>

      <div style={{marginTop:12, display:'flex', gap:12}}>
        <div style={{padding:12, border:'1px solid #eee', borderRadius:8}}>
          <div style={{fontSize:12}}>Total this month</div>
          <div style={{fontSize:18, fontWeight:700}}>₹ {totalThisMonth}</div>
        </div>
      </div>
    </div>
  );
}
