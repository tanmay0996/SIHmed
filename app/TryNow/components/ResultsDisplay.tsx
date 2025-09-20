// app/TryNow/components/ResultsDisplay.tsx
"use client";

import { motion } from 'framer-motion';

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

interface SystemOutput {
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

interface ResultsDisplayProps {
  systemOutput: SystemOutput;
  searchMode: 'code' | 'symptoms';
}

export default function ResultsDisplay({ systemOutput, searchMode }: ResultsDisplayProps) {
  return (
    <motion.div 
      className="h-full overflow-y-auto space-y-4 pr-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {systemOutput.matches.map((systemMatch, idx) => (
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
                systemMatch.system_type === 'homeopathy' ? 'bg-blue-100 text-blue-700' :
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
                        {code.code}
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
                        <p className="text-sm text-blue-700 mb-2">
                          {code.tm2_mapping.display}
                        </p>
                        <p className="text-xs text-blue-600 leading-relaxed">
                          {code.tm2_mapping.definition}
                        </p>
                        {code.tm2_mapping.icd_link && (
                          <a 
                            href={code.tm2_mapping.icd_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            View ICD Mapping →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
      
      {systemOutput.cross_system_analysis && (
        <motion.div
          className="bg-emerald-50/90 rounded-xl p-5 border-2 border-emerald-200/60 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h4 className="text-base font-semibold text-emerald-800 mb-4">
            {searchMode === 'code' ? 'Code Analysis Summary' : 'Symptom Analysis Summary'}
          </h4>
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
          
          {/* Additional info for symptom searches */}
          {searchMode === 'symptoms' && Array.isArray(systemOutput.input_value) && (
            <div className="mt-4 pt-4 border-t border-emerald-200">
              <h5 className="text-sm font-semibold text-emerald-800 mb-2">
                Analyzed Symptoms:
              </h5>
              <div className="flex flex-wrap gap-2">
                {systemOutput.input_value.map((symptom, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full capitalize"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}