
"use client";
import React, { useState } from 'react';
import LoadingAnimation from '../../components/LoadingAnimation';
import { useRouter } from 'next/navigation';

export default function AbhaLoginPage() {

  const router = useRouter();
  const [tab, setTab] = useState('aadhar');
  const [aadhar, setAadhar] = useState("");
  const [abhaId, setAbhaId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const validAadhar = "123456789012";
    const validAbha = "ABHA-1234-5678";
    await new Promise(res => setTimeout(res, 1200)); // Simulate network delay
    if (
      (tab === 'aadhar' && aadhar.trim() === validAadhar) ||
      (tab === 'abha' && abhaId.trim().toUpperCase() === validAbha)
    ) {
      router.push("/");
    } else {
      setError(
        tab === 'aadhar'
          ? "Please enter a valid 12-digit Aadhaar card number."
          : "Please enter a valid ABHA Auth ID."
      );
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7faf9",
        position: "relative"
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, display: loading ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.7)' }}>
        <LoadingAnimation visible={loading} />
      </div>
      <div
        style={{
          background: "rgba(255,255,255,0.92)",
          borderRadius: "1.25rem",
          boxShadow: "0 6px 32px rgba(55,172,136,0.16)",
          padding: "2.5rem 2.5rem 2rem 2.5rem",
          minWidth: "340px",
          maxWidth: "95vw",
          border: "1.5px solid #37AC88",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#37AC88"/><path d="M10 16.5V15C10 12.2386 12.2386 10 15 10C17.7614 10 20 12.2386 20 15V16.5" stroke="white" strokeWidth="2" strokeLinecap="round"/><rect x="10" y="16.5" width="10" height="5.5" rx="2.75" fill="white"/></svg>
          <h2 style={{ color: "#37AC88", fontWeight: 700, fontSize: "1.5rem", margin: 0 }}>ABHA Login</h2>
        </div>
        <div style={{ display: "flex", width: "100%", justifyContent: "center", marginBottom: "1.5rem", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => { setTab('aadhar'); setError(""); }}
            style={{
              flex: 1,
              background: tab === 'aadhar' ? '#37AC88' : 'transparent',
              color: tab === 'aadhar' ? '#fff' : '#37AC88',
              border: '1.5px solid #37AC88',
              borderRadius: '0.5rem',
              padding: '0.7rem 0',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            Aadhaar Card
          </button>
          <button
            type="button"
            onClick={() => { setTab('abha'); setError(""); }}
            style={{
              flex: 1,
              background: tab === 'abha' ? '#37AC88' : 'transparent',
              color: tab === 'abha' ? '#fff' : '#37AC88',
              border: '1.5px solid #37AC88',
              borderRadius: '0.5rem',
              padding: '0.7rem 0',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            ABHA Auth ID
          </button>
        </div>
        <form onSubmit={handleLogin} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {tab === 'aadhar' ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label htmlFor="aadhar" style={{ color: "#37AC88", fontWeight: 600, fontSize: "1rem" }}>Aadhaar Card Number</label>
              <input
                id="aadhar"
                type="text"
                value={aadhar}
                onChange={e => setAadhar(e.target.value.replace(/[^0-9]/g, ""))}
                maxLength={12}
                placeholder="Enter your 12-digit Aadhaar number"
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1.5px solid #37AC88",
                  fontSize: "1.05rem",
                  background: "#f7faf9",
                  color: "#222",
                  fontWeight: 500,
                  outline: "none",
                  transition: "border 0.2s",
                  boxShadow: error ? "0 0 0 2px #ff4d4f" : "none",
                }}
              />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label htmlFor="abhaId" style={{ color: "#37AC88", fontWeight: 600, fontSize: "1rem" }}>ABHA Auth ID</label>
              <input
                id="abhaId"
                type="text"
                value={abhaId}
                onChange={e => setAbhaId(e.target.value)}
                maxLength={14}
                placeholder="Enter your ABHA Auth ID"
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1.5px solid #37AC88",
                  fontSize: "1.05rem",
                  background: "#f7faf9",
                  color: "#222",
                  fontWeight: 500,
                  outline: "none",
                  transition: "border 0.2s",
                  boxShadow: error ? "0 0 0 2px #ff4d4f" : "none",
                }}
              />
            </div>
          )}
          <button
            type="submit"
            style={{
              background: "#37AC88",
              color: "#fff",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.85rem 0",
              fontWeight: 700,
              fontSize: "1.08rem",
              cursor: "pointer",
              width: "100%",
              boxShadow: "0 2px 8px rgba(55,172,136,0.10)",
              marginTop: "0.5rem",
              letterSpacing: "0.02em",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            Login
          </button>
          {error && <div style={{ color: "#ff4d4f", fontWeight: 500, fontSize: "0.98rem", textAlign: "center" }}>{error}</div>}
        </form>
        <div style={{ color: "#37AC88", fontSize: "0.98rem", textAlign: "center", marginTop: "1.5rem" }}>
          Need an ABHA ID? <br />
          <span style={{ fontWeight: 600 }}>
            Please register on the <a href="https://abha.abdm.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: "#37AC88", textDecoration: "underline" }}>ABHA portal</a> to get your ABHA ID.
          </span>
        </div>
      </div>
    </div>
  );
}
