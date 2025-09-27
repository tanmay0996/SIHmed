"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AbhaLogin() {
  const [aadhar, setAadhar] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded Aadhar number for demo
    const validAadhar = '123456789012';
    if (aadhar === validAadhar) {
      router.push('/');
    } else {
      alert('Invalid Aadhar number. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg border border-gray-100" style={{ borderColor: '#37ac88' }}>
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#37ac88' }}>
          Login to ABHA Portal
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700 mb-2">
              Aadhar Card Number
            </label>
            <input
              type="text"
              id="aadhar"
              name="aadhar"
              value={aadhar}
              onChange={e => setAadhar(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#37ac88]"
              maxLength={12}
              pattern="\d{12}"
              placeholder="Enter your 12-digit Aadhar number"
            />
          </div>
          <div className="text-sm text-gray-600 mb-4">
            You have to login here at ABHA portal to get your ABHA ID.
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#37ac88] text-white font-semibold rounded-md hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
