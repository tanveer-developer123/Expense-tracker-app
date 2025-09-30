import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();

  const signInGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      nav("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{padding:24, borderRadius:8, boxShadow:'0 4px 14px rgba(0,0,0,0.08)', width:420, background:'#fff'}}>
        <h1 style={{fontSize:22, fontWeight:700, marginBottom:12}}>Expense Tracker</h1>
        <button onClick={signInGoogle} style={{background:'#1f6feb', color:'#fff', padding:'10px 14px', borderRadius:6}}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
