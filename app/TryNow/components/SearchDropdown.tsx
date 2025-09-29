"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Code, Tag, Sparkles, TrendingUp, Clock } from 'lucide-react';

interface Suggestion {
  suggestion: string;
  type: string;
  confidence: number;
  reason: string;
  jaro_similarity: number;
}

interface SearchResult {
  _id: string;
  tm2_code: string;
  tm2_title: string;
  tm2_definition: string;
  tm2_description: string;
  tm2_link: string;
  code: string;
  code_title: string;
  code_description: string;
  type: string;
  total_score: number;
  total_score_percent: number;
  search_type: string;
  keyword_score: number;
  tfidf_score: number;
}

interface SearchData {
  query: string;
  original_query: string;
  search_type: string;
  total_results: number;
  search_time: string;
  results: SearchResult[];
  suggestions: Suggestion[];
  has_exact_results: boolean;
  similar_results_when_no_match: SearchResult[];
  show_suggestions: boolean;
  show_similar_results: boolean;
  auto_corrected: boolean;
  corrected_to: string | null;
}

interface SearchDropdownProps {
  isVisible: boolean;
  searchData: SearchData | null;
  isLoading: boolean;
  searchMode: 'code' | 'symptoms';
  onSuggestionClick: (suggestion: string, code?: string) => void;
  onResultClick: (result: SearchResult) => void;
  onClose: () => void;
}

export default function SearchDropdown({
  isVisible,
  searchData,
  isLoading,
  searchMode,
  onSuggestionClick,
  onResultClick,
  onClose
}: SearchDropdownProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      setSelectedIndex(0);
    }
  }, [isVisible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;

      const suggestions = searchData?.suggestions || [];
      const results = searchData?.results?.slice(0, 3) || [];
      
      const visibleSuggestions = results.length === 0 ? suggestions : [];
      const totalItems = visibleSuggestions.length + results.length;

      if (totalItems === 0) return;

      const activeElement = document.activeElement;
      const isInputFocused = activeElement && activeElement.tagName === 'INPUT';

      if (!isInputFocused) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % totalItems);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex < visibleSuggestions.length) {
            const suggestion = visibleSuggestions[selectedIndex];
            // Extract code from suggestion text if it contains a code pattern
            const codeMatch = suggestion.suggestion.match(/\b([A-Z0-9]{2,6}(?:-[A-Z0-9]+)?)\b/);
            const code = codeMatch ? codeMatch[1] : undefined;
            onSuggestionClick(suggestion.suggestion, code);
          } else {
            const resultIndex = selectedIndex - visibleSuggestions.length;
            const result = results[resultIndex];
            onResultClick(result);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, selectedIndex, searchData, onSuggestionClick, onResultClick, onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        const target = event.target as Element;
        if (!target.closest('input')) {
          onClose();
        }
      }
    };

    if (isVisible) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const suggestions = searchData?.suggestions || [];
  const results = searchData?.results?.slice(0, 3) || [];
  
  const visibleSuggestions = results.length === 0 ? suggestions : [];
  const hasContent = visibleSuggestions.length > 0 || results.length > 0 || isLoading;

  return (
    <AnimatePresence>
      {hasContent && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
        >
          {isLoading && (
            <div className="p-4 flex items-center justify-center space-x-2 text-slate-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent"></div>
              <span className="text-sm">Searching...</span>
            </div>
          )}

          {searchData?.auto_corrected && (
            <div className="p-3 bg-yellow-50 border-b border-yellow-200">
              <div className="flex items-center space-x-2 text-sm">
                <Sparkles className="w-4 h-4 text-yellow-600" />
                <span className="text-yellow-800">
                  <strong>Auto-corrected:</strong> "{searchData.original_query}" → "{searchData.corrected_to}"
                </span>
              </div>
            </div>
          )}

          {searchData && !isLoading && (
            <div className="p-3 border-b border-slate-100">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  {searchData.total_results > 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-700">
                        Found {searchData.total_results} results
                      </span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 text-slate-400" />
                      <span>No exact matches found</span>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{searchData.search_time}</span>
                </div>
              </div>
            </div>
          )}

          {/* Search Results Section */}
          {results.length > 0 && (
            <div className="border-b border-slate-100">
              <div className="p-3 bg-green-50/50">
                <h3 className="text-sm font-medium text-green-800 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    {searchMode === 'symptoms' ? 'Code Suggestions' : 'Top Results'} ({results.length})
                  </span>
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {results.map((result, index) => (
                  <motion.button
                    key={result._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onResultClick(result)}
                    className={`w-full p-3 text-left hover:bg-green-50 transition-colors ${
                      selectedIndex === visibleSuggestions.length + index ? 'bg-green-100' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <Code className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-mono font-bold text-slate-900">
                              {result.code}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              {result.type}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-medium">
                            {result.total_score_percent}%
                          </span>
                        </div>
                        <div className="text-sm text-slate-700 mb-1 font-medium">
                          {result.code_title}
                        </div>
                        {searchMode === 'symptoms' && (
                          <div className="text-xs text-emerald-600 font-medium mb-1">
                            Click to search this code →
                          </div>
                        )}
                        <div className="text-xs text-slate-500 mb-1">
                          TM2: {result.tm2_code} - {result.tm2_title}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-2">
                          {result.code_description}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions Section - Only show when no results */}
          {suggestions.length > 0 && results.length === 0 && (
            <div className="border-b border-slate-100">
              <div className="p-3 bg-blue-50/50">
                <h3 className="text-sm font-medium text-blue-800 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Did you mean?</span>
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {suggestions.map((suggestion, index) => {
                  // Extract code from suggestion if present
                  const codeMatch = suggestion.suggestion.match(/\b([A-Z0-9]{2,6}(?:-[A-Z0-9]+)?)\b/);
                  const extractedCode = codeMatch ? codeMatch[1] : undefined;
                  
                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onSuggestionClick(suggestion.suggestion, extractedCode)}
                      className={`w-full p-3 text-left hover:bg-blue-50 transition-colors ${
                        selectedIndex === index ? 'bg-blue-100' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {searchMode === 'code' ? (
                            <Code className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Tag className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="font-medium text-blue-900">
                              {suggestion.suggestion}
                              {extractedCode && searchMode === 'symptoms' && (
                                <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                                  Code: {extractedCode}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-blue-400 font-medium">
                              {Math.round(suggestion.confidence * 100)}%
                            </span>
                          </div>
                          <div className="text-sm text-blue-700">
                            {suggestion.reason}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && visibleSuggestions.length === 0 && results.length === 0 && searchData && (
            <div className="p-6 text-center text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No suggestions available</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}

          {/* Footer */}
          {(visibleSuggestions.length > 0 || results.length > 0) && (
            <div className="p-2 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  {searchMode === 'symptoms' 
                    ? 'Click a code to search for details'
                    : 'Use ↑↓ to navigate, Enter to select, Esc to close'
                  }
                </span>
                <span>{visibleSuggestions.length + results.length} items</span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}