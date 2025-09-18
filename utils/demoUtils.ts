export const TYPEWRITER_SPEED = 100; // ms per character
export const LOADER_DURATION = 1500; // ms
export const CURSOR_MOVE_DURATION = 2500; // ms
export const PAUSE_AFTER_FHIR = 2000; // ms
export const PAUSE_BETWEEN_SCENARIOS = 2000; // ms

export const scenarios = [
  {
    id: 'tm2-code',
    userInput: 'Code: AAA',
    systemOutput: {
      input_type: "code_lookup",
      input_value: "AAA",
      total_matches: 3,
      systems_found: ["siddha", "ayurveda", "unani"],
      matches: [
        {
          system_type: "siddha",
          system_name: "Siddha Medicine",
          codes: [
            {
              namaste_code: "AAA",
              display_name: "Vaḷi",
              description: "Hepatic disease classified under vali humour",
              confidence_score: 0.76,
              tm2_mapping: {
                code: "SM0Z",
                display: "Heart, blood and circulatory disorders (TM2), unspecified",
                definition: "This category is an 'unspecified' residual category",
                category: "Cardiovascular",
                icd_link: "https://icd.who.int/browse/2025-01/mms/en#604042066/unspecified"
              }
            }
          ]
        },
        {
          system_type: "ayurveda",
          system_name: "Ayurveda",
          codes: [
            {
              namaste_code: "A-1.2",
              display_name: "Vata-vikara",
              description: "Vata dosha imbalance affecting nervous system",
              confidence_score: 0.73,
              tm2_mapping: {
                code: "SK5Z",
                display: "Head, brain, nerve and movement disorders (TM2), unspecified",
                definition: "This category is an 'unspecified' residual category",
                category: "Neurological",
                icd_link: "https://icd.who.int/browse/2025-01/mms/en#627880448/unspecified"
              }
            }
          ]
        },
        {
          system_type: "unani",
          system_name: "Unani Medicine",
          codes: [
            {
              namaste_code: "U-3.1",
              display_name: "Dam-e-Sauda",
              description: "Blood stasis disorder in Unani medicine",
              confidence_score: 0.69,
              tm2_mapping: {
                code: "SP4Y",
                display: "Other specified bone, joint and muscle disorders (TM2)",
                definition: "This category is an 'other specified' residual category",
                category: "Musculoskeletal",
                icd_link: "https://icd.who.int/browse/2025-01/mms/en#1324098793/other"
              }
            }
          ]
        }
      ],
      cross_system_analysis: {
        highest_confidence: 0.76,
        systems_with_mappings: 3,
        primary_categories: ["Heart", "Head", "Other"]
      }
    },
    fhirOutput: {
      resourceType: "CodeSystem",
      id: "lookup-result-AAA",
      url: "http://terminology.hl7.org.in/CodeSystem/namaste",
      status: "active",
      content: "complete",
      count: 3,
      concept: [
        {
          code: "AAA",
          display: "Vaḷi",
          definition: "Hepatic disease classified under vali humour",
          property: [
            {
              code: "system-type",
              valueString: "siddha"
            },
            {
              code: "confidence",
              valueDecimal: 0.76
            },
            {
              code: "tm2-mapping",
              valueCoding: {
                system: "http://id.who.int/icd/release/11/tm2",
                code: "SM0Z",
                display: "Heart, blood and circulatory disorders (TM2), unspecified"
              }
            }
          ]
        },
        {
          code: "A-1.2",
          display: "Vata-vikara",
          definition: "Vata dosha imbalance affecting nervous system",
          property: [
            {
              code: "system-type",
              valueString: "ayurveda"
            },
            {
              code: "confidence",
              valueDecimal: 0.73
            },
            {
              code: "tm2-mapping",
              valueCoding: {
                system: "http://id.who.int/icd/release/11/tm2",
                code: "SK5Z",
                display: "Head, brain, nerve and movement disorders (TM2), unspecified"
              }
            }
          ]
        },
        {
          code: "U-3.1",
          display: "Dam-e-Sauda",
          definition: "Blood stasis disorder in Unani medicine",
          property: [
            {
              code: "system-type",
              valueString: "unani"
            },
            {
              code: "confidence",
              valueDecimal: 0.69
            },
            {
              code: "tm2-mapping",
              valueCoding: {
                system: "http://id.who.int/icd/release/11/tm2",
                code: "SP4Y",
                display: "Other specified bone, joint and muscle disorders (TM2)"
              }
            }
          ]
        }
      ],
      lookup: {
        system: "http://terminology.hl7.org.in/CodeSystem/namaste",
        code: "AAA",
        display: "Vaḷi",
        property: [
          {
            code: "total-matches",
            valueInteger: 3
          },
          {
            code: "primary-system",
            valueString: "siddha"
          },
          {
            code: "highest-confidence",
            valueDecimal: 0.76
          }
        ]
      }
    }
  },
  {
    id: 'symptoms',
    userInput: 'Code: SL20',
    systemOutput: {
      input_type: "code_lookup",
      input_value: "SL20",
      total_matches: 2,
      systems_found: ["ayurveda", "unani"],
      matches: [
        {
          system_type: "ayurveda",
          system_name: "Ayurveda",
          codes: [
            {
              namaste_code: "I-1.5",
              display_name: "kaPaja-pratiSyAyaH",
              description: "Kapha dosha related sneezing disorder",
              confidence_score: 1.0,
              tm2_mapping: {
                code: "SL20",
                display: "Excessive sneezing disorder (TM2)",
                definition: "Disorder characterized by excessive sneezing",
                category: "Respiratory",
                icd_link: "https://icd.who.int/browse/2025-01/mms/en#SL20"
              }
            }
          ]
        },
        {
          system_type: "unani",
          system_name: "Unani Medicine",
          codes: [
            {
              namaste_code: "U-2.3",
              display_name: "Nazla-e-Har",
              description: "Unani medicine term for nasal discharge and sneezing",
              confidence_score: 0.85,
              tm2_mapping: null
            }
          ]
        }
      ],
      cross_system_analysis: {
        highest_confidence: 1.0,
        systems_with_mappings: 1,
        primary_categories: ["Excessive", "Nazla-e-Har"]
      }
    },
    fhirOutput: {
      resourceType: "CodeSystem",
      id: "lookup-result-SL20",
      url: "http://terminology.hl7.org.in/CodeSystem/namaste",
      status: "active",
      content: "complete",
      count: 2,
      concept: [
        {
          code: "I-1.5",
          display: "kaPaja-pratiSyAyaH",
          definition: "Kapha dosha related sneezing disorder",
          property: [
            {
              code: "system-type",
              valueString: "ayurveda"
            },
            {
              code: "confidence",
              valueDecimal: 1.0
            },
            {
              code: "tm2-mapping",
              valueCoding: {
                system: "http://id.who.int/icd/release/11/tm2",
                code: "SL20",
                display: "Excessive sneezing disorder (TM2)"
              }
            }
          ]
        },
        {
          code: "U-2.3",
          display: "Nazla-e-Har",
          definition: "Unani medicine term for nasal discharge and sneezing",
          property: [
            {
              code: "system-type",
              valueString: "unani"
            },
            {
              code: "confidence",
              valueDecimal: 0.85
            }
          ]
        }
      ],
      lookup: {
        system: "http://terminology.hl7.org.in/CodeSystem/namaste",
        code: "SL20",
        display: "kaPaja-pratiSyAyaH",
        property: [
          {
            code: "total-matches",
            valueInteger: 2
          },
          {
            code: "primary-system",
            valueString: "ayurveda"
          },
          {
            code: "highest-confidence",
            valueDecimal: 1.0
          }
        ]
      }
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