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
    await setDoc(ref, { monthlyBudget: Number(budget || 0), currency, updatedAt: serverTimestamp() }, { merge: true });
    alert("Saved");
  };

  return (
    <div style={{padding:16, background:'#fff', borderRadius:8}}>
      <h4 style={{fontWeight:700, marginBottom:8}}>Profile / Settings</h4>
      <input type="number" value={budget as any} onChange={(e) => setBudget(Number(e.target.value))} placeholder="Monthly budget" style={{width:'100%', marginBottom:8, padding:8, borderRadius:6, border:'1px solid #ddd'}} />
      <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{width:'100%', marginBottom:8, padding:8, borderRadius:6, border:'1px solid #ddd'}}>
        <option>PKR</option>
        <option>USD</option>
        <option>EUR</option>
      </select>
      <button onClick={save} style={{background:'#6d28d9', color:'#fff', padding:'8px 12px', borderRadius:6}}>Save</button>
    </div>
  );
}
