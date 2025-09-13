"use client";

import { motion } from "framer-motion";

interface IconProps {
  className?: string;
  animate?: boolean;
}

export const Sphere = ({ className = "w-8 h-8", animate = false }: IconProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ scale: 0.8, opacity: 0, rotate: -30 }}
      animate={{
        scale: 1,
        opacity: 1,
        rotate: 0,
        transition: {
          duration: 0.8,
          ease: "easeOut"
        }
      }}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Main sphere gradient */}
          <radialGradient id="sphereGradient" cx="50%" cy="50%" r="70%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#065f46" />
          </radialGradient>
          
          {/* Glow effect */}
          <radialGradient id="sphereGlow" cx="50%" cy="50%" r="50%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
          
          {/* Highlight */}
          <radialGradient id="sphereHighlight" cx="30%" cy="30%" r="30%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          
          {/* Grid pattern for texture */}
          <pattern
            id="sphereGrid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10 0 L 10 20 M 0 10 L 20 10"
              stroke="white"
              strokeWidth="0.5"
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        
        {/* Main sphere */}
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          fill="url(#sphereGradient)"
          style={{
            filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.5))'
          }}
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
          }}
        />
        
        {/* Glow effect */}
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          fill="url(#sphereGlow)"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.7, 0],
            transition: {
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse" as const,
              ease: "easeInOut"
            }
          }}
        />
        
        {/* Highlight */}
        <motion.circle
          cx="45"
          cy="45"
          r="20"
          fill="url(#sphereHighlight)"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 0.8,
            transition: { duration: 1, delay: 0.3, ease: "easeOut" }
          }}
        />
        
        {/* Subtle grid texture */}
        <motion.rect
          width="100%"
          height="100%"
          fill="url(#sphereGrid)"
          opacity={0.1}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.1,
            transition: { duration: 1, delay: 0.5, ease: "easeOut" }
          }}
        />
      </svg>
      
      {/* Subtle pulsing effect */}
      {animate && (
        <motion.div 
          className="absolute inset-0 rounded-full bg-green-400 opacity-10"
          initial={{ scale: 1, opacity: 0.1 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};

export const DNAHelix = ({ className = "w-8 h-8", animate = false }: IconProps) => (
  <motion.svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={animate ? { rotateY: 360 } : {}}
    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
  >
    <path
      d="M3 3c3.5 0 6.5 3 6.5 6.5S6.5 16 3 16M21 8c-3.5 0-6.5 3-6.5 6.5S17.5 22 21 22"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M3 16c3.5 0 6.5-3 6.5-6.5S6.5 3 3 3M21 3c-3.5 0-6.5 3-6.5 6.5S17.5 16 21 16"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="7" cy="6" r="1" fill="currentColor" />
    <circle cx="17" cy="10" r="1" fill="currentColor" />
    <circle cx="7" cy="14" r="1" fill="currentColor" />
    <circle cx="17" cy="18" r="1" fill="currentColor" />
  </motion.svg>
);

export const MedicalCross = ({ className = "w-8 h-8", animate = false }: IconProps) => (
  <motion.svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={animate ? { scale: [1, 1.1, 1] } : {}}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  >
    <rect x="9" y="2" width="6" height="20" rx="3" fill="currentColor" />
    <rect x="2" y="9" width="20" height="6" rx="3" fill="currentColor" />
  </motion.svg>
);

export const HeartbeatLine = ({ className = "w-12 h-6", animate = true }: IconProps) => (
  <motion.svg
    className={className}
    viewBox="0 0 100 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M0 12 L20 12 L25 4 L30 20 L35 8 L40 16 L45 12 L100 12"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={animate ? { pathLength: 1 } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.svg>
);

export const NetworkIcon = ({ className = "w-8 h-8", animate = false }: IconProps) => (
  <motion.svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={animate ? { rotate: [0, 180, 360] } : {}}
    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
  >
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <circle cx="12" cy="3" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="21" cy="12" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="12" cy="21" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="3" cy="12" r="2" fill="currentColor" opacity="0.7" />
    <line x1="12" y1="5" x2="12" y2="9" stroke="currentColor" strokeWidth="2" />
    <line x1="19" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="2" />
    <line x1="12" y1="19" x2="12" y2="15" stroke="currentColor" strokeWidth="2" />
    <line x1="5" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" />
  </motion.svg>
);