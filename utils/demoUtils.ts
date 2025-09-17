export const TYPEWRITER_SPEED = 100; // ms per character
export const LOADER_DURATION = 1500; // ms
export const CURSOR_MOVE_DURATION = 2500; // ms
export const PAUSE_AFTER_FHIR = 2000; // ms
export const PAUSE_BETWEEN_SCENARIOS = 2000; // ms

export const scenarios = [
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

export type Phase = 'typing-user-input' | 'loading' | 'showing-output' | 'cursor-animation' | 'flipping' | 'showing-fhir' | 'pause-after-fhir' | 'paused' | 'transitioning';

export interface TypewriterState {
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

export const getPredefinedPath = (pathIndex: number, startX: number, startY: number, endX: number, endY: number) => {
  if (pathIndex === 0) {
    return [
      { x: startX, y: startY },
      { x: startX + (endX - startX) * 0.2, y: startY + 20 },
      { x: startX + (endX - startX) * 0.4, y: startY + 60 },
      { x: startX + (endX - startX) * 0.7, y: startY + 80 },
      { x: endX - 10, y: endY + 5 },
      { x: endX, y: endY }
    ];
  } else if (pathIndex === 1) {
    return [
      { x: startX, y: startY },
      { x: startX + (endX - startX) * 0.15, y: startY + 40 },
      { x: startX + (endX - startX) * 0.45, y: startY + 75 },
      { x: startX + (endX - startX) * 0.75, y: startY + 85 },
      { x: endX + 8, y: endY - 3 },
      { x: endX, y: endY }
    ];
  }
  
  return generateHumanizedPath(startX, startY, endX, endY);
};

export const generateHumanizedPath = (startX: number, startY: number, endX: number, endY: number) => {
  const waypoints = [];
  const numWaypoints = 4 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i <= numWaypoints; i++) {
    const t = i / numWaypoints;
    
    let x = startX + (endX - startX) * t;
    let y = startY + (endY - startY) * t;
    
    if (i > 0 && i < numWaypoints) {
      const variationStrength = Math.sin(t * Math.PI) * 0.4;
      const randomFactorX = (Math.random() - 0.5) * 80 * variationStrength;
      const randomFactorY = (Math.random() - 0.5) * 60 * variationStrength;
      
      x += randomFactorX;
      y += randomFactorY;
      
      const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
      const arcHeight = distance * 0.15 * Math.sin(t * Math.PI);
      const perpX = -(endY - startY) / distance;
      const perpY = (endX - startX) / distance;
      
      x += perpX * arcHeight;
      y += perpY * arcHeight;
    }
    
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

export const typeText = (
  text: string,
  currentText: string,
  callback: (newText: string, isComplete: boolean) => void,
  prefersReducedMotion: boolean,
  timeoutRef: React.MutableRefObject<NodeJS.Timeout | undefined>
) => {
  if (prefersReducedMotion) {
    callback(text, true);
    return;
  }

  if (currentText.length < text.length) {
    const nextChar = text[currentText.length];
    const newText = currentText + nextChar;
    callback(newText, false);
    
    timeoutRef.current = setTimeout(() => {
      typeText(text, newText, callback, prefersReducedMotion, timeoutRef);
    }, TYPEWRITER_SPEED);
  } else {
    callback(text, true);
  }
};

export const animateCursorToTarget = (
  startX: number,
  startY: number,
  targetX: number,
  targetY: number,
  currentScenarioIndex: number,
  setState: React.Dispatch<React.SetStateAction<TypewriterState>>,
  timeoutRef: React.MutableRefObject<NodeJS.Timeout | undefined>
) => {
  const pathIndex = currentScenarioIndex % 2;
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
      
      const baseDelay = CURSOR_MOVE_DURATION / waypoints.length;
      const variableDelay = baseDelay + (Math.random() - 0.5) * baseDelay * 0.2;
      
      timeoutRef.current = setTimeout(moveToNextWaypoint, Math.max(100, variableDelay));
    } else {
      setTimeout(() => {
        setState(prev => ({ 
          ...prev, 
          phase: 'flipping',
          showCursor: false,
          showClickEffect: true,
          clickPosition: { x: targetX, y: targetY }
        }));
        
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            showClickEffect: false
          }));
        }, 600);
      }, 400 + Math.random() * 200);
    }
  };
  
  moveToNextWaypoint();
};