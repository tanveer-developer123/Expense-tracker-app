import React from "react";
import AddExpense from "../sections/AddExpense";
import ExpenseList from "../sections/ExpenseList";
import Filters from "../sections/Filters";
import Reports from "../sections/Reports";
import ProfileSettings from "../sections/ProfileSettings";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const nav = useNavigate();
  const logout = async () => {
    await auth.signOut();
    nav("/");
  };

  return (
    <div style={{padding:20}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h2 style={{fontSize:18, fontWeight:700}}>Dashboard</h2>
        <div style={{display:'flex', gap:8}}>
          <button onClick={logout} style={{padding:'6px 10px', borderRadius:6}}>Logout</button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:20}}>
        <div style={{display:'flex', flexDirection:'column', gap:20}}>
          <AddExpense />
          <ProfileSettings />
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:20}}>
          <Filters />
          <ExpenseList />
          <Reports />
        </div>
      </div>
    </div>
  );
}
