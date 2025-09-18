"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { getMockData, ApiResponse } from '@/utils/mockData'; // Adjust path as needed

interface Match {
  code: {
    system: string;
    code: string;
    display: string;
  };
  type: string;
  tm2Mapping?: {
    system: string;
    code: string;
    display: string;
    definition: string;
    link: string;
  };
  description?: string;
  confidenceScore: number;
}

export default function LiveDemoAutoplay() {
  const [inputValue, setInputValue] = useState('');
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseApiResponse = (response: ApiResponse) => {
    const matches: Match[] = [];
    
    response.parameter.forEach(param => {
      if (param.name === 'match' && param.part) {
        const match: Partial<Match> = {};
        
        param.part.forEach(part => {
          if (part.name === 'code' && part.part) {
            match.code = {
              system: part.part.find(p => p.name === 'system')?.valueUri || '',
              code: part.part.find(p => p.name === 'code')?.valueCode || '',
              display: part.part.find(p => p.name === 'display')?.valueString || ''
            };
          } else if (part.name === 'type') {
            match.type = part.valueString || '';
          } else if (part.name === 'tm2Mapping' && part.part) {
            match.tm2Mapping = {
              system: part.part.find(p => p.name === 'system')?.valueUri || '',
              code: part.part.find(p => p.name === 'code')?.valueCode || '',
              display: part.part.find(p => p.name === 'display')?.valueString || '',
              definition: part.part.find(p => p.name === 'definition')?.valueString || '',
              link: part.part.find(p => p.name === 'link')?.valueUri || ''
            };
          } else if (part.name === 'description') {
            match.description = part.valueString;
          } else if (part.name === 'confidenceScore') {
            match.confidenceScore = part.valueDecimal || 0;
          }
        });
        
        if (match.code && match.type !== undefined && match.confidenceScore !== undefined) {
          matches.push(match as Match);
        }
      }
    });
    
    return matches;
  };

  const generateSystemOutput = (matches: Match[]) => {
    // Group matches by system type
    const groupedMatches = matches.reduce((acc, match) => {
      if (!acc[match.type]) {
        acc[match.type] = [];
      }
      acc[match.type].push(match);
      return acc;
    }, {} as Record<string, Match[]>);

    return {
      input_type: "code_lookup",
      input_value: inputValue,
      total_matches: matches.length,
      systems_found: Object.keys(groupedMatches),
      matches: Object.entries(groupedMatches).map(([systemType, systemMatches]) => ({
        system_type: systemType,
        system_name: systemType === 'siddha' ? 'Siddha Medicine' : 
                     systemType === 'ayurveda' ? 'Ayurveda' :
                     systemType === 'unani' ? 'Unani Medicine' :
                     systemType === 'homeopathy' ? 'Homeopathy' : systemType,
        codes: systemMatches.map(match => ({
          Ayurveda_code: match.code.code,
          display_name: match.code.display,
          description: match.description || `${systemType} medicine classification`,
          confidence_score: Math.round(match.confidenceScore * 100) / 100,
          tm2_mapping: match.tm2Mapping ? {
            code: match.tm2Mapping.code,
            display: match.tm2Mapping.display,
            definition: match.tm2Mapping.definition,
            category: match.tm2Mapping.display.includes('Heart') ? 'Cardiovascular' :
                     match.tm2Mapping.display.includes('Head') ? 'Neurological' :
                     match.tm2Mapping.display.includes('bone') ? 'Musculoskeletal' : 
                     match.tm2Mapping.display.includes('Joint') ? 'Musculoskeletal' :
                     match.tm2Mapping.display.includes('Digestive') ? 'Gastrointestinal' : 'Other',
            icd_link: match.tm2Mapping.link
          } : null
        }))
      })),
      cross_system_analysis: {
        highest_confidence: Math.max(...matches.map(m => m.confidenceScore)),
        systems_with_mappings: matches.filter(m => m.tm2Mapping).length,
        primary_categories: [...new Set(matches.map(m => 
          m.tm2Mapping?.display.split(' ')[0] || 'Other'
        ))]
      }
    };
  };

  const generateFhirOutput = (matches: Match[]) => {
    const primaryMatch = matches.sort((a, b) => b.confidenceScore - a.confidenceScore)[0];
    
    return {
      resourceType: "CodeSystem",
      id: `lookup-result-${inputValue}`,
      url: "http://terminology.hl7.org.in/CodeSystem/Ayurveda",
      status: "active",
      content: "complete",
      count: matches.length,
      concept: matches.map(match => ({
        code: match.code.code,
        display: match.code.display,
        definition: match.description,
        property: [
          {
            code: "system-type",
            valueString: match.type
          },
          {
            code: "confidence",
            valueDecimal: match.confidenceScore
          },
          ...(match.tm2Mapping ? [
            {
              code: "tm2-mapping",
              valueCoding: {
                system: match.tm2Mapping.system,
                code: match.tm2Mapping.code,
                display: match.tm2Mapping.display
              }
            }
          ] : [])
        ]
      })),
      lookup: {
        system: primaryMatch?.code.system,
        code: inputValue,
        display: primaryMatch?.code.display,
        property: [
          {
            code: "total-matches",
            valueInteger: matches.length
          },
          {
            code: "primary-system",
            valueString: primaryMatch?.type
          },
          {
            code: "highest-confidence",
            valueDecimal: primaryMatch?.confidenceScore
          }
        ]
      }
    };
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setIsFlipped(false);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // TODO: Replace with actual API call when hosted
      // const response = await fetch(`http://localhost:8082/api/fhir/search/code/${inputValue.trim()}`);
      // if (!response.ok) {
      //   throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      // }
      // const data: ApiResponse = await response.json();
      
      // Using mock data for now
      const data: ApiResponse = getMockData(inputValue.trim());
      
      if (data.parameter.find(p => p.name === 'totalMatches')?.valueInteger === 0) {
        throw new Error(`No matches found for code: ${inputValue.trim()}`);
      }
      
      setApiResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setApiResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const matches = apiResponse ? parseApiResponse(apiResponse) : [];
  const systemOutput = matches.length > 0 ? generateSystemOutput(matches) : null;
  const fhirOutput = matches.length > 0 ? generateFhirOutput(matches) : null;

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

              {/* Search Interface */}
              <div className="flex gap-3 mb-8">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Try: EJC , SN4T, etc"
                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !inputValue.trim()}
                  className="px-6 py-3 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[100px]"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Search'}
                </button>
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
                    <p className="text-sm text-slate-600">Searching terminology database...</p>
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

              {/* Results Cards with 3D Flip Animation */}
              <AnimatePresence>
                {systemOutput && fhirOutput && !isLoading && (
                  <motion.div
                    className="relative min-h-[600px]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    style={{ perspective: '1000px' }}
                  >
                    {/* System Output Card (Front) */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br from-slate-50/80 to-white/80 rounded-lg border border-slate-200/50 backface-hidden ${isFlipped ? 'pointer-events-none' : ''}`}
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                      animate={{
                        rotateY: isFlipped ? 180 : 0
                      }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <div className="p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-slate-700">Search Results</h3>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                              {systemOutput?.total_matches || 0} matches
                            </span>
                            <button
                              onClick={() => setIsFlipped(!isFlipped)}
                              className="text-sm bg-emerald-500 text-white px-4 py-2 rounded-full font-medium hover:bg-emerald-600 transition-all duration-200 flex items-center space-x-1"
                            >
                              <span>View FHIR</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex-1 overflow-hidden">
                          <motion.div 
                            className="h-full overflow-y-auto space-y-4 pr-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            {systemOutput?.matches.map((systemMatch, idx) => (
                              <motion.div
                                key={idx}
                                className="bg-white/80 rounded-lg p-4 border border-slate-200/50 shadow-sm"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.1 }}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-base font-semibold text-slate-800 capitalize">
                                      {systemMatch.system_name}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      systemMatch.system_type === 'ayurveda' ? 'bg-orange-100 text-orange-700' :
                                      systemMatch.system_type === 'siddha' ? 'bg-purple-100 text-purple-700' :
                                      systemMatch.system_type === 'unani' ? 'bg-green-100 text-green-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {systemMatch.system_type}
                                    </span>
                                  </div>
                                  <span className="text-sm text-slate-500">
                                    {systemMatch.codes.length} code{systemMatch.codes.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                
                                <div className="space-y-3">
                                  {systemMatch.codes.map((code, codeIdx) => (
                                    <div key={codeIdx} className="bg-slate-50/80 rounded-lg p-3 border-l-4 border-emerald-400">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center space-x-3 mb-2">
                                            <span className="text-base font-mono font-bold text-slate-800">
                                              {code.Ayurveda_code}
                                            </span>
                                            <div className="flex items-center space-x-1">
                                              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                              <span className="text-sm font-medium text-emerald-700">
                                                {Math.round(code.confidence_score * 100)}%
                                              </span>
                                            </div>
                                          </div>
                                          <p className="text-sm text-slate-700 font-medium mb-2">
                                            {code.display_name}
                                          </p>
                                          <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                            {code.description}
                                          </p>
                                          {code.tm2_mapping && (
                                            <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-100">
                                              <div className="flex items-center space-x-3 mb-2">
                                                <span className="text-sm font-semibold text-blue-700">TM2:</span>
                                                <span className="text-sm font-mono text-blue-800">{code.tm2_mapping.code}</span>
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                  {code.tm2_mapping.category}
                                                </span>
                                              </div>
                                              <p className="text-sm text-blue-700">
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
                                className="bg-emerald-50/90 rounded-xl p-5 border-2 border-emerald-200/60 shadow-sm"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                              >
                                <h4 className="text-base font-semibold text-emerald-800 mb-4">Analysis Summary</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-emerald-700 font-medium">Best Match:</span>
                                    <span className="ml-2 text-emerald-800 font-semibold">
                                      {Math.round(systemOutput.cross_system_analysis.highest_confidence * 100)}%
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-emerald-700 font-medium">Systems:</span>
                                    <span className="ml-2 text-emerald-800">
                                      {systemOutput.systems_found.length}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-emerald-700 font-medium">TM2 Links:</span>
                                    <span className="ml-2 text-emerald-800">
                                      {systemOutput.cross_system_analysis.systems_with_mappings}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-emerald-700 font-medium">Categories:</span>
                                    <span className="ml-2 text-emerald-800">
                                      {systemOutput.cross_system_analysis.primary_categories.slice(0, 2).join(', ')}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>

                    {/* FHIR Output Card (Back) */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-lg border border-emerald-200/50 backface-hidden ${!isFlipped ? 'pointer-events-none' : ''}`}
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
                      <div className="p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-emerald-700">FHIR Output</h3>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                              FHIR R4
                            </span>
                            <button
                              onClick={() => setIsFlipped(!isFlipped)}
                              className="text-sm bg-blue-500 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-600 transition-all duration-200 flex items-center space-x-1"
                            >
                              <span>Back to Results</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex-1 overflow-hidden">
                          <motion.pre 
                            className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed h-full overflow-y-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            {JSON.stringify(fhirOutput, null, 2)}
                          </motion.pre>
                        </div>
                      </div>
                    </motion.div>
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