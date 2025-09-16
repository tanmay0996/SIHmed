"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Play } from 'lucide-react';

interface SearchResult {
  ayushTerm: string;
  icd11Code: string;
  icd11Description: string;
  fhirMapping: string;
  confidence: number;
  relatedTerms: string[];
  clinicalNotes: string;
}

export default function LiveDemo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setSearchResult(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockResult: SearchResult = {
      ayushTerm: searchTerm,
      icd11Code: 'QA02.0Z',
      icd11Description: 'Functional digestive disorders, unspecified',
      fhirMapping: 'CodeSystem: ICD-11 MMS | Version: 2022-02',
      confidence: 94,
      relatedTerms: ['Pitta imbalance', 'Digestive fire weakness', 'Agni mandya'],
      clinicalNotes: 'Commonly treated with Triphala and dietary modifications'
    };

    setSearchResult(mockResult);
    setIsSearching(false);
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-slate-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Demo Section - Much More Refined */}
        <motion.div
          className="max-w-4xl mx-auto relative px-4 sm:px-0"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {/* Subtle background glow */}
          <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-emerald-100/20 via-white/40 to-teal-100/20 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl" />
          
          <div className="relative bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-white/60 p-4 sm:p-8 md:p-10">
            {/* Demo Header - More Elegant */}
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-200/50 mb-3 sm:mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <Play className="w-3 sm:w-4 h-3 sm:h-4 text-emerald-600" />
                <span className="text-xs sm:text-sm font-semibold text-emerald-700">Live Demo</span>
              </motion.div>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-2 sm:mb-3">
                Try Instant Translation
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
                Experience real-time Ayush-to-ICD11 mapping powered by our AI engine
              </p>
            </div>

            {/* Search Interface - Cleaner Design */}
            <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter Ayush diagnosis (e.g., 'Vata dosha imbalance')"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder:text-slate-400"
                />
                <Search className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
              </div>
              
              <motion.button
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isSearching ? (
                    <>
                      <motion.div
                        className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="text-sm sm:text-base">Translating...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 sm:w-5 h-4 sm:h-5" />
                      <span className="text-sm sm:text-base">Translate</span>
                    </>
                  )}
                </div>
              </motion.button>
            </div>

            {/* Search Results - Premium Layout */}
            {searchResult && (
              <motion.div
                className="bg-gradient-to-br from-slate-50/80 to-white/80 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-200/50"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Ayush Term</h3>
                    <p className="text-emerald-600 font-semibold text-sm sm:text-base">{searchResult.ayushTerm}</p>
                  </motion.div>
                  
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">ICD-11 Code</h3>
                    <p className="text-blue-600 font-mono font-bold text-base sm:text-lg">{searchResult.icd11Code}</p>
                    <p className="text-slate-600 text-xs sm:text-sm">{searchResult.icd11Description}</p>
                  </motion.div>
                  
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Confidence</h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-xl sm:text-2xl font-bold text-emerald-600">{searchResult.confidence}%</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${searchResult.confidence}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 pt-3 sm:pt-4 border-t border-slate-200/50">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2 sm:mb-3">Related Terms</h3>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.relatedTerms.map((term: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2 sm:mb-3">Clinical Notes</h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{searchResult.clinicalNotes}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CTA Buttons - More Refined */}
            <motion.div
              className="flex flex-col gap-3 sm:gap-4 justify-center mt-6 sm:mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.button
                className="group bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center space-x-1.5 sm:space-x-2">
                  <span className="text-sm sm:text-base">Start Free Trial</span>
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.button>
              
              <motion.button
                className="border border-slate-300 text-slate-700 px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-sm sm:text-base">View Documentation</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}