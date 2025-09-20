// app/TryNow/types/index.ts

export interface SystemMatch {
    code: string;
    display: string;
    description: string;
    confidenceScore: number;
    system: string;
  }
  
  export interface TM2Group {
    id: string;
    tm2Code: string;
    tm2Display: string;
    tm2Definition: string;
    tm2Link: string;
    ayurvedaMatch?: SystemMatch;
    siddhaMatch?: SystemMatch;
    unaniMatch?: SystemMatch;
    averageConfidence: number;
  }
  
  export interface ApiResponse {
    parameter: Array<{
      name: string;
      valueInteger?: number;
      valueString?: string;
      part?: Array<{
        name: string;
        valueUri?: string;
        valueCode?: string;
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
  
  export type ViewState = 'search' | 'overview' | 'detail';
  
  export type SearchMode = 'code' | 'symptoms';
  
  export interface SystemOutput {
    input_type: string;
    input_value: string | string[];
    total_matches: number;
    systems_found: string[];
    matches: Array<{
      system_type: string;
      system_name: string;
      codes: Array<{
        code: string;
        display_name: string;
        description: string;
        confidence_score: number;
        tm2_mapping?: {
          code: string;
          display: string;
          definition: string;
          category: string;
          icd_link: string;
        } | null;
      }>;
    }>;
    cross_system_analysis: {
      highest_confidence: number;
      systems_with_mappings: number;
      primary_categories: string[];
    };
  }