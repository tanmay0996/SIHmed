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

// Types based on the actual backend response
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

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const debounce = (func: Function, delay: number) => {
    return (...args: any[]) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => func(...args), delay);
    };
  };

  const performSearch = useCallback(async (query: string, mode: 'code' | 'symptoms') => {
    if (!query.trim()) {
      clearSmartResults();
      setShowDropdown(false);
      return;
    }

    setStatusMessage('Searching...');
    setStatusType('loading');
    clearSmartResults(false); // Clear results but keep status
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

      // Show dropdown if there are results, or suggestions when no results
      const hasResults = data.results.length > 0;
      const hasSuggestions = data.suggestions.length > 0;
      const hasSimilar = data.similar_results_when_no_match.length > 0;
      
      // Show dropdown if there are results, or suggestions when no results found
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
    if (searchMode === 'code') {
      setInputValue(example);
      debouncedSearch(example, 'code');
    } else {
      if (!symptomTags.includes(example.toLowerCase())) {
        setSymptomTags([...symptomTags, example.toLowerCase()]);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (searchMode === 'code') {
      setInputValue(suggestion);
      debouncedSearch(suggestion, 'code');
    } else {
      setTempSymptom(suggestion);
      // Optionally auto-add: handleSymptomAdd();
    }
    setShowDropdown(false);
  };

  const handleResultClick = (result: SearchResult) => {
    if (searchMode === 'code') {
      setInputValue(result.code);
      debouncedSearch(result.code, 'code');
    }
    setShowDropdown(false);
  };

  const handleDropdownClose = () => {
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, mode: 'code' | 'symptoms') => {
    const value = e.target.value;
    if (mode === 'code') {
      setInputValue(value);
    } else {
      setTempSymptom(value);
    }
    debouncedSearch(value, mode);
  };

  const handleInputFocus = () => {
    // Show dropdown if there's existing search data
    if (searchData && (searchData.results.length > 0 || searchData.suggestions.length > 0)) {
      setShowDropdown(true);
    }
  };

  const canSearch = searchMode === 'code'
    ? inputValue.trim()
    : symptomTags.length > 0;

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
                
                {/* Search Dropdown */}
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

            {/* Smart Search Status */}
            {statusMessage && (
              <div className={`text-sm p-2 rounded ${statusType === 'success' ? 'bg-green-100 text-green-700' : statusType === 'error' ? 'bg-red-100 text-red-700' : statusType === 'warning' ? 'bg-yellow-100 text-yellow-700' : statusType === 'loading' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                {statusMessage}
              </div>
            )}

            {/* Correction Info */}
            {correctionInfo && (
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-sm text-yellow-800">
                {correctionInfo}
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-white/80 p-4 rounded-lg border border-slate-200">
                <h3 className="text-sm font-medium mb-2 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>Did you mean?</span>
                </h3>
                <div className="space-y-2">
                  {suggestions.map((sug, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(sug.suggestion)}
                      className="block w-full text-left text-sm bg-blue-50 p-2 rounded hover:bg-blue-100 transition-colors"
                    >
                      <strong>{sug.suggestion}</strong> - {sug.reason}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Results */}
            {similarResults.length > 0 && (
              <div className="bg-white/80 p-4 rounded-lg border border-slate-200">
                <h3 className="text-sm font-medium mb-2 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>Similar Results</span>
                </h3>
                <div className="space-y-2">
                  {similarResults.map((result, index) => (
                    <div key={index} className="text-sm border-b pb-2 last:border-0">
                      <div><strong>Relevance:</strong> {result.total_score_percent}%</div>
                      <div><strong>TM2:</strong> {result.tm2_code} - {result.tm2_title}</div>
                      <div><strong>Code:</strong> {result.code} - {result.code_title}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Example codes */}
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
          /* Symptoms Search */
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={tempSymptom}
                  onChange={(e) => handleInputChange(e, 'symptoms')}
                  onKeyDown={handleSymptomKeyDown}
                  onFocus={handleInputFocus}
                  placeholder="Add symptom (e.g., fever, headache, nausea)..."
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
                <Tag className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                
                {/* Search Dropdown */}
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
                onClick={handleSymptomAdd}
                disabled={!tempSymptom.trim()}
                className="px-6 py-3 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Add
              </button>
            </div>

            {/* Smart Search Status */}
            {statusMessage && (
              <div className={`text-sm p-2 rounded ${statusType === 'success' ? 'bg-green-100 text-green-700' : statusType === 'error' ? 'bg-red-100 text-red-700' : statusType === 'warning' ? 'bg-yellow-100 text-yellow-700' : statusType === 'loading' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                {statusMessage}
              </div>
            )}

            {/* Correction Info */}
            {correctionInfo && (
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-sm text-yellow-800">
                {correctionInfo}
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-white/80 p-4 rounded-lg border border-slate-200">
                <h3 className="text-sm font-medium mb-2 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>Did you mean?</span>
                </h3>
                <div className="space-y-2">
                  {suggestions.map((sug, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(sug.suggestion)}
                      className="block w-full text-left text-sm bg-blue-50 p-2 rounded hover:bg-blue-100 transition-colors"
                    >
                      <strong>{sug.suggestion}</strong> - {sug.reason}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Results */}
            {similarResults.length > 0 && (
              <div className="bg-white/80 p-4 rounded-lg border border-slate-200">
                <h3 className="text-sm font-medium mb-2 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>Similar Results</span>
                </h3>
                <div className="space-y-2">
                  {similarResults.map((result, index) => (
                    <div key={index} className="text-sm border-b pb-2 last:border-0">
                      <div><strong>Relevance:</strong> {result.total_score_percent}%</div>
                      <div><strong>TM2:</strong> {result.tm2_code} - {result.tm2_title}</div>
                      <div><strong>Code:</strong> {result.code} - {result.code_title}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Example symptoms */}
            <div className="bg-white/60 rounded-lg p-4 border border-slate-200/50">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700">Suggested symptoms:</span>
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

            {/* Symptom Tags Display */}
            {symptomTags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-emerald-50/80 rounded-lg p-4 border border-emerald-200/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-emerald-700">
                    Selected Symptoms ({symptomTags.length})
                  </span>
                  <button
                    onClick={() => setSymptomTags([])}
                    className="text-xs text-emerald-600 hover:text-red-500 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {symptomTags.map((symptom, index) => (
                    <motion.div
                      key={symptom}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      <span className="capitalize">{symptom}</span>
                      <button
                        onClick={() => handleSymptomRemove(symptom)}
                        className="text-emerald-600 hover:text-emerald-800 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Search Button for Symptoms */}
                <div className="flex justify-center">
                  <button
                    onClick={onSearch}
                    disabled={isLoading || !canSearch}
                    className="px-8 py-3 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[140px]"
                  >
                    {isLoading ? 'Analyzing...' : 'Search Symptoms'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      {/* Search Description */}
      <div className="text-center">
        <p className="text-xs text-slate-500">
          {searchMode === 'code'
            ? 'Search for specific AYUSH medicine codes and get results grouped by TM2 categories'
            : 'Add multiple symptoms to find relevant treatments across traditional medicine systems'
          }
        </p>
      </div>
    </div>
  );
}
