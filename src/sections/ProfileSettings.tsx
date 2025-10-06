import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { motion } from "framer-motion";

export default function ProfileSettings() {
  const [budget, setBudget] = useState<number | "">("");
  const [currency, setCurrency] = useState("PKR");
  const [saved, setSaved] = useState(false);
  const [monthlySpent, setMonthlySpent] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;

    const ref = doc(db, "users", auth.currentUser.uid);

    const loadSettings = async () => {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data: any = snap.data();
        setBudget(data.monthlyBudget ?? "");
        setCurrency(data.currency ?? "PKR");
      }
    };
    loadSettings();

    const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const q = query(
      collection(db, "users", auth.currentUser.uid, "expenses"),
      where("date", ">=", start),
      where("date", "<=", end)
    );

    const unsub = onSnapshot(q, (snap) => {
      let total = 0;
      snap.forEach((doc) => (total += doc.data().amount || 0));
      setMonthlySpent(total);
    });

    return () => unsub();
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
  const percentage =
    budget && Number(budget) > 0
      ? Math.min((monthlySpent / Number(budget)) * 100, 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                 p-8 rounded-2xl shadow-2xl border border-gray-700
                 max-w-lg mx-auto backdrop-blur-sm"
    >
      <h2 className="text-2xl font-bold text-center text-purple-400 mb-6">
        Profile & Budget Settings
      </h2>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm mb-1">Monthly Budget</label>
          <input
            type="number"
            value={budget}
            onChange={(e) =>
              setBudget(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="Enter monthly budget"
            className="w-full px-4 py-2 rounded-lg bg-gray-950/70 border border-gray-700
                       text-white focus:outline-none focus:ring-2 focus:ring-purple-500 
                       placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Currency</label>
          <span>
              PKR
            </span>
          {/* <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-950/70 border border-gray-700 
                       text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <span>
              PKR
            </span>
          </select> */}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={save}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 
                     text-white font-semibold rounded-lg shadow-md transition"
        >
          Save Changes
        </motion.button>

        {saved && (
          <p className="text-green-400 text-sm text-center mt-2">
            Settings saved successfully!
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-6"></div>

      {/* Budget Summary */}
      <div className="space-y-2 text-gray-300">
        <p>
          💰 <span className="font-medium">Monthly Budget:</span>{" "}
          <b className="text-white">{budget || 0} {currency}</b>
        </p>
        <p>
          📊 <span className="font-medium">Spent this month:</span>{" "}
          <b className="text-white">{monthlySpent} {currency}</b>
        </p>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8 }}
            className={`h-3 rounded-full ${percentage >= 90
                ? "bg-red-500"
                : percentage >= 70
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
          ></motion.div>
        </div>

        {/* Remaining */}
        <p
          className={`text-sm font-semibold mt-2 ${remaining < 0 ? "text-red-400" : "text-green-400"
            }`}
        >
          {remaining < 0
            ? `⚠️ Over Budget by ${Math.abs(remaining)} ${currency}`
            : `✅ Remaining: ${remaining} ${currency}`}
        </p>
      </div>
    </motion.div>
  );
}
