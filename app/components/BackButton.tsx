
"use client";
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      aria-label="Go back"
      style={{
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: 1000,
        background: 'white',
        border: 'none',
        borderRadius: '50%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      {/* Simple left arrow SVG icon */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
