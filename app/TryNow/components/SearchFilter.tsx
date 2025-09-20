// app/TryNow/components/SearchFilter.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Tag, X, Code, Sparkles } from 'lucide-react';

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

  const handleSymptomAdd = () => {
    const symptom = tempSymptom.trim().toLowerCase();
    if (symptom && !symptomTags.includes(symptom)) {
      setSymptomTags([...symptomTags, symptom]);
      setTempSymptom('');
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
    } else {
      if (!symptomTags.includes(example.toLowerCase())) {
        setSymptomTags([...symptomTags, example.toLowerCase()]);
      }
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
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                searchMode === 'code' 
                  ? 'bg-emerald-500 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Code Search</span>
            </button>
            <button
              onClick={() => setSearchMode('symptoms')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                searchMode === 'symptoms' 
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
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleCodeKeyDown}
                  placeholder="Enter AYUSH code (e.g., EJC, SN4T, O-605)"
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
              <button
                onClick={onSearch}
                disabled={isLoading || !canSearch}
                className="px-6 py-3 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[100px]"
              >
                Search
              </button>
            </div>
            
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
                  onChange={(e) => setTempSymptom(e.target.value)}
                  onKeyDown={handleSymptomKeyDown}
                  placeholder="Add symptom (e.g., fever, headache, nausea)..."
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
                <Tag className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
              <button
                onClick={handleSymptomAdd}
                disabled={!tempSymptom.trim()}
                className="px-6 py-3 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Add
              </button>
            </div>

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