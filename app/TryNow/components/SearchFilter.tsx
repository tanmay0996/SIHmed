"use client";

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Tag, X, Code, Sparkles } from 'lucide-react';
import SearchDropdown from './SearchDropdown';

interface SearchFilterProps {
  searchMode: 'code' | 'symptoms';
  setSearchMode: (mode: 'code' | 'symptoms') => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  symptomTags: string[];
  setSymptomTags: (tags: string[]) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const EXAMPLE_CODES = ['EJC', 'SN4T', 'O-605', 'SM87', 'Z25'];
const EXAMPLE_SYMPTOMS = ['fever', 'headache', 'nausea', 'fatigue', 'dizziness', 'joint pain', 'night blindness', 'gait disturbances'];

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

export default function SearchFilter({
  searchMode,
  setSearchMode,
  inputValue,
  setInputValue,
  symptomTags,
  setSymptomTags,
  onSearch,
  isLoading
}: SearchFilterProps) {
  const [tempSymptom, setTempSymptom] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [similarResults, setSimilarResults] = useState<SearchResult[]>([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'warning' | 'loading' | 'info' | ''>('');
  const [correctionInfo, setCorrectionInfo] = useState('');
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const debounce = (func: Function, delay: number) => {
    return (...args: any[]) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => func(...args), delay);
    };
  };

  const performSearch = useCallback(async (query: string, mode: 'code' | 'symptoms', fromUserTyping: boolean) => {
    if (!query.trim()) {
      clearSmartResults();
      setShowDropdown(false);
      return;
    }

    if (!fromUserTyping) {
      return;
    }

    setStatusMessage('Searching...');
    setStatusType('loading');
    clearSmartResults(false);
    setShowDropdown(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SEARCH_URL}/smart-search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data: SearchData = await response.json();

      setSearchData(data);

      let message = '';
      let type: typeof statusType = 'info';

      if (data.auto_corrected) {
        message = `No results for "${data.original_query}". Showing results for "${data.corrected_to}" in ${data.search_time}`;
        type = 'warning';
        setCorrectionInfo(`Search Correction: No results for "${data.original_query}" → Showing results for "${data.corrected_to}"`);
      } else if (data.total_results > 0) {
        message = `Found ${data.total_results} results in ${data.search_time}`;
        type = 'success';
      } else {
        message = `No results found for "${data.query}" in ${data.search_time}`;
        type = 'error';
      }

      setStatusMessage(message);
      setStatusType(type);

      if (data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }

      if (data.similar_results_when_no_match.length > 0) {
        setSimilarResults(data.similar_results_when_no_match);
      }

      const hasResults = data.results.length > 0;
      const hasSuggestions = data.suggestions.length > 0;
      const hasSimilar = data.similar_results_when_no_match.length > 0;
      
      const shouldShowDropdown = hasResults || (hasSuggestions && !hasResults) || hasSimilar;
      
      setShowDropdown(shouldShowDropdown);

    } catch (error) {
      setStatusMessage(`Error: ${(error as Error).message}`);
      setStatusType('error');
      setShowDropdown(false);
    }
  }, []);

  const debouncedSearch = useCallback(debounce(performSearch, 300), [performSearch]);

  const clearSmartResults = (clearStatus = true) => {
    setSuggestions([]);
    setSimilarResults([]);
    setCorrectionInfo('');
    setSearchData(null);
    setShowDropdown(false);
    if (clearStatus) {
      setStatusMessage('');
      setStatusType('');
    }
  };

  const handleSymptomAdd = () => {
    const symptom = tempSymptom.trim().toLowerCase();
    if (symptom && !symptomTags.includes(symptom)) {
      setSymptomTags([...symptomTags, symptom]);
      setTempSymptom('');
      clearSmartResults();
      setShowDropdown(false);
    }
  };

  const handleSymptomRemove = (symptomToRemove: string) => {
    setSymptomTags(symptomTags.filter(tag => tag !== symptomToRemove));
  };

