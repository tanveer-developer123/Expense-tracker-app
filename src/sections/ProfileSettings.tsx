import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default function ProfileSettings() {
  const [budget, setBudget] = useState<number | "">("");
  const [currency, setCurrency] = useState("PKR");

  useEffect(() => {
    (async () => {
      if (!auth.currentUser) return;
      const ref = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data: any = snap.data();
        setBudget(data.monthlyBudget ?? "");
        setCurrency(data.currency ?? "PKR");
      }
    })();
  }, []);

  const save = async () => {
    if (!auth.currentUser) return;
    const ref = doc(db, "users", auth.currentUser.uid);
    await setDoc(
      ref,
      { monthlyBudget: Number(budget || 0), currency, updatedAt: serverTimestamp() },
      { merge: true }
    );
    alert("Saved ✅");
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
      <h4 className="text-lg font-semibold mb-4">⚙️ Profile / Settings</h4>

      {/* Budget Input */}
      <input
        type="number"
        value={budget as any}
        onChange={(e) => setBudget(Number(e.target.value))}
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
    </div>
  );
}
