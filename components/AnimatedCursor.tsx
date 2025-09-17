// src/components/AnimatedCursor.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';

interface AnimatedCursorProps {
  position: { x: number; y: number };
  visible: boolean;
}

const AnimatedCursor: React.FC<AnimatedCursorProps> = ({ position, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        className="absolute pointer-events-none z-50"
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          rotate: 0,
          x: position.x,
          y: position.y
        }}
        exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
        transition={{ 
          duration: 0.4, 
          ease: "easeOut",
          x: { 
            duration: 2.5, // CURSOR_MOVE_DURATION / 1000
            ease: [0.23, 1, 0.32, 1]
          },
          y: { 
            duration: 2.5, // CURSOR_MOVE_DURATION / 1000
            ease: [0.23, 1, 0.32, 1]
          }
        }}
      >
        <div className="relative">
          <motion.div
            animate={{
              rotate: [0, -2, 1, 0],
              scale: [1, 0.98, 1.02, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <MousePointer2 className="w-5 h-5 text-blue-600 drop-shadow-lg filter" />
          </motion.div>
          
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 border-blue-400 rounded-full"
            animate={{
              scale: [0, 1.8, 0],
              opacity: [0.8, 0.3, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: [0.4, 0, 0.2, 1],
              repeatDelay: 0.5
            }}
          />
          
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-blue-300 rounded-full"
            animate={{
              scale: [0, 1.2, 0],
              opacity: [0.6, 0, 0]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.2,
              repeatDelay: 0.9
            }}
          />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default AnimatedCursor;