//components/LoadingAnimation.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingAnimation: React.FC<{ visible: boolean }> = ({ visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        className="flex flex-col items-center justify-center py-6 space-y-1"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
        <p className="text-xs text-slate-600">Processing...</p>
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default LoadingAnimation;