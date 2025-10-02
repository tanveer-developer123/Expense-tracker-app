import React from "react";
import { useForm } from "react-hook-form";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

type FormData = {
  amount: number;
  category: string;
  customCategory?: string;
  date: string;
  notes?: string
};

export default function AddExpense() {
  const { register, handleSubmit, reset, watch } = useForm<FormData>({
    defaultValues: {
      amount: 0,
      category: "Food",
      date: new Date().toISOString().slice(0, 10),
      notes: ""
    },
  });

  const selectedCategory = watch("category"); // watch current category

  const onSubmit = async (data: FormData) => {
    if (!auth.currentUser) return alert("Not logged in");
    const uid = auth.currentUser.uid;

    // agar Other hai, to customCategory use karo
    const finalCategory = data.category === "Other" && data.customCategory
      ? data.customCategory
      : data.category;

    try {
      await addDoc(collection(db, "users", uid, "expenses"), {
        amount: Number(data.amount),
        category: finalCategory,
        notes: data.notes || "",
        date: new Date(data.date),
        createdAt: serverTimestamp(),
      });
      reset();
    } catch (err) {
      console.error(err);
      alert("Failed to add expense");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-800 p-6 rounded-xl shadow-md space-y-4 "
    >
      <h3 className="text-xl font-semibold mb-2">Add Expense</h3>

      {/* Amount */}
      <input
        {...register("amount", { valueAsNumber: true })}
        placeholder="Amount"
        type="number"
        className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* Category */}
      <select
        {...register("category")}
        className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option>Food</option>
        <option>Transport</option>
        <option>Shopping</option>
        <option>Bills</option>
        <option>Other</option>
      </select>

      {/* If "Other" selected, show custom input */}
      {selectedCategory === "Other" && (
        <input
          {...register("customCategory")}
          placeholder="Enter category name"
          className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      )}

      {/* Date */}
      <input
        {...register("date")}
        type="date"
        className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* Notes */}
      <textarea
        style={{ resize: 'none' }}
        {...register("notes")}
        placeholder="Notes (optional)"
        className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-md font-semibold transition text-white"
        >
          Add Expense
        </button>
      </div>
    </form>
  );
}
