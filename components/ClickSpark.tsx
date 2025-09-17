'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function ClickSpark({ position, visible }: { position: { x: number; y: number }, visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute pointer-events-none z-50"
          style={{
            left: position.x,
            top: position.y,
            width: 0,
            height: 0,
          }}
          initial={{ opacity: 1, scale: 0 }}
          animate={{ 
            opacity: [1, 0.8, 0],
            scale: [0, 1.2, 1.5],
          }}
          exit={{ opacity: 0, scale: 2 }}
          transition={{ 
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            scale: { duration: 0.6 },
            opacity: { duration: 0.6 }
          }}
        >
          <div className="absolute -inset-1 bg-blue-400 rounded-full blur-sm" />
          <div className="absolute -inset-0.5 bg-blue-300 rounded-full blur" />
          <div className="absolute inset-0 bg-white rounded-full" />
          
          {/* Spark particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: Math.cos((i / 6) * Math.PI * 2) * 15,
                y: Math.sin((i / 6) * Math.PI * 2) * 15,
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.05,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
