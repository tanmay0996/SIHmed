// src/components/DemoHeader.tsx
import { motion } from 'framer-motion';

const DemoHeader: React.FC = () => (
  <div className="text-center mb-4 pr-12">
    <motion.div className="flex items-center justify-center space-x-1.5 mb-2">
      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
      <span className="text-xs font-semibold text-emerald-700">Demo</span>
    </motion.div>
    
    <h2 className="text-xl font-bold text-slate-800 mb-1">
      Auto-Translation
    </h2>
    <p className="text-xs text-slate-600">
      Ayush to FHIR mapping
    </p>
  </div>
);

export default DemoHeader;