  const handleSymptomKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSymptomAdd();
    }
  };

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleExampleClick = (example: string) => {
    setIsUserTyping(false);
    if (searchMode === 'code') {
      setInputValue(example);
    } else {
      setTempSymptom(example);
    }
  };

  const handleSuggestionClick = (suggestion: string, code?: string) => {
    setIsUserTyping(false);
    if (searchMode === 'code') {
      setInputValue(suggestion);
    } else {
      // Flow 1: Code selected from dropdown
      if (code) {
        setInputValue(code);
        setTempSymptom('');
        setSymptomTags([]); // Clear any existing tags
        clearSmartResults();
        setShowDropdown(false);
        setTimeout(() => onSearch(), 0);
      } else {
        // Just fill the input for further editing
        setTempSymptom(suggestion);
      }
    }
    setShowDropdown(false);
  };

  const handleResultClick = (result: SearchResult) => {
    setIsUserTyping(false);
    if (searchMode === 'code') {
      setInputValue(result.code);
    } else {
      // Flow 1: Code selected from dropdown
      setInputValue(result.code);
      setTempSymptom('');
      setSymptomTags([]); // Clear any existing tags
      clearSmartResults();
      setShowDropdown(false);
      setTimeout(() => onSearch(), 0);
    }
    setShowDropdown(false);
  };

  const handleDropdownClose = () => {
    setShowDropdown(false);
    setIsUserTyping(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, mode: 'code' | 'symptoms') => {
    const value = e.target.value;
    setIsUserTyping(true);
    
    if (mode === 'code') {
      setInputValue(value);
    } else {
      setTempSymptom(value);
    }
    
    debouncedSearch(value, mode, true);
  };

  const handleInputFocus = () => {
    if (isUserTyping && searchData && (searchData.results.length > 0 || searchData.suggestions.length > 0)) {
      setShowDropdown(true);
    }
  };

  // Flow 1: inputValue has a code (selected from dropdown)
  // Flow 2: symptomTags array has values (manual tag entry)
  const canSearch = searchMode === 'code'
    ? inputValue.trim()
    : (inputValue.trim() || symptomTags.length > 0);

  return (
    <div className="space-y-6">
      {/* Search Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-white/90 rounded-full p-1 border border-slate-200 shadow-sm">
          <div className="flex">
            <button
              onClick={() => setSearchMode('code')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${searchMode === 'code'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
                }`}
            >
              <Code className="w-4 h-4" />
              <span>Code Search</span>
            </button>
            <button
              onClick={() => setSearchMode('symptoms')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${searchMode === 'symptoms'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
                }`}
            >
              <Tag className="w-4 h-4" />
              <span>Symptoms Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Interface */}
      <motion.div
        key={searchMode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {searchMode === 'code' ? (
          /* Code Search */
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e, 'code')}
                  onKeyDown={handleCodeKeyDown}
                  onFocus={handleInputFocus}
                  placeholder="Enter AYUSH code (e.g., EJC, SN4T, O-605)"
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                
                <SearchDropdown
                  isVisible={showDropdown}
                  searchData={searchData}
                  isLoading={statusType === 'loading'}
                  searchMode="code"
                  onSuggestionClick={handleSuggestionClick}
                  onResultClick={handleResultClick}
                  onClose={handleDropdownClose}
                />
              </div>
              <button
                onClick={onSearch}
                disabled={isLoading || !canSearch}
                className="px-6 py-3 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[100px]"
              >
                Search
              </button>
            </div>

            {statusMessage && isUserTyping && (
              <div className={`text-sm p-2 rounded ${statusType === 'success' ? 'bg-green-100 text-green-700' : statusType === 'error' ? 'bg-red-100 text-red-700' : statusType === 'warning' ? 'bg-yellow-100 text-yellow-700' : statusType === 'loading' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                {statusMessage}
              </div>
            )}

            {correctionInfo && isUserTyping && (
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-sm text-yellow-800">
                {correctionInfo}
              </div>
            )}

            <div className="bg-white/60 rounded-lg p-4 border border-slate-200/50">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700">Try these examples:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_CODES.map((code) => (
                  <button
                    key={code}
                    onClick={() => handleExampleClick(code)}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium hover:bg-blue-200 transition-colors"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Symptoms Search - Two Flows */
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={tempSymptom}
                  onChange={(e) => handleInputChange(e, 'symptoms')}
                  onKeyDown={handleSymptomKeyDown}
                  onFocus={handleInputFocus}
                  placeholder="Type symptom and press Enter to add tag, or click code from dropdown"
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
                <Tag className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                
                <SearchDropdown
                  isVisible={showDropdown}
                  searchData={searchData}
                  isLoading={statusType === 'loading'}
                  searchMode="symptoms"
                  onSuggestionClick={handleSuggestionClick}
                  onResultClick={handleResultClick}
                  onClose={handleDropdownClose}
                />
              </div>
              <button
                onClick={onSearch}
                disabled={isLoading || !canSearch}
                className="px-6 py-3 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[100px]"
              >
                Search
              </button>
            </div>

            {/* Flow 2: Show symptom tags */}
            {symptomTags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-xs font-medium text-emerald-700 self-center">Symptoms:</span>
                {symptomTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium"
                  >
                    {tag}
                    <button
                      onClick={() => handleSymptomRemove(tag)}
                      className="hover:text-emerald-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {statusMessage && isUserTyping && (
              <div className={`text-sm p-2 rounded ${statusType === 'success' ? 'bg-green-100 text-green-700' : statusType === 'error' ? 'bg-red-100 text-red-700' : statusType === 'warning' ? 'bg-yellow-100 text-yellow-700' : statusType === 'loading' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                {statusMessage}
              </div>
            )}

            <div className="bg-white/60 rounded-lg p-4 border border-slate-200/50">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700">Try searching for:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_SYMPTOMS.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => handleExampleClick(symptom)}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium hover:bg-blue-200 transition-colors capitalize"
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Search Description */}
      <div className="text-center">
        <p className="text-xs text-slate-500">
          {searchMode === 'code'
            ? 'Search for specific AYUSH medicine codes and get results grouped by TM2 categories'
            : 'Click a code from dropdown for instant results, or add multiple symptom tags and search'
          }
        </p>
      </div>
    </div>
  );
}