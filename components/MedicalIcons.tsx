"use client";

import { motion } from "framer-motion";

interface IconProps {
  className?: string;
  animate?: boolean;
}

export const Stethoscope = ({ className = "w-8 h-8", animate = false }: IconProps) => {
  const stethoscopeVariants = {
    initial: { 
      pathLength: 0,
      opacity: 0,
      scale: 0.9
    },
    animate: {
      pathLength: 1,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    pulse: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    }
  };

  const pathVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className={`relative ${className}`}
      variants={animate ? stethoscopeVariants : undefined}
      initial="initial"
      animate={animate ? ["animate", "pulse"] : "animate"}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Stethoscope tube - main curve */}
        <motion.path
          d="M60 20C40 20 20 40 20 60C20 80 40 100 60 100C80 100 100 80 100 60"
          stroke="url(#stethoscopeGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))'
          }}
        />
        
        {/* Stethoscope tube - end curve */}
        <motion.path
          d="M100 60C100 60 105 65 110 60C115 55 110 50 105 50C100 50 100 55 100 55"
          stroke="url(#stethoscopeGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          variants={pathVariants}
        />
        
        {/* Stethoscope head */}
        <motion.circle
          cx="60"
          cy="20"
          r="12"
          fill="none"
          stroke="url(#stethoscopeGradient)"
          strokeWidth="6"
          variants={{
            initial: { scale: 0, opacity: 0 },
            animate: { 
              scale: 1, 
              opacity: 1,
              transition: {
                duration: 0.5,
                delay: 0.8,
                type: "spring",
                stiffness: 100
              }
            }
          }}
        />
        
        {/* Stethoscope chestpiece */}
        <motion.rect
          x="95"
          y="45"
          width="20"
          height="30"
          rx="10"
          fill="none"
          stroke="url(#stethoscopeGradient)"
          strokeWidth="6"
          variants={{
            initial: { scale: 0, rotate: -45 },
            animate: { 
              scale: 1, 
              rotate: 0,
              transition: {
                duration: 0.5,
                delay: 1,
                type: "spring",
                stiffness: 100
              }
            }
          }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient
            id="stethoscopeGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          
          {/* Inner glow effect */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>
      
      {/* Subtle pulsing effect */}
      {animate && (
        <motion.div 
          className="absolute inset-0 rounded-full bg-green-400 opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
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