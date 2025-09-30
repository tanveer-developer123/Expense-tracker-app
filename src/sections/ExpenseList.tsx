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
  date?: any;
};

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editAmount, setEditAmount] = useState<number | "">("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "expenses"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setExpenses(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            amount: data.amount,
            category: data.category,
            notes: data.notes || "",
            date: data.date ? data.date.toDate?.() ?? new Date(data.date) : null,
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

  return (
    <div style={{padding:16, background:'#fff', borderRadius:8}}>
      <h3 style={{fontWeight:700, marginBottom:8}}>Expenses</h3>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%', textAlign:'left', borderCollapse:'collapse'}}>
          <thead>
            <tr>
              <th style={{padding:8}}>Date</th>
              <th style={{padding:8}}>Category</th>
              <th style={{padding:8}}>Amount</th>
              <th style={{padding:8}}>Notes</th>
              <th style={{padding:8}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((ex) => (
              <tr key={ex.id} style={{borderTop:'1px solid #eee'}}>
                <td style={{padding:8}}>{ex.date ? new Date(ex.date).toLocaleDateString() : "-"}</td>
                <td style={{padding:8}}>{ex.category}</td>
                <td style={{padding:8}}>{ex.amount}</td>
                <td style={{padding:8}}>{ex.notes}</td>
                <td style={{padding:8}}>
                  <button onClick={() => openEdit(ex)} style={{marginRight:8, padding:'6px 10px'}}>Edit</button>
                  <button onClick={() => handleDelete(ex.id)} style={{padding:'6px 10px', background:'#ef4444', color:'#fff', borderRadius:6}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div style={{position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.4)'}}>
          <div style={{background:'#fff', padding:16, borderRadius:8, width:420}}>
            <h4 style={{fontWeight:700, marginBottom:8}}>Edit Expense</h4>
            <input value={editAmount} onChange={(e) => setEditAmount(Number(e.target.value))} type="number" style={{width:'100%', marginBottom:8, padding:8, borderRadius:6, border:'1px solid #ddd'}} />
            <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} style={{width:'100%', marginBottom:8, padding:8, borderRadius:6, border:'1px solid #ddd'}}></textarea>
            <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
              <button onClick={() => setEditing(null)} style={{padding:'6px 10px'}}>Cancel</button>
              <button onClick={saveEdit} style={{padding:'6px 10px', background:'#1f6feb', color:'#fff', borderRadius:6}}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
