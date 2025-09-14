"use client";

import { motion } from "framer-motion";

export default function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 text-emerald-900/10 overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 -left-1/4 sm:left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl"
        animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ maxWidth: '100vw' }}
      />
      <motion.div
        className="absolute top-1/3 -right-1/4 sm:right-1/3 w-64 sm:w-80 h-64 sm:h-80 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl"
        animate={{ x: [0, -80, 0], y: [0, 80, 0], scale: [1.2, 1, 1.2] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        style={{ maxWidth: '100vw' }}
      />

      {/* Global medical grid */}
      <div className="absolute inset-0 opacity-15 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 100% 100%" preserveAspectRatio="none">
          <defs>
            <pattern id="medical-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#medical-grid)" />
        </svg>
      </div>
    </div>
  );
}
