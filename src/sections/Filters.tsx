import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";

type FiltersProps = {
  filters: {
    category: string;
    start: string;
    end: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      category: string;
      start: string;
      end: string;
    }>
  >;
};

export default function Filters({ filters, setFilters }: FiltersProps) {
  const [otherCategories, setOtherCategories] = useState<string[]>([]);
  const [selectedOther, setSelectedOther] = useState("");

  // 🔄 Firestore se "Other" categories fetch karo
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsub = onSnapshot(collection(db, "users", user.uid, "expenses"), (snap) => {
      const customCats = new Set<string>();
      snap.docs.forEach((doc) => {
        const data = doc.data();
        if (
          data.category &&
          !["Food", "Transport", "Shopping", "Bills", "Other"].includes(data.category)
        ) {
          customCats.add(data.category);
        }
      });
      setOtherCategories(Array.from(customCats));
    });

    return () => unsub();
  }, []);

  // 🔘 Apply Filters
  const apply = () => {
    let finalCategory = filters.category;
    if (filters.category === "Other" && selectedOther) {
      finalCategory = selectedOther;
    }
    setFilters({
      ...filters,
      category: finalCategory,
    });
  };

  // 🔄 Reset Filters
  const clearFilters = () => {
    setFilters({
      category: "All",
      start: "",
      end: "",
    });
    setSelectedOther("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700"
    >
      <h3 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
        Filters
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {/* Category */}
        <div>
          <label className="text-sm text-gray-300 mb-1 block">Category</label>
          <select
            value={
              filters.category === "Other" || otherCategories.includes(filters.category)
                ? "Other"
                : filters.category
            }
            onChange={(e) => {
              const val = e.target.value;
              setFilters((prev) => ({ ...prev, category: val }));
              if (val !== "Other") setSelectedOther("");
            }}
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option>All</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Other</option>
          </select>
        </div>

        {/* Other Categories */}
        {filters.category === "Other" && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label className="text-sm text-gray-300 mb-1 block">Other Categories</label>
            <select
              value={selectedOther}
              onChange={(e) => setSelectedOther(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
            >
              <option value="">Select...</option>
              {otherCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </motion.div>
        )}

        {/* Start Date */}
        <div>
          <label className="text-sm text-gray-300 mb-1 block">Start Date</label>
          <input
            type="date"
            value={filters.start}
            onChange={(e) => setFilters((p) => ({ ...p, start: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 outline-none transition"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="text-sm text-gray-300 mb-1 block">End Date</label>
          <input
            type="date"
            value={filters.end}
            onChange={(e) => setFilters((p) => ({ ...p, end: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-green-500 outline-none transition"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={clearFilters}
          className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all"
        >
          Clear
        </button>
        <button
          onClick={apply}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-all"
        >
          Apply
        </button>
      </div>
    </motion.div>
  );
}
