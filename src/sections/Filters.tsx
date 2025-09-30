import React, { useState } from "react";

export default function Filters() {
  const [category, setCategory] = useState<string>("All");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");

  const apply = () => {
    console.log("Apply filters (category, start, end):", category, start, end);
    alert("Filter applied — implement Firestore query builder.");
  };

  return (
    <div style={{padding:16, background:'#fff', borderRadius:8}}>
      <div style={{display:'flex', gap:8, alignItems:'flex-end'}}>
        <div>
          <label>Category</label>
          <div><select value={category} onChange={(e) => setCategory(e.target.value)} style={{padding:8, borderRadius:6}}>
            <option>All</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Other</option>
          </select></div>
        </div>

        <div>
          <label>Start</label>
          <div><input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={{padding:8, borderRadius:6}} /></div>
        </div>

        <div>
          <label>End</label>
          <div><input type="date" value={end} onChange={(e) => setEnd(e.target.value)} style={{padding:8, borderRadius:6}} /></div>
        </div>

        <div>
          <button onClick={apply} style={{background:'#1f6feb', color:'#fff', padding:'8px 12px', borderRadius:6}}>Apply</button>
        </div>
      </div>
    </div>
  );
}
