//components/OutputCards.tsx
import { motion, AnimatePresence } from 'framer-motion';

interface OutputCardsProps {
  showSystemOutput: boolean;
  isFlipped: boolean;
  showFhirOutput: boolean;
  systemOutput: any;
  fhirOutput: any;
  fhirButtonRef: React.RefObject<HTMLDivElement>;
}

const OutputCards: React.FC<OutputCardsProps> = ({
  showSystemOutput,
  isFlipped,
  showFhirOutput,
  systemOutput,
  fhirOutput,
  fhirButtonRef
}) => (
  <AnimatePresence>
    {showSystemOutput && (
      <motion.div
        className="relative h-64"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.25, 0.46, 0.45, 0.94],
          opacity: { duration: 0.4 },
          y: { duration: 0.5 },
          scale: { duration: 0.4, delay: 0.1 }
        }}
        style={{ perspective: '1000px' }}
      >
        {/* System Output Card (Front) */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br from-slate-50/80 to-white/80 rounded-lg p-5 border border-slate-200/50 ${isFlipped ? 'pointer-events-none' : ''}`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
          initial={{ rotateY: 0 }}
          animate={{
            rotateY: isFlipped ? 180 : 0
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-slate-700">System Output</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                JSON
              </span>
              <div
                ref={fhirButtonRef}
                className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-full font-medium cursor-pointer hover:bg-emerald-600 transition-all duration-200"
              >
                →
              </div>
            </div>
          </div>
          <div className="relative h-48 overflow-hidden">
            <motion.pre 
              className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed h-full overflow-y-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {JSON.stringify(systemOutput, null, 2)}
            </motion.pre>
          </div>
        </motion.div>

        {/* FHIR Output Card (Back) */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-lg p-5 border border-emerald-200/50 ${!isFlipped ? 'pointer-events-none' : ''}`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
          initial={{ rotateY: 180 }}
          animate={{
            rotateY: isFlipped ? 0 : 180
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-emerald-700">FHIR Output</h3>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
              FHIR
            </span>
          </div>
          <div className="relative h-48 overflow-hidden">
            {showFhirOutput && (
              <motion.pre 
                className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed h-full overflow-y-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {JSON.stringify(fhirOutput, null, 2)}
              </motion.pre>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default OutputCards;