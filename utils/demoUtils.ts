export const TYPEWRITER_SPEED = 100; // ms per character
export const LOADER_DURATION = 1500; // ms
export const CURSOR_MOVE_DURATION = 2500; // ms
export const PAUSE_AFTER_FHIR = 2000; // ms
export const PAUSE_BETWEEN_SCENARIOS = 2000; // ms

export const scenarios = [
  {
    id: 'tm2-code',
    userInput: 'Code: SN9Z',
    systemOutput: {
      input_type: "code_lookup",
      input_value: "SN9Z",
      total_matches: 3,
      systems_found: ["unani", "siddha", "ayurveda"],
      matches: [
        {
          system_type: "unani",
          system_name: "Unani Medicine",
          codes: [
            {
              namaste_code: "P-3",
              display_name: "Amrāḍ Ẓāhira",
              description: "the diseases which appear externally on the body the diseases which appear externally on the body and can be diagnosed commonly by general physical examination e.g. diseases of skin, nails, hair etc.",
              confidence_score: 0.9089845418930054,
              tm2_mapping: {
                code: "SN9Z",
                display: "Skin, nail and hair disorders (TM2), unspecified",
                definition: "This category is an 'unspecified' residual category",
                category: "Skin",
                icd_link: "https://icd.who.int/browse/2025-01/mms/en#1367002461/unspecified"
              }
            }
          ]
        },
        {
          system_type: "siddha",
          system_name: "Siddha Medicine",
          codes: [
            {
              namaste_code: "BUB1.2",
              display_name: "Tēmal",
              description: "Tinea versicolor It is characterised by round or other shaped patches on the skin that may be lighter or darker in colour. Patches may appear anywhere on the body, they may be itchy, dry and scaly. It is explained by increased vali which is followed by Aẕal. Among the s",
              confidence_score: 0.8827083110809326,
              tm2_mapping: {
                code: "SN9Z",
                display: "Skin, nail and hair disorders (TM2), unspecified",
                definition: "This category is an 'unspecified' residual category",
                category: "Skin",
                icd_link: "https://icd.who.int/browse/2025-01/mms/en#1367002461/unspecified"
              }
            }
          ]
        },
        {
          system_type: "ayurveda",
          system_name: "Ayurveda",
          codes: [
            {
              namaste_code: "AAD-1.2",
              display_name: "vyAnAvRutaprANavAtaH",
              description: "the disorder is characterized by svēdōऽtyartham [excessive sweating], lōmaharṣaḥ [horripilation], tvagdōṣaḥ [skin diseases], suptagātratā [numbness in the body parts]",
              confidence_score: 0.6655468940734863,
              tm2_mapping: {
                code: "SN9Z",
                display: "Skin, nail and hair disorders (TM2), unspecified",
                definition: "This category is an 'unspecified' residual category",
                category: "Skin",
                icd_link: "https://icd.who.int/browse/2025-01/mms/en#1367002461/unspecified"
              }
            }
          ]
        }
      ],
      cross_system_analysis: {
        highest_confidence: 0.9089845418930054,
        systems_with_mappings: 3,
        primary_categories: ["Skin", "Skin", "Skin"]
      }
    },
    fhirOutput: {
      resourceType: "CodeSystem",
      id: "lookup-result-SN9Z",
      url: "http://terminology.hl7.org.in/CodeSystem/namaste",
      status: "active",
      content: "complete",
      count: 3,
      concept: [
        {
          code: "P-3",
          display: "Amrāḍ Ẓāhira",
          definition: "the diseases which appear externally on the body the diseases which appear externally on the body and can be diagnosed commonly by general physical examination e.g. diseases of skin, nails, hair etc.",
          property: [
            {
              code: "system-type",
              valueString: "unani"
            },
            {
              code: "confidence",
              valueDecimal: 0.9089845418930054
            },
            {
              code: "tm2-mapping",
              valueCoding: {
                system: "http://id.who.int/icd/release/11/tm2",
                code: "SN9Z",
                display: "Skin, nail and hair disorders (TM2), unspecified"
              }
            }
          ]
        },
        {
          code: "BUB1.2",
          display: "Tēmal",
          definition: "Tinea versicolor It is characterised by round or other shaped patches on the skin that may be lighter or darker in colour. Patches may appear anywhere on the body, they may be itchy, dry and scaly. It is explained by increased vali which is followed by Aẕal. Among the s",
          property: [
            {
              code: "system-type",
              valueString: "siddha"
            },
            {
              code: "confidence",
              valueDecimal: 0.8827083110809326
            },
            {
              code: "tm2-mapping",
              valueCoding: {
                system: "http://id.who.int/icd/release/11/tm2",
                code: "SN9Z",
                display: "Skin, nail and hair disorders (TM2), unspecified"
              }
            }
          ]
        },
        {
          code: "AAD-1.2",
          display: "vyAnAvRutaprANavAtaH",
          definition: "the disorder is characterized by svēdōऽtyartham [excessive sweating], lōmaharṣaḥ [horripilation], tvagdōṣaḥ [skin diseases], suptagātratā [numbness in the body parts]",
          property: [
            {
              code: "system-type",
              valueString: "ayurveda"
            },
            {
              code: "confidence",
              valueDecimal: 0.6655468940734863
            },
            {
              code: "tm2-mapping",
              valueCoding: {
                system: "http://id.who.int/icd/release/11/tm2",
                code: "SN9Z",
                display: "Skin, nail and hair disorders (TM2), unspecified"
              }
            }
          ]
        }
      ],
      lookup: {
        system: "http://terminology.hl7.org.in/CodeSystem/namaste",
        code: "SN9Z",
        display: "Amrāḍ Ẓāhira",
        property: [
          {
            code: "total-matches",
            valueInteger: 3
          },
          {
            code: "primary-system",
            valueString: "unani"
          },
          {
            code: "highest-confidence",
            valueDecimal: 0.9089845418930054
          }
        ]
      }
    }
  },
  {
    id: 'symptoms',
    userInput: 'Code: SR1L',
    systemOutput: {
      input_type: "code_lookup",
      input_value: "SR1L",
      total_matches: 3,
      systems_found: ["unani", "siddha", "ayurveda"],
      matches: [
        {
          system_type: "unani",
          system_name: "Unani Medicine",
          codes: [
            {
              namaste_code: "F-112",
              display_name: "Tashaḥḥum-i-Kabid Ghayr Khamrī",
              description: "Non-Alcoholic Fatty Liver Disease A condition in which excess fat builds up in the liver. It is not associated with heavy intake of alcohol and is caused by cold and moist morbid temperament of liver associated with accumulation of phlegm in liver. It is characterised by heaviness and pain at the site of liver, nausea, loss of appetite, etc.",
              confidence_score: 0.8589949011802673,
              tm2_mapping: {
                code: "SR1L",
                display: "Decrease of Aiyam pattern (TM2)",
                definition: "It is characterised by giddiness, weakness of joints due to the loss of synovial fluid, and the apparent projection of the bones, diminution of phlegm in the chest, there will be feeling of emptiness inside the lung field, sweating of hair follicles and palpitations. \nThis may be explained by disequilibrium or the morbid decrease of Aiyam and consequent physiological and pathological ramifications.",
                category: "Pattern",
                icd_link: "https://icd.who.int/browse/2025-01/mms/en#1600352288"
              }
            }
          ]
        },
        {
          system_type: "siddha",
          system_name: "Siddha Medicine",
          codes: [
            {
              namaste_code: "RHC1.1",
              display_name: "Nīr Maṇṭai Kaṉappu",
              description: "Heaviness of the head due increasing Aiyam It is characterized by heaviness in head associated with hair loss, head ache. It is explained by increased aiyam. Among the seven Uṭaṟtātukkaḷ Cāram and Cennīr gets affected.",
              confidence_score: 0.874448299407959,
              tm2_mapping: {
                code: "SR1L",
                display: "Decrease of Aiyam pattern (TM2)",
                definition: "It is characterised by giddiness, weakness of joints due to the loss of synovial fluid, and the apparent projection of the bones, diminution of phlegm in the chest, there will be feeling of emptiness inside the lung field, sweating of hair follicles and palpitations. \nThis may be explained by disequilibrium or the morbid decrease of Aiyam and consequent physiological and pathological ramifications.",
                category: "Pattern",
                icd_link: "https://icd.who.int/browse/2025-01/mms/en#1600352288"
              }
            }
          ]
        },
        {
          system_type: "ayurveda",
          system_name: "Ayurveda",
          codes: [
            {
              namaste_code: "SR46(BC-1)",
              display_name: "mAMsakShayaH",
              description: "It is characterized by wasting of hips, wasting of neck, wasting of abdomen, wasting of cheeks, whole side of the face including the temple, wasting, dryness of lips, wasting, dryness of genitals, penis, wasting of thighs, wasting of chest, wasting of armpits, axilla, wasting of calf, dryness, pricking pain, exhaustion or tiredness of body, flabbiness of arteries, lazy eyes, eye fatigue, splitting type of pain in joints and weakness of five vital senses. (a) This may be explained by morbid decrease of muscle tissue.",
              confidence_score: 0.7111557126045227,
              tm2_mapping: {
                code: "SR1L",
                display: "Decrease of Aiyam pattern (TM2)",
                definition: "It is characterised by giddiness, weakness of joints due to the loss of synovial fluid, and the apparent projection of the bones, diminution of phlegm in the chest, there will be feeling of emptiness inside the lung field, sweating of hair follicles and palpitations. \nThis may be explained by disequilibrium or the morbid decrease of Aiyam and consequent physiological and pathological ramifications.",
                category: "Pattern",
                icd_link: "https://icd.who.int/browse/2025-01/mms/en#1600352288"
              }
            }
          ]
        }
      ],
      cross_system_analysis: {
        highest_confidence: 0.874448299407959,
        systems_with_mappings: 3,
        primary_categories: ["Decrease", "Decrease", "Decrease"]
      }
    },
    fhirOutput: {
      resourceType: "CodeSystem",
      id: "lookup-result-SR1L",
      url: "http://terminology.hl7.org.in/CodeSystem/namaste",
      status: "active",
      content: "complete",
      count: 3,
      concept: [
        {
          code: "F-112",
          display: "Tashaḥḥum-i-Kabid Ghayr Khamrī",
          definition: "Non-Alcoholic Fatty Liver Disease A condition in which excess fat builds up in the liver. It is not associated with heavy intake of alcohol and is caused by cold and moist morbid temperament of liver associated with accumulation of phlegm in liver. It is characterised by heaviness and pain at the site of liver, nausea, loss of appetite, etc.",
          property: [
            {
              code: "system-type",
              valueString: "unani"
            },
            {
              code: "confidence",
              valueDecimal: 0.8589949011802673
            },
            {
              code: "tm2-mapping",
              valueCoding: {
                system: "http://id.who.int/icd/release/11/tm2",
                code: "SR1L",
                display: "Decrease of Aiyam pattern (TM2)"
              }
            }
          ]
        },
        {
          code: "RHC1.1",
          display: "Nīr Maṇṭai Kaṉappu",
          definition: "Heaviness of the head due increasing Aiyam It is characterized by heaviness in head associated with hair loss, head ache. It is explained by increased aiyam. Among the seven Uṭaṟtātukkaḷ Cāram and Cennīr gets affected.",
          property: [
            {
              code: "system-type",
              valueString: "siddha"
            },
            {
              code: "confidence",
              valueDecimal: 0.874448299407959
            },
            {
              code: "tm2-mapping",
              valueCoding: {
                system: "http://id.who.int/icd/release/11/tm2",
                code: "SR1L",
                display: "Decrease of Aiyam pattern (TM2)"
              }
            }
          ]
        },
        {
          code: "SR46(BC-1)",
          display: "mAMsakShayaH",
          definition: "It is characterized by wasting of hips, wasting of neck, wasting of abdomen, wasting of cheeks, whole side of the face including the temple, wasting, dryness of lips, wasting, dryness of genitals, penis, wasting of thighs, wasting of chest, wasting of armpits, axilla, wasting of calf, dryness, pricking pain, exhaustion or tiredness of body, flabbiness of arteries, lazy eyes, eye fatigue, splitting type of pain in joints and weakness of five vital senses. (a) This may be explained by morbid decrease of muscle tissue.",
          property: [
            {
              code: "system-type",
              valueString: "ayurveda"
            },
            {
              code: "confidence",
              valueDecimal: 0.7111557126045227
            },
            {
              code: "tm2-mapping",
              valueCoding: {
                system: "http://id.who.int/icd/release/11/tm2",
                code: "SR1L",
                display: "Decrease of Aiyam pattern (TM2)"
              }
            }
          ]
        }
      ],
      lookup: {
        system: "http://terminology.hl7.org.in/CodeSystem/namaste",
        code: "SR1L",
        display: "Tashaḥḥum-i-Kabid Ghayr Khamrī",
        property: [
          {
            code: "total-matches",
            valueInteger: 3
          },
          {
            code: "primary-system",
            valueString: "unani"
          },
          {
            code: "highest-confidence",
            valueDecimal: 0.874448299407959
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