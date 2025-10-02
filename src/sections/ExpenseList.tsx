import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

type Expense = {
  id: string;
  amount: number;
  category: string;
  notes?: string;
  date?: Date | null;
};

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editAmount, setEditAmount] = useState<number | "">("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "expenses"),
      orderBy("date", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setExpenses(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            amount: data.amount,
            category: data.category,
            notes: data.notes || "",
            date: data.date?.toDate ? data.date.toDate() : null,
          } as Expense;
        })
      );
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (!auth.currentUser) return;
    if (!confirm("Delete this expense?")) return;

    await deleteDoc(doc(db, "users", auth.currentUser.uid, "expenses", id));
  };

  const openEdit = (e: Expense) => {
    setEditing(e);
    setEditNotes(e.notes || "");
    setEditAmount(e.amount);
  };

  const saveEdit = async () => {
    if (!editing || !auth.currentUser) return;
    const ref = doc(db, "users", auth.currentUser.uid, "expenses", editing.id);

    await updateDoc(ref, {
      amount: Number(editAmount),
      notes: editNotes,
    });

    setEditing(null);
  };

  // ✅ Group by Date
  const grouped: Record<string, Expense[]> = {};
  expenses.forEach((ex) => {
    const dateStr = ex.date ? ex.date.toLocaleDateString() : "No Date";
    if (!grouped[dateStr]) grouped[dateStr] = [];
    grouped[dateStr].push(ex);
  });

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-4">📋 Expenses</h3>

      {/* Scrollable Area */}
      <div className="max-h-[400px] overflow-y-auto pr-2">
        {Object.keys(grouped).length === 0 && (
          <p className="text-center text-gray-400 py-6">No expenses yet 🚀</p>
        )}

        {Object.entries(grouped).map(([date, exList]) => (
          <div key={date} className="mb-6">
            {/* Date Heading */}
            <h4 className="text-lg font-medium text-white mb-2 border-b border-gray-600 pb-1">
              {date}
            </h4>

            <table className="w-full text-left border-collapse mb-4">
              <thead>
                <tr className="bg-gray-700 text-gray-200 text-sm">
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Notes</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exList.map((ex) => (
                  <tr
                    key={ex.id}
                    className="border-t border-gray-700 hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-2">{ex.category}</td>
                    <td className="px-4 py-2 font-medium text-green-400">
                      {ex.amount}
                    </td>
                    <td className="px-4 py-2">{ex.notes}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => openEdit(ex)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ex.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
            <h4 className="text-lg font-semibold mb-4">✏️ Edit Expense</h4>
            <input
              value={editAmount}
              onChange={(e) => setEditAmount(Number(e.target.value))}
              type="number"
              className="w-full mb-3 px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full mb-3 px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
