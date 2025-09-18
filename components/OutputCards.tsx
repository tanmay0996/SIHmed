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
  <AnimatePresence mode="wait">
    {showSystemOutput && (
      <div className="relative h-64">
        {/* System Output Card (Front) - No Flip */}
        <AnimatePresence>
          {!isFlipped && (
            <motion.div
              key="front-card"
              className="absolute inset-0 bg-gradient-to-br from-slate-50/80 to-white/80 rounded-lg p-5 border border-slate-200/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-slate-700">Search Results</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                {systemOutput?.total_matches || 0} matches
              </span>
              <div
                ref={fhirButtonRef}
                className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-full font-medium cursor-pointer hover:bg-emerald-600 transition-all duration-200"
              >
                View FHIR →
              </div>
            </div>
          </div>
          <div className="relative h-48 overflow-hidden">
            <motion.div 
              className="h-full overflow-y-auto space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {systemOutput?.matches?.map((systemMatch: any, idx: number) => (
                <motion.div
                  key={idx}
                  className="bg-white/60 rounded-lg p-3 border border-slate-200/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-slate-800 capitalize">
                        {systemMatch.system_name}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        systemMatch.system_type === 'ayurveda' ? 'bg-orange-100 text-orange-700' :
                        systemMatch.system_type === 'siddha' ? 'bg-purple-100 text-purple-700' :
                        systemMatch.system_type === 'unani' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {systemMatch.system_type}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {systemMatch.codes.length} code{systemMatch.codes.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {systemMatch.codes.map((code: any, codeIdx: number) => (
                      <div key={codeIdx} className="bg-slate-50/50 rounded p-2 border-l-2 border-emerald-300">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-mono font-bold text-slate-800">
                                {code.namaste_code}
                              </span>
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                <span className="text-xs font-medium text-emerald-700">
                                  {Math.round(code.confidence_score * 100)}%
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-700 font-medium mb-1">
                              {code.display_name}
                            </p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {code.description}
                            </p>
                            {code.tm2_mapping && (
                              <div className="mt-2 p-2 bg-blue-50/50 rounded border border-blue-100">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-xs font-semibold text-blue-700">TM2:</span>
                                  <span className="text-xs font-mono text-blue-800">{code.tm2_mapping.code}</span>
                                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                    {code.tm2_mapping.category}
                                  </span>
                                </div>
                                <p className="text-xs text-blue-700">
                                  {code.tm2_mapping.display}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
              
              {systemOutput?.cross_system_analysis && (
                <motion.div
                  className="bg-emerald-50/60 rounded-lg p-3 border border-emerald-200/50 mt-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <h4 className="text-xs font-semibold text-emerald-800 mb-2">Analysis Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-emerald-700 font-medium">Best Match:</span>
                      <span className="ml-1 text-emerald-800">
                        {Math.round(systemOutput.cross_system_analysis.highest_confidence * 100)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-emerald-700 font-medium">Systems:</span>
                      <span className="ml-1 text-emerald-800">
                        {systemOutput.systems_found.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-emerald-700 font-medium">TM2 Links:</span>
                      <span className="ml-1 text-emerald-800">
                        {systemOutput.cross_system_analysis.systems_with_mappings}
                      </span>
                    </div>
                    <div>
                      <span className="text-emerald-700 font-medium">Categories:</span>
                      <span className="ml-1 text-emerald-800">
                        {systemOutput.cross_system_analysis.primary_categories.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FHIR Output Card (Back) - With Flip */}
        <AnimatePresence>
          {isFlipped && (
            <motion.div
              key="back-card"
              className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-lg p-5 border border-emerald-200/50"
              initial={{ opacity: 0, y: 10, rotateY: 90 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              exit={{ opacity: 0, y: -10, rotateY: -90 }}
              transition={{ duration: 0.3 }}
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
                initial={{ opacity: 0, y: 20 }}
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
          )}
        </AnimatePresence>
      </div>
    )}
  </AnimatePresence>
);

export default OutputCards;