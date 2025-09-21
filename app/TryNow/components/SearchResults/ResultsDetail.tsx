// app/TryNow/components/SearchResults/ResultsDetail.tsx
"use client";

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Book, Leaf, Stethoscope, Target } from 'lucide-react';
import { useState } from 'react';

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

interface ResultsDetailProps {
  group: TM2Group;
  searchMode: 'code' | 'symptoms';
  onBack: () => void;
  fhirOutput?: any;
}

const getSystemIcon = (system: string) => {
  switch (system.toLowerCase()) {
    case 'ayurveda':
    case 'namaste':
      return <Leaf className="w-5 h-5" />;
    case 'siddha':
      return <Book className="w-5 h-5" />;
    case 'unani':
      return <Stethoscope className="w-5 h-5" />;
    default:
      return <Target className="w-5 h-5" />;
  }
};

const getSystemColor = (system: string) => {
  switch (system.toLowerCase()) {
    case 'ayurveda':
    case 'namaste':
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        badge: 'bg-orange-100 text-orange-700'
      };
    case 'siddha':
      return {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        badge: 'bg-purple-100 text-purple-700'
      };
    case 'unani':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        badge: 'bg-green-100 text-green-700'
      };
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-700',
        badge: 'bg-gray-100 text-gray-700'
      };
  }
};

export default function ResultsDetail({ group, searchMode, onBack, fhirOutput }: ResultsDetailProps) {
  const [showFhir, setShowFhir] = useState(false);
  
  const systemMatches = [
    { label: 'Ayurveda', match: group.ayurvedaMatch, system: 'ayurveda' },
    { label: 'Siddha', match: group.siddhaMatch, system: 'siddha' },
    { label: 'Unani', match: group.unaniMatch, system: 'unani' }
  ].filter(item => item.match);

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to results</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            Detailed View
          </span>
          {fhirOutput && (
            <button
              onClick={() => setShowFhir(!showFhir)}
              className="flex items-center space-x-1 text-sm bg-emerald-500 text-white px-4 py-2 rounded-full font-medium hover:bg-emerald-600 transition-all duration-200"
            >
              <span>{showFhir ? 'Hide FHIR' : 'Show FHIR'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* FHIR View */}
      {showFhir && fhirOutput && (
        <motion.div
          className="mb-6 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-lg border border-emerald-200/50 p-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-emerald-700">FHIR R4 Output</h3>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
              CodeSystem Resource
            </span>
          </div>
          <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto bg-white/60 rounded-lg p-4">
            {JSON.stringify(fhirOutput, null, 2)}
          </pre>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {/* TM2 Section */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200/60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-semibold">
                  WHO ICD-11 TM2
                </span>
                <span className="text-lg font-mono font-bold text-blue-800">
                  {group.tm2Code}
                </span>
                {/* Hide confidence for code search */}
                {searchMode === 'symptoms' && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                    <span className="text-sm font-medium text-emerald-700">
                      {Math.round(group.averageConfidence * 100)}% match
                    </span>
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-slate-800 mb-3">
                {group.tm2Display}
              </h2>
              
              <div className="prose prose-sm text-slate-600 leading-relaxed">
                {group.tm2Definition.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-2">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
          
          {group.tm2Link && (
            <div className="pt-4 border-t border-blue-200">
              <a 
                href={group.tm2Link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View WHO ICD-11 Documentation</span>
              </a>
            </div>
          )}
        </motion.div>

        {/* Traditional Medicine Systems */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Traditional Medicine Systems
          </h3>
          
          {systemMatches.map((item, index) => {
            const colors = getSystemColor(item.system);
            
            return (
              <motion.div
                key={item.system}
                className={`${colors.bg} rounded-lg p-6 border-2 ${colors.border}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getSystemIcon(item.system)}
                    <div>
                      <h4 className={`text-lg font-semibold ${colors.text}`}>
                        {item.label} Medicine
                      </h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`text-sm font-mono font-bold px-2 py-1 rounded ${colors.badge}`}>
                          {item.match!.code}
                        </span>
                        {/* Hide confidence for code search */}
                        {searchMode === 'symptoms' && (
                          <span className="text-sm font-medium text-slate-600">
                            {Math.round(item.match!.confidenceScore * 100)}% confidence
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h5 className={`text-base font-semibold ${colors.text} mb-2`}>
                    {item.match!.display}
                  </h5>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {item.match!.description}
                  </p>
                </div>
                
                <div className={`p-3 ${colors.badge} rounded-lg`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">System Classification:</span>
                    <span className="capitalize">{item.system}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary - Hide confidence for code search */}
        <motion.div
          className="bg-emerald-50/90 rounded-xl p-6 border-2 border-emerald-200/60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h4 className="text-base font-semibold text-emerald-800 mb-4">
            {searchMode === 'code' ? 'Code Analysis Summary' : 'Symptom Analysis Summary'}
          </h4>
          
          <div className="grid grid-cols-2 gap-6 text-sm">
            {searchMode === 'symptoms' && (
              <div>
                <span className="text-emerald-700 font-medium">Average Confidence:</span>
                <span className="ml-2 text-emerald-800 font-semibold">
                  {Math.round(group.averageConfidence * 100)}%
                </span>
              </div>
            )}
            <div className={searchMode === 'symptoms' ? '' : 'col-span-2'}>
              <span className="text-emerald-700 font-medium">Systems Matched:</span>
              <span className="ml-2 text-emerald-800">
                {systemMatches.length}
              </span>
            </div>
            <div className={searchMode === 'symptoms' ? '' : 'col-span-2'}>
              <span className="text-emerald-700 font-medium">TM2 Category:</span>
              <span className="ml-2 text-emerald-800">
                {group.tm2Code}
              </span>
            </div>
            <div className={searchMode === 'symptoms' ? '' : 'col-span-2'}>
              <span className="text-emerald-700 font-medium">WHO ICD-11:</span>
              <span className="ml-2 text-emerald-800">
                {group.tm2Link ? 'Linked' : 'Not available'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}