// app/TryNow/components/LiveDemoAutoplay.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import SearchFilter from './SearchFilter';
import SearchResultsOverview from './SearchResults/SearchResultsOverview';
import ResultsDetail from './SearchResults/ResultsDetail';

interface SystemMatch {
  code: string;
  display: string;
  description: string;
  confidenceScore: number;
  system: string;
}

interface TM2Group {
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

interface ApiResponse {
  parameter: Array<{
    name: string;
    valueInteger?: number;
    valueString?: string;
    valueBoolean?: boolean;
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

type ViewState = 'search' | 'overview' | 'detail';

export default function LiveDemoAutoplay() {
  const [searchMode, setSearchMode] = useState<'code' | 'symptoms'>('code');
  const [inputValue, setInputValue] = useState('');
  const [symptomTags, setSymptomTags] = useState<string[]>([]);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('search');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [tm2Groups, setTM2Groups] = useState<TM2Group[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);

  // Helper function to validate API response
  const isValidApiResponse = (data: any): data is ApiResponse => {
    return data && 
           Array.isArray(data.parameter) && 
           data.parameter.length > 0;
  };

  // Parse API response and group by TM2 codes
  const parseApiResponseToGroups = (response: ApiResponse): TM2Group[] => {
    const tm2Map = new Map<string, TM2Group>();
    
    response.parameter.forEach(param => {
      // Handle new symptom-based search format with diseaseGroup
      if (param.name === 'diseaseGroup' && param.part) {
        let tm2Code = '';
        let tm2Display = '';
        let tm2Definition = '';
        let tm2Link = '';
        let symptomSimilarityScore = 0;
        const traditionalMappings: any[] = [];
        
        // Extract TM2 disease info and traditional medicine mappings
        param.part.forEach(part => {
          if (part.name === 'tm2Disease' && part.part) {
            tm2Code = part.part.find(p => p.name === 'code')?.valueCode || '';
            tm2Display = part.part.find(p => p.name === 'display')?.valueString || '';
            tm2Definition = part.part.find(p => p.name === 'definition')?.valueString || '';
            tm2Link = part.part.find(p => p.name === 'system')?.valueUri || '';
          } else if (part.name === 'symptomSimilarityScore') {
            symptomSimilarityScore = part.valueDecimal || 0;
          } else if (part.name === 'traditionalMedicineMapping' && part.part) {
            traditionalMappings.push(part);
          }
        });
        
        if (tm2Code) {
          const groupId = tm2Code;
          
          if (!tm2Map.has(groupId)) {
            tm2Map.set(groupId, {
              id: groupId,
              tm2Code,
              tm2Display,
              tm2Definition,
              tm2Link,
              averageConfidence: 0
            });
          }
          
          const group = tm2Map.get(groupId)!;
          
          // Process traditional medicine mappings
          traditionalMappings.forEach(mapping => {
            let code = '';
            let display = '';
            let description = '';
            let confidenceScore = 0;
            let systemType = '';
            
            mapping.part?.forEach((mappingPart: any) => {
              if (mappingPart.name === 'code' && mappingPart.part) {
                code = mappingPart.part.find((p: any) => p.name === 'code')?.valueCode || '';
                display = mappingPart.part.find((p: any) => p.name === 'display')?.valueString || '';
              } else if (mappingPart.name === 'type') {
                systemType = mappingPart.valueString || '';
              } else if (mappingPart.name === 'description') {
                description = mappingPart.valueString || '';
              } else if (mappingPart.name === 'mappingConfidenceScore') {
                confidenceScore = mappingPart.valueDecimal || 0;
              }
            });
            
            if (code && systemType) {
              const systemMatch: SystemMatch = {
                code,
                display,
                description,
                confidenceScore,
                system: systemType
              };
              
              // Assign to appropriate system (normalize system names)
              const normalizedSystem = systemType.toLowerCase();
              if (normalizedSystem === 'namaste' || normalizedSystem === 'ayurveda') {
                group.ayurvedaMatch = systemMatch;
              } else if (normalizedSystem === 'siddha') {
                group.siddhaMatch = systemMatch;
              } else if (normalizedSystem === 'unani') {
                group.unaniMatch = systemMatch;
              }
            }
          });
        }
      }
      // Handle legacy code-based search format with match
      else if (param.name === 'match' && param.part) {
        let code = '';
        let display = '';
        let description = '';
        let confidenceScore = 0;
        let systemType = '';
        let tm2Code = '';
        let tm2Display = '';
        let tm2Definition = '';
        let tm2Link = '';
        
        param.part.forEach(part => {
          if (part.name === 'code' && part.part) {
            code = part.part.find(p => p.name === 'code')?.valueCode || '';
            display = part.part.find(p => p.name === 'display')?.valueString || '';
          } else if (part.name === 'type') {
            systemType = part.valueString || '';
          } else if (part.name === 'description') {
            description = part.valueString || '';
          } else if (part.name === 'symptomSimilarityScore') {
            confidenceScore = part.valueDecimal || 0;
          } else if (part.name === 'tm2Mapping' && part.part) {
            tm2Code = part.part.find(p => p.name === 'code')?.valueCode || '';
            tm2Display = part.part.find(p => p.name === 'display')?.valueString || '';
            tm2Definition = part.part.find(p => p.name === 'definition')?.valueString || '';
            tm2Link = part.part.find(p => p.name === 'link')?.valueUri || '';
          }
        });
        
        if (tm2Code && code && systemType) {
          const groupId = tm2Code;
          
          if (!tm2Map.has(groupId)) {
            tm2Map.set(groupId, {
              id: groupId,
              tm2Code,
              tm2Display,
              tm2Definition,
              tm2Link,
              averageConfidence: 0
            });
          }
          
          const group = tm2Map.get(groupId)!;
          const systemMatch: SystemMatch = {
            code,
            display,
            description,
            confidenceScore,
            system: systemType
          };
          
          // Assign to appropriate system (normalize system names)
          const normalizedSystem = systemType.toLowerCase();
          if (normalizedSystem === 'namaste' || normalizedSystem === 'ayurveda') {
            group.ayurvedaMatch = systemMatch;
          } else if (normalizedSystem === 'siddha') {
            group.siddhaMatch = systemMatch;
          } else if (normalizedSystem === 'unani') {
            group.unaniMatch = systemMatch;
          }
        }
      }
    });
    
    // Calculate average confidence for each group
    const groups = Array.from(tm2Map.values()).map(group => {
      const matches = [group.ayurvedaMatch, group.siddhaMatch, group.unaniMatch].filter(Boolean);
      const avgConfidence = matches.reduce((sum, match) => sum + match!.confidenceScore, 0) / matches.length;
      return { ...group, averageConfidence: avgConfidence };
    });
    
    return groups;
  };

  const generateFhirOutput = (selectedGroup: TM2Group) => {
    const systemMatches = [
      selectedGroup.ayurvedaMatch,
      selectedGroup.siddhaMatch,
      selectedGroup.unaniMatch
    ].filter(Boolean) as SystemMatch[];

    return {
      resourceType: "CodeSystem",
      id: `lookup-result-${selectedGroup.id}`,
      url: "http://terminology.hl7.org.in/CodeSystem/Ayurveda",
      status: "active",
      content: "complete",
      count: systemMatches.length,
      searchMode: searchMode,
      searchCriteria: searchMode === 'code' ? inputValue : symptomTags,
      tm2Category: {
        code: selectedGroup.tm2Code,
        display: selectedGroup.tm2Display,
        definition: selectedGroup.tm2Definition,
        link: selectedGroup.tm2Link
      },
      concept: systemMatches.map(match => ({
        code: match.code,
        display: match.display,
        definition: match.description,
        property: [
          {
            code: "system-type",
            valueString: match.system
          },
          {
            code: "confidence",
            valueDecimal: match.confidenceScore
          },
          {
            code: "tm2-mapping",
            valueCoding: {
              system: "http://id.who.int/icd/release/11/tm2",
              code: selectedGroup.tm2Code,
              display: selectedGroup.tm2Display
            }
          }
        ]
      })),
      lookup: {
        system: "http://terminology.hl7.org.in/CodeSystem/namaste",
        code: searchMode === 'code' ? inputValue : 'symptom-based',
        display: selectedGroup.tm2Display,
        property: [
          {
            code: "total-matches",
            valueInteger: systemMatches.length
          },
          {
            code: "tm2-category",
            valueString: selectedGroup.tm2Code
          },
          {
            code: "average-confidence",
            valueDecimal: selectedGroup.averageConfidence
          },
          {
            code: "search-type",
            valueString: searchMode
          }
        ]
      }
    };
  };

  const handleSearch = async () => {
    const canSearch = searchMode === 'code' ? inputValue.trim() : symptomTags.length > 0;
    if (!canSearch) return;
    
    setIsLoading(true);
    setError(null);
    setCurrentView('search');
    
    try {
      let response;
      
      if (searchMode === 'code') {
        // Code search endpoint using path parameter
        const apiUrl = `https://aneesh2-me3un.ondigitalocean.app/api/fhir/search/code/${encodeURIComponent(inputValue.trim())}`;
        response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
      } else {
        const symptomsQuery = symptomTags.join(', ');
        const apiUrl = `https://aneesh2-me3un.ondigitalocean.app/api/fhir/search/symptoms?query=${encodeURIComponent(symptomsQuery)}`;
        response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
      }
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate API response structure
      if (!isValidApiResponse(data)) {
        throw new Error('Invalid response format from API');
      }
      
      // Check if the API returned an error or no results
      const resultParam = data.parameter?.find(p => p.name === 'result');
      const errorParam = data.parameter?.find(p => p.name === 'error');
      const messageParam = data.parameter?.find(p => p.name === 'message');
      
      // For symptom-based searches (new format)
      const totalDiseaseGroupsParam = data.parameter?.find(p => p.name === 'totalDiseaseGroups');
      const diseaseGroupParams = data.parameter?.filter(p => p.name === 'diseaseGroup') || [];
      
      // For code-based searches (legacy format)
      const resultCountParam = data.parameter?.find(p => p.name === 'resultCount');
      const totalMatchesParam = data.parameter?.find(p => p.name === 'totalMatches');
      const matchParams = data.parameter?.filter(p => p.name === 'match') || [];
      
      // Handle API errors
      if (resultParam?.valueBoolean === false) {
        // Handle "too many results" error for symptom searches
        if (errorParam?.valueString === 'Too many results') {
          const count = resultCountParam?.valueInteger || 0;
          const message = messageParam?.valueString || `Too many results found (${count}). Please add more specific symptoms to narrow down your search.`;
          throw new Error(message);
        }
        // Handle other errors
        const message = messageParam?.valueString || errorParam?.valueString || 'Search failed. Please try again.';
        throw new Error(message);
      }
      
      // Parse groups to double-check if we have valid matches
      const groups = parseApiResponseToGroups(data);
      
      // Check for no matches based on search type
      let hasResults = false;
      let totalCount = 0;
      
      if (searchMode === 'symptoms') {
        // Use new format parameters for symptom search
        totalCount = totalDiseaseGroupsParam?.valueInteger || 0;
        hasResults = diseaseGroupParams.length > 0 && groups.length > 0;
      } else {
        // Use legacy format parameters for code search
        totalCount = totalMatchesParam?.valueInteger || matchParams.length;
        hasResults = matchParams.length > 0 && groups.length > 0;
      }
      
      // Multiple conditions to catch "no matches" scenarios
      if (
        // Explicit no matches from API
        (resultParam?.valueBoolean === true && totalCount === 0) ||
        // No valid groups after parsing
        !hasResults ||
        groups.length === 0
      ) {
        const searchTerm = searchMode === 'code' ? `code: "${inputValue.trim()}"` : `symptoms: "${symptomTags.join(', ')}"`;
        throw new Error(`No matches found for ${searchTerm}. Please try a different search term or check your spelling.`);
      }
      
      // If we get here, we should have valid results
      setApiResponse(data);
      setTotalMatches(totalCount || groups.length);
      setTM2Groups(groups);
      setCurrentView('overview');
      
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setApiResponse(null);
      setTM2Groups([]);
      setTotalMatches(0);
      // Stay on search view to show the error
      setCurrentView('search');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (groupId: string) => {
    setSelectedGroupId(groupId);
    setCurrentView('detail');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedGroupId(null);
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSelectedGroupId(null);
  };

  const selectedGroup = selectedGroupId ? tm2Groups.find(g => g.id === selectedGroupId) : null;
  const fhirOutput = selectedGroup ? generateFhirOutput(selectedGroup) : null;

  return (
    <div className="py-8 bg-gradient-to-br from-slate-50/50 to-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="w-full bg-white/90 backdrop-blur-xl rounded-lg border border-white/60 shadow-2xl">
          <motion.div
            className="relative p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Background glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-100/20 via-white/40 to-teal-100/20 rounded-xl blur-xl" />
            <div className="relative">
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div className="flex items-center justify-center space-x-1.5 mb-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-700">Try Now</span>
                </motion.div>
                
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  AYUSH Code Lookup
                </h2>
                <p className="text-sm text-slate-600">
                  Multi-system terminology mapping for traditional medicine
                </p>
              </div>

              {/* Loading Animation */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    className="flex flex-col items-center justify-center py-12 space-y-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    <p className="text-sm text-slate-600">
                      {searchMode === 'code' ? 'Searching code database...' : 'Analyzing symptoms...'}
                    </p>
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((index) => (
                        <motion.div
                          key={index}
                          className="w-2 h-2 bg-emerald-500 rounded-full"
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

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="flex items-center justify-center py-6 px-6 bg-red-50 border border-red-200 rounded-lg mb-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <span className="text-sm text-red-700">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dynamic Content Based on View State */}
              <AnimatePresence mode="wait">
                {currentView === 'search' && !isLoading && (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SearchFilter
                      searchMode={searchMode}
                      setSearchMode={setSearchMode}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      symptomTags={symptomTags}
                      setSymptomTags={setSymptomTags}
                      onSearch={handleSearch}
                      isLoading={isLoading}
                    />
                  </motion.div>
                )}

                {currentView === 'overview' && tm2Groups.length > 0 && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SearchResultsOverview
                      groups={tm2Groups}
                      searchMode={searchMode}
                      searchQuery={searchMode === 'code' ? inputValue : symptomTags}
                      onCardClick={handleCardClick}
                      onBackToSearch={handleBackToSearch}
                      totalMatches={totalMatches}
                    />
                  </motion.div>
                )}

                {currentView === 'detail' && selectedGroup && (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ResultsDetail
                      group={selectedGroup}
                      searchMode={searchMode}
                      onBack={handleBackToOverview}
                      fhirOutput={fhirOutput}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}