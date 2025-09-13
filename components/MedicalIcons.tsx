import React from 'react';

export const DNAHelix: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 10 Q30 25, 50 25 Q70 25, 80 10 M20 30 Q30 45, 50 45 Q70 45, 80 30 M20 50 Q30 65, 50 65 Q70 65, 80 50 M20 70 Q30 85, 50 85 Q70 85, 80 70"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M80 10 Q70 25, 50 25 Q30 25, 20 10 M80 30 Q70 45, 50 45 Q30 45, 20 30 M80 50 Q70 65, 50 65 Q30 65, 20 50 M80 70 Q70 85, 50 85 Q30 85, 20 70"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      opacity="0.6"
    />
    <circle cx="25" cy="15" r="2" fill="currentColor" />
    <circle cx="75" cy="35" r="2" fill="currentColor" />
    <circle cx="25" cy="55" r="2" fill="currentColor" />
    <circle cx="75" cy="75" r="2" fill="currentColor" />
  </svg>
);

export const MedicalCross: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="35" y="10" width="30" height="80" rx="4" fill="currentColor" />
    <rect x="10" y="35" width="80" height="30" rx="4" fill="currentColor" />
    <circle cx="50" cy="50" r="8" fill="white" />
  </svg>
);

export const HeartbeatLine: React.FC<{ className?: string }> = ({ className = "w-16 h-8" }) => (
  <div className="relative overflow-hidden">
    <svg className={className} viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 25 L30 25 L35 10 L40 40 L45 15 L50 35 L55 25 L200 25"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="opacity-30"
      />
      <path
        d="M0 25 L30 25 L35 10 L40 40 L45 15 L50 35 L55 25 L200 25"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="animate-heartbeat"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </svg>
    <style jsx global>{`
      @keyframes heartbeat {
        0% {
          transform: translateX(-100%);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      .animate-heartbeat {
        animation: heartbeat 2s ease-in-out infinite;
        stroke-dasharray: 1000;
        stroke-dashoffset: 1000;
        animation: dash 2s ease-in-out infinite;
      }
      @keyframes dash {
        to {
          stroke-dashoffset: 0;
        }
      }
    `}</style>
  </div>
);

export const StethoscopeIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="20" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="85" cy="20" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M15 32 Q15 45, 25 50 L35 55 L65 55 L75 50 Q85 45, 85 32" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="50" cy="75" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M50 60 L50 55" stroke="currentColor" strokeWidth="2" />
    <circle cx="50" cy="75" r="8" fill="currentColor" />
  </svg>
);

export const MicroscopeIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="80" width="60" height="8" fill="currentColor" />
    <rect x="45" y="20" width="10" height="60" fill="currentColor" />
    <circle cx="50" cy="25" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="50" cy="15" r="4" fill="currentColor" />
    <rect x="35" y="35" width="30" height="15" rx="2" fill="currentColor" />
    <rect x="40" y="55" width="20" height="8" fill="currentColor" />
  </svg>
);

export const PillIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="50" rx="35" ry="20" fill="currentColor" />
    <ellipse cx="50" cy="50" rx="35" ry="20" fill="white" fillOpacity="0.3" />
    <rect x="15" y="45" width="70" height="10" fill="white" fillOpacity="0.5" />
  </svg>
);

export const Sphere: React.FC<{ className?: string; animate?: boolean }> = ({
  className = "w-72 h-72 text-emerald-500/80",
  animate = false,
}) => (
  <svg
    className={className}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient
        id="sphere-gradient"
        cx="0.5"
        cy="0.5"
        r="0.5"
        fx="0.25"
        fy="0.25"
      >
        <stop stopColor="currentColor" stopOpacity="0.1" />
        <stop offset="1" stopColor="currentColor" stopOpacity="0.3" />
      </radialGradient>
      <filter id="sphere-glow">
        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle
      cx="100"
      cy="100"
      r="95"
      fill="url(#sphere-gradient)"
      filter="url(#sphere-glow)"
    />
    <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);