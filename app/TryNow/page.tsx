"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, ArrowRight } from 'lucide-react';

// Demo scenarios data
const scenarios = [
  {
    id: 'tm2-code',
    userInput: 'Code: SL20',
    systemOutput: {
      input_type: "tm2_code",
      input_value: "SL20",
      matches: [
        {
          tm2_code: "SL20",
          tm2_title: "Excessive sneezing disorder (TM2)",
          matched_namaste_codes: [
            {
              code: "I-1.5",
              term: "kaPaja-pratiSyAyaH",
              confidence: 1.0,
              dosha: "Kapha"
            }
          ]
        }
      ]
    },
    fhirOutput: {
      resourceType: "CodeSystem",
      lookup: {
        system: "http://terminology.hl7.org/CodeSystem/tm2-ayurveda",
        code: "SL20",
        display: "Excessive sneezing disorder (TM2)",
        property: [
          {
            code: "mapped-to-namaste",
            valueCode: "I-1.5"
          },
          {
            code: "confidence",
            valueDecimal: 1.0
          }
        ]
      }
    }
  },
  {
    id: 'symptoms',
    userInput: 'Symptoms: excessive sneezing, runny nose, nasal congestion',
    systemOutput: {
      input_type: "symptoms",
      input_value: "excessive sneezing, runny nose, nasal congestion",
      suggested_codes: [
        {
          tm2_matches: [
            {
              code: "SL20",
              title: "Excessive sneezing disorder (TM2)",
              symptom_match_score: 0.85,
              doshas: ["Vata", "Kapha"]
            }
          ],
          namaste_matches: [
            {
              code: "I-1.5",
              term: "kaPaja-pratiSyAyaH",
              symptom_match_score: 0.78,
              dosha: "Kapha"
            }
          ]
        }
      ]
    },
    fhirOutput: {
      resourceType: "Condition",
      id: "symptom-based-condition",
      code: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/tm2-ayurveda",
            code: "SL20",
            display: "Excessive sneezing disorder (TM2)"
          }
        ],
        text: "Excessive sneezing with nasal congestion"
      },
      evidence: [
        {
          code: [
            {
              coding: [
                {
                  system: "http://snomed.info/sct",
                  code: "162367006",
                  display: "Sneezing"
                }
              ]
            }
          ]
        }
      ]
    }
  }
];

export default function LiveDemoAutoplay() {
  const [inputValue, setInputValue] = useState('');
  const [currentScenario, setCurrentScenario] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setIsFlipped(false);
    const matched = scenarios.find(s => s.userInput.toLowerCase() === inputValue.toLowerCase().trim());
    setCurrentScenario(matched || null);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <section  className="py-8 bg-gradient-to-br from-slate-50/50 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Background glow - reduced size */}
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-100/20 via-white/40 to-teal-100/20 rounded-xl blur-xl" />
          <div className="relative bg-white/90 backdrop-blur-xl rounded-lg border border-white/60 p-4">
            {/* Header - more compact */}
            <div className="text-center mb-4">
              <motion.div className="flex items-center justify-center space-x-1.5 mb-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-emerald-700">Try Now</span>
              </motion.div>
              
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                Auto-Translation
              </h2>
              <p className="text-xs text-slate-600">
                Ayush to FHIR mapping
              </p>
            </div>

            {/* Search Interface - more compact */}
            <div className="flex-1 relative mb-6">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter code or symptoms..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-white/80 backdrop-blur-sm font-mono min-h-[36px]"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

            {/* Loading Animation - more compact */}
            <AnimatePresence>
              {isLoading && (
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

            {/* Output Cards with 3D Flip Animation - reduced height */}
            <AnimatePresence>
              {currentScenario && !isLoading && (
                <motion.div
                  className="relative h-64 perspective-1000"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  style={{ perspective: '1000px' }}
                >
                  {/* System Output Card (Front) */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br from-slate-50/80 to-white/80 rounded-lg p-5 border border-slate-200/50 backface-hidden ${isFlipped ? 'pointer-events-none' : ''}`}
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
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
                          onClick={() => setIsFlipped(!isFlipped)}
                          className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-full font-medium cursor-pointer hover:bg-emerald-600 transition-all duration-200"
                        >
                          View FHIR →
                        </div>
                      </div>
                    </div>
                    <div className="relative h-48 overflow-hidden">
                      <motion.pre 
                        className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed h-full overflow-y-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {JSON.stringify(currentScenario.systemOutput, null, 2)}
                      </motion.pre>
                    </div>
                  </motion.div>

                  {/* FHIR Output Card (Back) */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-lg p-5 border border-emerald-200/50 backface-hidden ${!isFlipped ? 'pointer-events-none' : ''}`}
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                    animate={{
                      rotateY: isFlipped ? 0 : -180
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-emerald-700">FHIR Output</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                          FHIR
                        </span>
                        <div
                          onClick={() => setIsFlipped(!isFlipped)}
                          className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium cursor-pointer hover:bg-blue-600 transition-all duration-200"
                        >
                          View JSON →
                        </div>
                      </div>
                    </div>
                    <div className="relative h-48 overflow-hidden">
                      <motion.pre 
                        className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed h-full overflow-y-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {JSON.stringify(currentScenario.fhirOutput, null, 2)}
                      </motion.pre>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}