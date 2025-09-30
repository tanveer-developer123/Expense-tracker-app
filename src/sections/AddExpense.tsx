import React from "react";
import { useForm } from "react-hook-form";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

type FormData = { amount: number; category: string; date: string; notes?: string };

export default function AddExpense() {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { amount: 0, category: "Food", date: new Date().toISOString().slice(0, 10), notes: "" },
  });

  const onSubmit = async (data: FormData) => {
    if (!auth.currentUser) return alert("Not logged in");
    const uid = auth.currentUser.uid;
    try {
      await addDoc(collection(db, "users", uid, "expenses"), {
        amount: Number(data.amount),
        category: data.category,
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
    <form onSubmit={handleSubmit(onSubmit)} style={{padding:16, background:'#fff', borderRadius:8}}>
      <h3 style={{fontWeight:700, marginBottom:8}}>Add Expense</h3>
      <input {...register("amount", { valueAsNumber: true })} placeholder="Amount" type="number" style={{width:'100%', marginBottom:8, padding:8, borderRadius:6, border:'1px solid #ddd'}} />
      <select {...register("category")} style={{width:'100%', marginBottom:8, padding:8, borderRadius:6, border:'1px solid #ddd'}}>
        <option>Food</option>
        <option>Transport</option>
        <option>Shopping</option>
        <option>Bills</option>
        <option>Other</option>
      </select>
      <input {...register("date")} type="date" style={{width:'100%', marginBottom:8, padding:8, borderRadius:6, border:'1px solid #ddd'}} />
      <textarea {...register("notes")} placeholder="Notes (optional)" style={{width:'100%', marginBottom:8, padding:8, borderRadius:6, border:'1px solid #ddd'}} />
      <div style={{display:'flex', gap:8}}>
        <button type="submit" style={{background:'#16a34a', color:'#fff', padding:'8px 12px', borderRadius:6}}>Add</button>
      </div>
    </form>
  );
}
