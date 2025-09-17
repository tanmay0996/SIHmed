"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, ArrowRight, MousePointer2 } from 'lucide-react';
import ClickSpark from './ClickSpark';

// Configurable timing constants
const TYPEWRITER_SPEED = 100; // ms per character (slower = more visible typing)
const LOADER_DURATION = 1500; // ms
const CURSOR_MOVE_DURATION = 2500; // ms - slower cursor movement
const PAUSE_AFTER_FHIR = 2000; // ms
const PAUSE_BETWEEN_SCENARIOS = 2000; // ms

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

// Animation phases for each scenario
type Phase = 'typing-user-input' | 'loading' | 'showing-output' | 'cursor-animation' | 'flipping' | 'showing-fhir' | 'pause-after-fhir' | 'paused' | 'transitioning';

interface TypewriterState {
  currentScenarioIndex: number;
  phase: Phase;
  displayedUserInput: string;
  showSystemOutput: boolean;
  showFhirOutput: boolean;
  isFlipped: boolean;
  cursorPosition: { x: number; y: number };
  showCursor: boolean;
  showClickEffect: boolean;
  clickPosition: { x: number; y: number };
}

// Predefined perfect cursor movements (the first two that looked great)
const getPredefinedPath = (pathIndex: number, startX: number, startY: number, endX: number, endY: number) => {
  if (pathIndex === 0) {
    // First perfect movement: left -> down -> button (smooth arc)
    return [
      { x: startX, y: startY },
      { x: startX + (endX - startX) * 0.2, y: startY + 20 }, // Slight right, down
      { x: startX + (endX - startX) * 0.4, y: startY + 60 }, // More right, more down
      { x: startX + (endX - startX) * 0.7, y: startY + 80 }, // Continue arc
      { x: endX - 10, y: endY + 5 }, // Near target with slight offset
      { x: endX, y: endY } // Final target
    ];
  } else if (pathIndex === 1) {
    // Second perfect movement: different approach with curve
    return [
      { x: startX, y: startY },
      { x: startX + (endX - startX) * 0.15, y: startY + 40 }, // Down first
      { x: startX + (endX - startX) * 0.45, y: startY + 75 }, // Arc motion
      { x: startX + (endX - startX) * 0.75, y: startY + 85 }, // Continue smooth
      { x: endX + 8, y: endY - 3 }, // Slight overshoot
      { x: endX, y: endY } // Final target
    ];
  }
  
  // Fallback to generated path for any other index
  return generateHumanizedPath(startX, startY, endX, endY);
};

// Generate humanized waypoints for cursor movement (backup function)
const generateHumanizedPath = (startX: number, startY: number, endX: number, endY: number) => {
  const waypoints = [];
  const numWaypoints = 4 + Math.floor(Math.random() * 3); // 4-6 waypoints for more variation
  
  for (let i = 0; i <= numWaypoints; i++) {
    const t = i / numWaypoints;
    
    // Base interpolation
    let x = startX + (endX - startX) * t;
    let y = startY + (endY - startY) * t;
    
    // Add human-like variations (more at middle, less at endpoints)
    if (i > 0 && i < numWaypoints) {
      const variationStrength = Math.sin(t * Math.PI) * 0.4;
      const randomFactorX = (Math.random() - 0.5) * 80 * variationStrength;
      const randomFactorY = (Math.random() - 0.5) * 60 * variationStrength;
      
      x += randomFactorX;
      y += randomFactorY;
      
      // Add some arc-like movement
      const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
      const arcHeight = distance * 0.15 * Math.sin(t * Math.PI);
      const perpX = -(endY - startY) / distance;
      const perpY = (endX - startX) / distance;
      
      x += perpX * arcHeight;
      y += perpY * arcHeight;
    }
    
    // Slight overshoot near target
    if (i === numWaypoints - 1) {
      const overshootX = (endX - startX) * 0.03 * (Math.random() - 0.5);
      const overshootY = (endY - startY) * 0.03 * (Math.random() - 0.5);
      x += overshootX;
      y += overshootY;
    }
    
    waypoints.push({ x, y });
  }
  
  return waypoints;
};

