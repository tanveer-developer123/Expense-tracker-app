import React from "react";

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
  const apply = () => {
    console.log("Applied Filters ✅", filters);
    alert("Filters applied! Data will update accordingly.");
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
