// app/TryNow/components/SearchResults/SearchResultsOverview.tsx
"use client";

import { motion } from 'framer-motion';
import { ArrowLeft, Search, Target } from 'lucide-react';
import ResultCard from './ResultCard';

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

interface SearchResultsOverviewProps {
  groups: TM2Group[];
  searchMode: 'code' | 'symptoms';
  searchQuery: string | string[];
  onCardClick: (groupId: string) => void;
  onBackToSearch: () => void;
  totalMatches: number;
}

export default function SearchResultsOverview({ 
  groups, 
  searchMode, 
  searchQuery, 
  onCardClick, 
  onBackToSearch,
  totalMatches 
}: SearchResultsOverviewProps) {
  const queryDisplay = Array.isArray(searchQuery) ? searchQuery.join(', ') : searchQuery;
  
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBackToSearch}
          className="flex items-center space-x-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to search</span>
        </button>

        <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-200/50 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Search className="w-5 h-5 text-slate-500" />
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-slate-700">
                  {searchMode === 'code' ? 'Code Search:' : 'Symptom Search:'}
                </span>
                <span className="text-sm text-slate-600 font-mono">
                  {queryDisplay}
                </span>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              {groups.length} result groups • {totalMatches} total matches
            </div>
          </div>
          
          {/* Quick stats - Hide confidence for code search */}
          <div className="flex items-center space-x-6 text-xs text-slate-500">
            {searchMode === 'symptoms' && (
              <div className="flex items-center space-x-1">
                <Target className="w-3 h-3" />
                <span>Best match: {Math.round(Math.max(...groups.map(g => g.averageConfidence)) * 100)}%</span>
              </div>
            )}
            <div>TM2 categories: {groups.length}</div>
            <div>Traditional systems: {groups.reduce((acc, g) => acc + [g.ayurvedaMatch, g.siddhaMatch, g.unaniMatch].filter(Boolean).length, 0)}</div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-4">
        {groups.length > 0 ? (
          groups
            .sort((a, b) => b.averageConfidence - a.averageConfidence)
            .map((group, index) => (
              <ResultCard
                key={group.id}
                group={group}
                index={index}
                onClick={onCardClick}
              />
            ))
        ) : (
          <motion.div
            className="text-center py-12 bg-slate-50/80 rounded-lg border border-slate-200/50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">No matches found</h3>
            <p className="text-sm text-slate-500">
              Try different {searchMode === 'code' ? 'codes' : 'symptoms'} or adjust your search criteria
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer with search tips */}
      <motion.div
        className="mt-8 p-4 bg-blue-50/80 rounded-lg border border-blue-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Search Tips:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Click any card to view detailed information and FHIR mapping</li>
          <li>• Results are grouped by TM2 (WHO ICD-11) categories for better organization</li>
          <li>• Each group shows matches across multiple traditional medicine systems</li>
          {searchMode === 'symptoms' && (
            <li>• Add more specific symptoms to get more accurate matches</li>
          )}
        </ul>
      </motion.div>
    </motion.div>
  );
}