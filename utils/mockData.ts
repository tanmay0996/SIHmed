// utils/mockData.ts

export interface ApiResponse {
    resourceType: string;
    id: string;
    parameter: Array<{
      name: string;
      valueBoolean?: boolean;
      valueInteger?: number;
      part?: Array<{
        name: string;
        valueString?: string;
        valueDecimal?: number;
        part?: Array<{
          name: string;
          valueUri?: string;
          valueCode?: string;
          valueString?: string;
        }>;
      }>;
    }>;
  }
  
  const mockResponses: Record<string, ApiResponse> = {
    'EJC': {
      "resourceType": "Parameters",
      "id": "search-by-code-result-EJC",
      "parameter": [
        {
          "name": "result",
          "valueBoolean": true
        },
        {
          "name": "totalMatches",
          "valueInteger": 2
        },
        {
          "name": "match",
          "part": [
            {
              "name": "code",
              "part": [
                {
                  "name": "system",
                  "valueUri": "http://terminology.hl7.org.in/CodeSystem/Ayurveda"
                },
                {
                  "name": "code",
                  "valueCode": "H"
                },
                {
                  "name": "display",
                  "valueString": "Amrāḍ-i-Tānāsul"
                }
              ]
            },
            {
              "name": "type",
              "valueString": "unani"
            },
            {
              "name": "tm2Mapping",
              "part": [
                {
                  "name": "system",
                  "valueUri": "http://id.who.int/icd/release/11/tm2"
                },
                {
                  "name": "code",
                  "valueCode": "SN6Y"
                },
                {
                  "name": "display",
                  "valueString": "Other specified nail disorders (TM2)"
                },
                {
                  "name": "definition",
                  "valueString": "This category is an 'other specified' residual category"
                },
                {
                  "name": "link",
                  "valueUri": "https://icd.who.int/browse/2025-01/mms/en#1780130598/other"
                }
              ]
            },
            {
              "name": "description",
              "valueString": "Genital Disorders"
            },
            {
              "name": "confidenceScore",
              "valueDecimal": 0.7560642957687378
            }
          ]
        },
        {
          "name": "match",
          "part": [
            {
              "name": "code",
              "part": [
                {
                  "name": "system",
                  "valueUri": "http://terminology.hl7.org.in/CodeSystem/Ayurveda"
                },
                {
                  "name": "code",
                  "valueCode": "NDB1.18"
                },
                {
                  "name": "display",
                  "valueString": "Utira Kuntam"
                }
              ]
            },
            {
              "name": "type",
              "valueString": "siddha"
            },
            {
              "name": "tm2Mapping",
              "part": [
                {
                  "name": "system",
                  "valueUri": "http://id.who.int/icd/release/11/tm2"
                },
                {
                  "name": "code",
                  "valueCode": "SN6Y"
                },
                {
                  "name": "display",
                  "valueString": "Other specified nail disorders (TM2)"
                },
                {
                  "name": "definition",
                  "valueString": "This category is an 'other specified' residual category"
                },
                {
                  "name": "link",
                  "valueUri": "https://icd.who.int/browse/2025-01/mms/en#1780130598/other"
                }
              ]
            },
            {
              "name": "description",
              "valueString": "Corneal eye disease with mild haematoma It is characterised by mild haematoma, photophobia, lacrimation, pus discharge, dull vision and itching in eyes. It is explained by increased vali (nagan and koorman), Aẕal( aalosaga Aẕal) and iyam (tharpagam). Among the seven udalthathukkal saram, senee"
            },
            {
              "name": "confidenceScore",
              "valueDecimal": 0.7624737024307251
            }
          ]
        }
      ]
    },
    'SN4T': {
      "resourceType": "Parameters",
      "id": "search-by-code-result-SN4T",
      "parameter": [
        {
          "name": "result",
          "valueBoolean": true
        },
        {
          "name": "totalMatches",
          "valueInteger": 3
        },
        {
          "name": "match",
          "part": [
            {
              "name": "code",
              "part": [
                {
                  "name": "system",
                  "valueUri": "http://terminology.hl7.org.in/CodeSystem/Ayurveda"
                },
                {
                  "name": "code",
                  "valueCode": "M-18.3"
                },
                {
                  "name": "display",
                  "valueString": "Namla Shafawiyya"
                }
              ]
            },
            {
              "name": "type",
              "valueString": "unani"
            },
            {
              "name": "tm2Mapping",
              "part": [
                {
                  "name": "system",
                  "valueUri": "http://id.who.int/icd/release/11/tm2"
                },
                {
                  "name": "code",
                  "valueCode": "SN4T"
                },
                {
                  "name": "display",
                  "valueString": "Herpes disorder (TM2)"
                },
                {
                  "name": "definition",
                  "valueString": "It is characterised by spreading, superficial clusters of small vesicular eruptions on the skin, sensation of ant-bite, itching, burning.\nThis may be explained by:\n(a) Vitiation of pittadosha, vatadosha.\n(b) increased Vaḷi and Kīẕṉōkku kāl affecting the physical constituents Uṭaṟtātukkaḷ Cāram, Cennīr, Ūṉ.\n(c) It is caused by predominance of Ṣafrā' mixed with Dam."
                },
                {
                  "name": "link",
                  "valueUri": "https://icd.who.int/browse/2025-01/mms/en#2105615533"
                }
              ]
            },
            {
              "name": "description",
              "valueString": "Herpes labialis When the red papules appear on the lips, crusting appears with in 6-8 days and they finally disappear."
            },
            {
              "name": "confidenceScore",
              "valueDecimal": 0.8669520616531372
            }
          ]
        },
        {
          "name": "match",
          "part": [
            {
              "name": "code",
              "part": [
                {
                  "name": "system",
                  "valueUri": "http://terminology.hl7.org.in/CodeSystem/Ayurveda"
                },
                {
                  "name": "code",
                  "valueCode": "SH-2"
                },
                {
                  "name": "display",
                  "valueString": "virecanAyoga"
                }
              ]
            },
            {
              "name": "type",
              "valueString": "Ayurveda Medicine"
            },
            {
              "name": "tm2Mapping",
              "part": [
                {
                  "name": "system",
                  "valueUri": "http://id.who.int/icd/release/11/tm2"
                },
                {
                  "name": "code",
                  "valueCode": "SN4T"
                },
                {
                  "name": "display",
                  "valueString": "Herpes disorder (TM2)"
                },
                {
                  "name": "definition",
                  "valueString": "It is characterised by spreading, superficial clusters of small vesicular eruptions on the skin, sensation of ant-bite, itching, burning.\nThis may be explained by:\n(a) Vitiation of pittadosha, vatadosha.\n(b) increased Vaḷi and Kīẕṉōkku kāl affecting the physical constituents Uṭaṟtātukkaḷ Cāram, Cennīr, Ūṉ.\n(c) It is caused by predominance of Ṣafrā' mixed with Dam."
                },
                {
                  "name": "link",
                  "valueUri": "https://icd.who.int/browse/2025-01/mms/en#2105615533"
                }
              ]
            },
            {
              "name": "description",
              "valueString": "the disorder is characterized by ṣṭhīvanam/prasēkaḥ [Spitting/excess expectoration], hr̥dayāśuddhiḥ/hr̥t-aśuddhiḥ [precordial discomfort with nausea], kukṣi-aśuddhiḥ [feeling of fullness of abdomen], utklēśaḥ ślēṣmapittayōḥ / kaphapittōtklēśaḥ [aggravation of kapha and pitta], ślēṣmapittānilasamprakōpaḥ [aggravation of kapha and pitta], ādhmānam [abdominal distension], jaṅghāsadanam [asthenia/ fatigue of calf muscles], ūrusadanam [fatigue / weakness in thighs], aruciḥ/arōcakaḥ [tastelessness], chardiḥ [vomiting], adaurbalyam [not feeling weakness], alāghavam [not feeling lightness in body], tandrā [drowsiness/lassitude], staimityam [a sensation of being covered with wet clothes], pīnasāgamaḥ [cold, catarrh], mārutasya ca nigrahaḥ/vātasaṅgaḥ/vātagrahaḥ [supression of vāyu], agnisādaḥ [diminution of agni (digestive power)], gurugātratā/gauravam [heaviness of the body], pratiśyāyaḥ [cold, catarrh], na vātānulōmyam [vayu not having normal movement], paridāhaḥ/vidāhaḥ [severe burning sensation], kaṇḍūḥ [itching], viṭsaṅgaḥ/viṭgrahaḥ [retension of faeces], mutrasaṅgaḥ [obstruction/retention in passage of urine], bhramaḥ [giddiness or dizziness], piṭakā/piṭikā [papules]"
            },
            {
              "name": "confidenceScore",
              "valueDecimal": 0.97546124458313
            }
          ]
        },
        {
          "name": "match",
          "part": [
            {
              "name": "code",
              "part": [
                {
                  "name": "system",
                  "valueUri": "http://terminology.hl7.org.in/CodeSystem/Ayurveda"
                },
                {
                  "name": "code",
                  "valueCode": "JDC1.1"
                },
                {
                  "name": "display",
                  "valueString": "Kapa Uḷaimāntai"
                }
              ]
            },
            {
              "name": "type",
              "valueString": "siddha"
            },
            {
              "name": "tm2Mapping",
              "part": [
                {
                  "name": "system",
                  "valueUri": "http://id.who.int/icd/release/11/tm2"
                },
                {
                  "name": "code",
                  "valueCode": "SN4T"
                },
                {
                  "name": "display",
                  "valueString": "Herpes disorder (TM2)"
                },
                {
                  "name": "definition",
                  "valueString": "It is characterised by spreading, superficial clusters of small vesicular eruptions on the skin, sensation of ant-bite, itching, burning.\nThis may be explained by:\n(a) Vitiation of pittadosha, vatadosha.\n(b) increased Vaḷi and Kīẕṉōkku kāl affecting the physical constituents Uṭaṟtātukkaḷ Cāram, Cennīr, Ūṉ.\n(c) It is caused by predominance of Ṣafrā' mixed with Dam."
                },
                {
                  "name": "link",
                  "valueUri": "https://icd.who.int/browse/2025-01/mms/en#2105615533"
                }
              ]
            },
            {
              "name": "description",
              "valueString": "Intestinal tuberculosis caused by increased aiyam It is characterised by vomiting, vomitus with pus, emaciaition, giddiness, mild fever, ulcers and pallor. It is explained by the aggravtion of aiyam associated with Aẕal. Among the seven Uṭaṟtātukkaḷ Cāram,Cennīr,Ūṉ, Koẕuppu, Eṉpu, moola iand sukkilam g"
            },
            {
              "name": "confidenceScore",
              "valueDecimal": 0.7986666560173035
            }
          ]
        }
      ]
    }
  };
  
  const defaultNotFoundResponse: ApiResponse = {
    "resourceType": "Parameters",
    "id": "search-by-code-result-notfound",
    "parameter": [
      {
        "name": "result",
        "valueBoolean": false
      },
      {
        "name": "totalMatches",
        "valueInteger": 0
      }
    ]
  };
  
  export const getMockData = (code: string): ApiResponse => {
    return mockResponses[code.toUpperCase()] || defaultNotFoundResponse;
  };
  
  export const getAvailableMockCodes = (): string[] => {
    return Object.keys(mockResponses);
  };