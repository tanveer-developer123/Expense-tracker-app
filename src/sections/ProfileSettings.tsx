import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";

export default function ProfileSettings() {
  const [budget, setBudget] = useState<number | "">("");
  const [currency, setCurrency] = useState("PKR");
  const [saved, setSaved] = useState(false);
  const [monthlySpent, setMonthlySpent] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;

    const loadData = async () => {
      // 🔹 User settings load karo
      const ref = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data: any = snap.data();
        setBudget(data.monthlyBudget ?? "");
        setCurrency(data.currency ?? "PKR");
      }

      // 🔹 Current month ke expenses sum karo
      const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const end = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

      const q = query(
        collection(db, "expenses"),
        where("uid", "==", auth.currentUser.uid),
        where("date", ">=", start.toISOString()),
        where("date", "<=", end.toISOString())
      );

      const snapExpenses = await getDocs(q);
      let total = 0;
      snapExpenses.forEach((doc) => {
        total += doc.data().amount || 0;
      });
      setMonthlySpent(total);
    };

    loadData();
  }, []);

  const save = async () => {
    if (!auth.currentUser) return;
    const ref = doc(db, "users", auth.currentUser.uid);
    await setDoc(
      ref,
      {
        monthlyBudget: budget === "" ? 0 : Number(budget),
        currency,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const remaining = (budget === "" ? 0 : Number(budget)) - monthlySpent;

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
      <h4 className="text-lg font-semibold mb-4">⚙️ Profile / Settings</h4>

      {/* Budget Input */}
      <input
        type="number"
        value={budget}
        onChange={(e) =>
          setBudget(e.target.value === "" ? "" : Number(e.target.value))
        }
        placeholder="Monthly budget"
        className="w-full mb-3 px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      {/* Currency Select */}
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option>PKR</option>
        <option>USD</option>
        <option>EUR</option>
      </select>

      {/* Save Button */}
      <button
        onClick={save}
        className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow transition"
      >
        Save
      </button>

      {/* Saved message */}
      {saved && (
        <p className="text-green-400 text-sm mt-3">✅ Saved successfully!</p>
      )}

      {/* Budget Summary */}
      <div className="mt-6 bg-gray-900 p-4 rounded-md border border-gray-700">
        <p className="text-sm text-gray-300">💰 Monthly Budget: <b>{budget || 0} {currency}</b></p>
        <p className="text-sm text-gray-300">📊 Spent this month: <b>{monthlySpent} {currency}</b></p>
        <p className={`text-sm font-semibold ${remaining < 0 ? "text-red-400" : "text-green-400"}`}>
          {remaining < 0 ? "⚠️ Over Budget!" : "✅ Remaining:"} {remaining} {currency}
        </p>
      </div>
    </div>
  );
}
