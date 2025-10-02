import React, { useState } from "react";

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
  const [customCategory, setCustomCategory] = useState("");

  const apply = () => {
    let finalFilters = { ...filters };
    if (filters.category === "Other" && customCategory.trim() !== "") {
      finalFilters.category = customCategory.trim();
    }
    setFilters(finalFilters);

    console.log("Apply filters:", finalFilters);
    alert("Filters Applied");
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4">🔍 Filters</h3>
      <div className="flex flex-wrap gap-4 items-end">
        {/* Category */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            className="px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Other</option>
          </select>
        </div>

        {/* Custom Category (only when Other selected) */}
        {filters.category === "Other" && (
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Custom Category</label>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter category name"
              className="px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}

        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Start</label>
          <input
            type="date"
            value={filters.start}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, start: e.target.value }))
            }
            className="px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">End</label>
          <input
            type="date"
            value={filters.end}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, end: e.target.value }))
            }
            className="px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Apply Button */}
        <div>
          <button
            onClick={apply}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
