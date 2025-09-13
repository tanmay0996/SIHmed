"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sphere } from "./MedicalIcons";

/**
 * GlobalStethoscope — oscillating path (right -> left -> right)
 *
 * Usage:
 *   <GlobalStethoscope debug showFallback />
 * Turn off debug/showFallback for production.
 */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function GlobalSphere({
  debug = false,
  showFallback = false,
}: {
  debug?: boolean;
  showFallback?: boolean;
}) {
  const { scrollYProgress } = useScroll();

  // Control points (normalized scroll positions) that define the keyframes.
  // Tweak these to move the swings earlier/later.
  const controlPoints = [0, 0.20, 0.45, 0.70, 1]; // 5 points: start, right, left, right, exit

  // X positions corresponding to control points (percent values)
  // Pattern: start near center (0) -> move right (60%) -> move left (-20%) -> move right again (60%) -> exit (120%)
  const xPositions = ["0%", "60%", "-100%", "60%", "120%"];

  // Y positions give a small vertical arc as it travels
  const yPositions = ["0%", "6%", "10%", "8%", "20%"];

  // Rotation for personality
  const rotationPositions = ["18deg", "2deg", "-8deg", "4deg", "18deg"];

  // Scale (small bounce)
  const scalePositions = [1, 0.9, 0.78, 0.95, 1.05];

  // Opacity: visible across most of path, small fade at the end
  const opacityPositions = [0, 0.2, 0.2, 0.2, 0];


  // Convert rotation strings to numeric degrees for useTransform (useTransform accepts numbers too)
  // But framer-motion accepts strings too for rotate so we can keep them as strings; still use them directly.

  // Build transforms driven by global scroll
  const x = useTransform(scrollYProgress, controlPoints, xPositions);
  const y = useTransform(scrollYProgress, controlPoints, yPositions);
  const rotate = useTransform(scrollYProgress, controlPoints, rotationPositions);
  const scale = useTransform(scrollYProgress, controlPoints, scalePositions);
  const opacity = useTransform(scrollYProgress, controlPoints, opacityPositions);

  // debug console
  useEffect(() => {
    if (debug) console.log("[GlobalSphere] controlPoints:", controlPoints);
  }, [debug]);

  // container style keeps it on top and non-interactive
  const containerStyle: React.CSSProperties = {
    zIndex: 50,
    pointerEvents: "none",
  };

  return (
    <>
      {debug && (
        <div
          style={{
            position: "fixed",
            right: 12,
            top: 12,
            zIndex: 999999,
            background: "rgba(255,255,255,0.92)",
            padding: "8px 10px",
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            fontSize: 12,
            color: "#111",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Sphere debug</div>
          <div>Keyframes: {controlPoints.map((p) => p.toFixed(2)).join(", ")}</div>
          <div style={{ marginTop: 6, color: "#666" }}>
            Pattern: right → left → right (tweak controlPoints/xPositions to tune)
          </div>
        </div>
      )}

      <div aria-hidden style={containerStyle} className="pointer-events-none">
        <motion.div
          className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-50 "
          initial={false}
          style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
        >
          <motion.div
            style={{
              x,
              y,
              rotate,
              scale,
              opacity,
            }}
            initial={false}
            transition={{ ease: "easeOut", duration: 0.4 }}
          >
            <div
              style={{
                display: "inline-block",
                WebkitFilter: "drop-shadow(0 12px 24px rgba(0,0,0,0.12))",
              }}
            >
              <Sphere className="w-72 h-72 md:w-96 md:h-96" animate />
            </div>
          </motion.div>

          {/* fallback visual dot to confirm the motion (optional) */}
          {showFallback && (
            <motion.div
              aria-hidden
              style={{
                x,
                y,
                opacity,
              }}
              initial={false}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  background: "#7c3aed",
                  boxShadow: "0 8px 20px rgba(124,58,237,0.28)",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}
