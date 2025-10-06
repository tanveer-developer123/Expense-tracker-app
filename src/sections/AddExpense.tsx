import React from "react";
import { useForm } from "react-hook-form";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { motion } from "framer-motion";
import { PlusCircle, Calendar, Tag, StickyNote } from "lucide-react";

type FormData = {
  amount: number;
  category: string;
  customCategory?: string;
  date: string;
  notes?: string;
};

export default function AddExpense() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      amount: 0,
      category: "Food",
      date: new Date().toISOString().slice(0, 10),
      notes: "",
    },
  });

  const selectedCategory = watch("category");

  const onSubmit = async (data: FormData) => {
    if (!auth.currentUser) return alert("Not logged in");
    const uid = auth.currentUser.uid;

    if (!data.amount || data.amount <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    const finalCategory =
      data.category === "Other" && data.customCategory
        ? data.customCategory
        : data.category;

    try {
      await addDoc(collection(db, "users", uid, "expenses"), {
        amount: Number(data.amount),
        category: finalCategory,
        notes: data.notes?.trim() || "",
        date: new Date(data.date),
        createdAt: serverTimestamp(),
      });
      reset();
    } catch (err) {
      console.error(err);
      alert("Failed to add expense ❌");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                 p-8 rounded-2xl shadow-2xl border border-gray-700 
                 backdrop-blur-sm space-y-5 max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <PlusCircle className="text-green-400 w-6 h-6" />
        <h3 className="text-2xl font-bold text-green-400">Add New Expense</h3>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Amount</label>
        <input
          {...register("amount", {
            valueAsNumber: true,
            required: "Amount is required",
            min: { value: 1, message: "Amount must be greater than 0" },
          })}
          placeholder="Enter amount"
          type="number"
          className="w-full px-4 py-2 rounded-lg bg-gray-950/70 border border-gray-700 
                     text-white focus:outline-none focus:ring-2 focus:ring-green-500 
                     placeholder-gray-500"
        />
        {errors.amount && (
          <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Category</label>
        <div className="flex flex-col gap-2">
          <select
            {...register("category")}
            className="px-4 py-2 rounded-lg bg-gray-950/70 border border-gray-700 
                       text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Other</option>
          </select>

          {selectedCategory === "Other" && (
            <motion.input
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              {...register("customCategory")}
              placeholder="Enter custom category name"
              className="w-full px-4 py-2 rounded-lg bg-gray-950/70 border border-gray-700 
                         text-white focus:outline-none focus:ring-2 focus:ring-purple-500 
                         placeholder-gray-500"
            />
          )}
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm text-gray-300 mb-1 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-green-400" /> Date
        </label>
        <input
          {...register("date")}
          type="date"
          className="w-full px-4 py-2 rounded-lg bg-gray-950/70 border border-gray-700 
                     text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm text-gray-300 mb-1 flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-green-400" /> Notes (optional)
        </label>
        <textarea
          {...register("notes")}
          placeholder="Add a short note (e.g. lunch, cab, etc.)"
          style={{ resize: "none" }}
          className="w-full px-4 py-2 rounded-lg bg-gray-950/70 border border-gray-700 
                     text-white focus:outline-none focus:ring-2 focus:ring-green-500 
                     placeholder-gray-500"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 px-6 py-3 
                   rounded-lg font-semibold text-white text-lg 
                   shadow-md transition flex items-center justify-center gap-2"
      >
        <PlusCircle className="w-5 h-5" /> Add Expense
      </motion.button>
    </motion.form>
  );
}