// Enhanced cursor component with more humanized movement and proper icon
const AnimatedCursor = ({ position, visible }: { position: { x: number; y: number }, visible: boolean }) => (
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
            duration: CURSOR_MOVE_DURATION / 1000, 
            ease: [0.23, 1, 0.32, 1] // More natural easing curve
          },
          y: { 
            duration: CURSOR_MOVE_DURATION / 1000, 
            ease: [0.23, 1, 0.32, 1]
          }
        }}
      >
        <div className="relative">
          {/* Proper cursor icon with slight rotation and shadow */}
          <motion.div
            animate={{
              rotate: [0, -2, 1, 0], // Subtle rotation during movement
              scale: [1, 0.98, 1.02, 1] // Subtle scale variation
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <MousePointer2 className="w-5 h-5 text-blue-600 drop-shadow-lg filter" />
          </motion.div>
          
          {/* Click ripple effect with more natural timing */}
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
          
          {/* Secondary ripple for more depth */}
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

export default function LiveDemoAutoplay() {
  const [state, setState] = useState<TypewriterState>({
    currentScenarioIndex: 0,
    phase: 'typing-user-input',
    displayedUserInput: '',
    showSystemOutput: false,
    showFhirOutput: false,
    isFlipped: false,
    cursorPosition: { x: 0, y: 0 },
    showCursor: false,
    showClickEffect: false,
    clickPosition: { x: 0, y: 0 }
  });

  const timeoutRef = useRef<NodeJS.Timeout>();
  const prefersReducedMotion = useRef(false);
  const fhirButtonRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, []);

  // Handle top button click
  const handleTopButtonClick = () => {
    console.log('Top right button clicked!');
    // Add your custom logic here
    alert('Settings button clicked!');
  };

  // Typewriter effect function
  const typeText = (text: string, currentText: string, callback: (newText: string, isComplete: boolean) => void) => {
    if (prefersReducedMotion.current) {
      callback(text, true);
      return;
    }

    if (currentText.length < text.length) {
      const nextChar = text[currentText.length];
      const newText = currentText + nextChar;
      callback(newText, false);
      
      timeoutRef.current = setTimeout(() => {
        typeText(text, newText, callback);
      }, TYPEWRITER_SPEED);
    } else {
      callback(text, true);
    }
  };

  // Humanized cursor movement function
  const animateCursorToTarget = (startX: number, startY: number, targetX: number, targetY: number) => {
    // Use predefined perfect movements in a cycle
    const pathIndex = state.currentScenarioIndex % 2; // Cycle between 0 and 1
    const waypoints = getPredefinedPath(pathIndex, startX, startY, targetX, targetY);
    let currentWaypoint = 0;
    
    console.log(`Using predefined path ${pathIndex} with ${waypoints.length} waypoints`);
    
    const moveToNextWaypoint = () => {
      if (currentWaypoint < waypoints.length) {
        const point = waypoints[currentWaypoint];
        setState(prev => ({ 
          ...prev,
          cursorPosition: { x: point.x, y: point.y }
        }));
        
        currentWaypoint++;
        
        // Variable timing between waypoints (more human-like)
        const baseDelay = CURSOR_MOVE_DURATION / waypoints.length;
        const variableDelay = baseDelay + (Math.random() - 0.5) * baseDelay * 0.2; // Reduced randomness for consistency
        
        timeoutRef.current = setTimeout(moveToNextWaypoint, Math.max(100, variableDelay));
      } else {
        // Click after reaching target with realistic hesitation
        setTimeout(() => {
          setState(prev => ({ 
            ...prev, 
            phase: 'flipping',
            showCursor: false,
            showClickEffect: true,
            clickPosition: { x: targetX, y: targetY }
          }));
          
          // Hide click effect after animation completes
          setTimeout(() => {
            setState(prev => ({
              ...prev,
              showClickEffect: false
            }));
          }, 600);
        }, 400 + Math.random() * 200); // Slightly more consistent timing
      }
    };
    
    moveToNextWaypoint();
  };

  // Main animation loop effect
  useEffect(() => {
    const currentScenario = scenarios[state.currentScenarioIndex];

    switch (state.phase) {
      case 'typing-user-input':
        // Type the user input in the search box
        typeText(currentScenario.userInput, state.displayedUserInput, (newText, isComplete) => {
          setState(prev => ({ ...prev, displayedUserInput: newText }));
          if (isComplete) {
            timeoutRef.current = setTimeout(() => {
              setState(prev => ({ ...prev, phase: 'loading' }));
            }, 300);
          }
        });
        break;

      case 'loading':
        // Show loading animation
        timeoutRef.current = setTimeout(() => {
          setState(prev => ({ ...prev, phase: 'showing-output' }));
        }, LOADER_DURATION);
        break;

      case 'showing-output':
        // Show system output instantly (no typewriter)
        setState(prev => ({ ...prev, showSystemOutput: true }));
        timeoutRef.current = setTimeout(() => {
          setState(prev => ({ ...prev, phase: 'cursor-animation' }));
        }, 800);
        break;

      case 'cursor-animation':
        // Animate cursor to FHIR button with predefined perfect movements
        if (fhirButtonRef.current) {
          const rect = fhirButtonRef.current.getBoundingClientRect();
          const containerRect = fhirButtonRef.current.closest('.relative')?.getBoundingClientRect();
          
          if (containerRect) {
            // Calculate center of the button relative to its container
            const buttonCenterX = rect.left - containerRect.left + rect.width / 2;
            const buttonCenterY = rect.top - containerRect.top + rect.height / 2;
            
            // Adjust for the actual position where we want the click to appear
            // Adding 5px right and 5px down from center
            const targetX = buttonCenterX + 25;
            const targetY = buttonCenterY + 23;
            
            // Fixed starting positions that worked perfectly
            const perfectStartingPositions = [
              { x: 50, y: containerRect.height - 30 }, // Position for first perfect movement
              { x: containerRect.width - 80, y: 60 }   // Position for second perfect movement
            ];
            
            // Use specific starting position based on scenario
            const startPos = perfectStartingPositions[state.currentScenarioIndex % 2];
            
            console.log(`Scenario ${state.currentScenarioIndex}: Using perfect movement pattern ${state.currentScenarioIndex % 2}`);
            
            setState(prev => ({ 
              ...prev, 
              showCursor: true,
              cursorPosition: { x: startPos.x, y: startPos.y }
            }));
            
            // Start movement with consistent timing
            setTimeout(() => {
              animateCursorToTarget(startPos.x, startPos.y, targetX, targetY);
            }, 250); // Fixed delay for consistency
          }
        }
        break;

      case 'flipping':
        // Flip the card to show FHIR output
        setState(prev => ({ ...prev, isFlipped: true }));
        timeoutRef.current = setTimeout(() => {
          setState(prev => ({ ...prev, phase: 'showing-fhir' }));
        }, 600);
        break;

      case 'showing-fhir':
        // Show FHIR output instantly
        setState(prev => ({ ...prev, showFhirOutput: true }));
        setState(prev => ({ ...prev, phase: 'pause-after-fhir' }));
        break;

      case 'pause-after-fhir':
        // Pause after FHIR output completes
        timeoutRef.current = setTimeout(() => {
          setState(prev => ({ ...prev, phase: 'transitioning' }));
        }, PAUSE_AFTER_FHIR);
        break;

      case 'transitioning':
        // Transition to next scenario
        timeoutRef.current = setTimeout(() => {
          const nextIndex = (state.currentScenarioIndex + 1) % scenarios.length;
          setState({
            currentScenarioIndex: nextIndex,
            phase: 'typing-user-input',
            displayedUserInput: '',
            showSystemOutput: false,
            showFhirOutput: false,
            isFlipped: false,
            cursorPosition: { x: 0, y: 0 },
            showCursor: false,
            showClickEffect: false,
            clickPosition: { x: 0, y: 0 }
          });
        }, PAUSE_BETWEEN_SCENARIOS);
        break;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state.phase, state.currentScenarioIndex, state.displayedUserInput]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const currentScenario = scenarios[state.currentScenarioIndex];

  return (
    <section id="demo" className="py-8 bg-gradient-to-br from-slate-50/50 to-white">
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
            {/* FHIR Button - Static */}
            <div className="absolute top-8 right-8 z-20">
              <button
                onClick={handleTopButtonClick}
                className={`flex items-center justify-center px-4 py-2 rounded-full font-medium text-sm font-semibold ${
                  state.phase === 'showing-output' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white text-emerald-600 border border-emerald-200'
                }`}
              >
                {state.phase === 'showing-output' ? 'View FHIR' : 'FHIR'}
              </button>
            </div>

            {/* Animated Cursor and Click Effect */}
            <AnimatedCursor position={state.cursorPosition} visible={state.showCursor} />
            <ClickSpark position={state.clickPosition} visible={state.showClickEffect} />
            
            {/* Header - more compact */}
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

            {/* Search Interface - more compact */}
            <div className="flex-1 relative mb-6">
              <input
                type="text"
                value={state.displayedUserInput}
                readOnly
                placeholder="Auto-typing demonstration..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-white/80 backdrop-blur-sm cursor-default font-mono min-h-[36px]"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              {state.phase === 'typing-user-input' && (
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <div className="w-0.5 h-4 bg-blue-500 animate-pulse" />
                </div>
              )}
            </div>

            {/* Loading Animation - more compact */}
            <AnimatePresence>
              {state.phase === 'loading' && (
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
              {state.showSystemOutput && (
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
                    className={`absolute inset-0 bg-gradient-to-br from-slate-50/80 to-white/80 rounded-lg p-5 border border-slate-200/50 backface-hidden ${state.isFlipped ? 'pointer-events-none' : ''}`}
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                    animate={{
                      rotateY: state.isFlipped ? 180 : 0
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
                    className={`absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-lg p-5 border border-emerald-200/50 backface-hidden ${!state.isFlipped ? 'pointer-events-none' : ''}`}
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                    animate={{
                      rotateY: state.isFlipped ? 0 : -180
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
                      {state.showFhirOutput && (
                        <motion.pre 
                          className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed h-full overflow-y-auto"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {JSON.stringify(currentScenario.fhirOutput, null, 2)}
                        </motion.pre>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress Indicator - more compact */}
            <div className="flex justify-center mt-4 space-x-1.5">
              {scenarios.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-200 ${
                    index === state.currentScenarioIndex
                      ? 'w-4 bg-emerald-500'
                      : 'w-1.5 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Status Indicator - more compact */}
            <div className="text-center mt-3">
              <p className="text-xs text-slate-500 flex items-center justify-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span>
                  Scenario {state.currentScenarioIndex + 1} of {scenarios.length} • 
                  {state.phase === 'typing-user-input' && ' Typing user input...'}
                  {state.phase === 'loading' && ' Processing request...'}
                  {state.phase === 'showing-output' && ' System response ready!'}
                  {state.phase === 'cursor-animation' && ' Preparing FHIR format...'}
                  {state.phase === 'flipping' && ' Transforming to FHIR...'}
                  {state.phase === 'showing-fhir' && ' FHIR output ready!'}
                  {state.phase === 'pause-after-fhir' && ' Demo completed!'}
                  {state.phase === 'transitioning' && ' Loading next scenario...'}
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}