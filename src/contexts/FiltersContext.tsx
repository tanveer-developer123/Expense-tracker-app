import React, { createContext, useContext, useState } from "react";

type FiltersContextType = {
  category: string;
  start: string;
  end: string;
  setCategory: (c: string) => void;
  setStart: (s: string) => void;
  setEnd: (e: string) => void;
};

const FiltersContext = createContext<FiltersContextType | null>(null);

export const FiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [category, setCategory] = useState("All");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  return (
    <FiltersContext.Provider value={{ category, start, end, setCategory, setStart, setEnd }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used within FiltersProvider");
  return ctx;
};
