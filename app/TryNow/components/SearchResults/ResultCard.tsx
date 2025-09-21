// app/TryNow/components/SearchResults/ResultCard.tsx
"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Target, Book, Leaf, Stethoscope } from 'lucide-react';

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

interface ResultCardProps {
  group: TM2Group;
  index: number;
  onClick: (groupId: string) => void;
  searchMode?: 'code' | 'symptoms'; // Add searchMode prop
}

const getSystemIcon = (system: string) => {
  switch (system.toLowerCase()) {
    case 'ayurveda':
    case 'namaste':
      return <Leaf className="w-4 h-4" />;
    case 'siddha':
      return <Book className="w-4 h-4" />;
    case 'unani':
      return <Stethoscope className="w-4 h-4" />;
    default:
      return <Target className="w-4 h-4" />;
  }
};

const getSystemColor = (system: string) => {
  switch (system.toLowerCase()) {
    case 'ayurveda':
    case 'namaste':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'siddha':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'unani':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default function ResultCard({ group, index, onClick, searchMode }: ResultCardProps) {
  const systemMatches = [
    { label: 'Ayurveda', match: group.ayurvedaMatch, system: 'ayurveda' },
    { label: 'Siddha', match: group.siddhaMatch, system: 'siddha' },
    { label: 'Unani', match: group.unaniMatch, system: 'unani' }
  ].filter(item => item.match);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group bg-white rounded-lg border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => onClick(group.id)}
    >
      {/* Header with TM2 info */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                TM2
              </span>
              <span className="text-sm font-mono font-bold text-blue-800">
                {group.tm2Code}
              </span>
              {/* Hide confidence for code search */}
              {searchMode === 'symptoms' && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-xs font-medium text-emerald-700">
                    {Math.round(group.averageConfidence * 100)}%
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">
              {group.tm2Display}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {group.tm2Definition.split('\n')[0]}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors ml-4 flex-shrink-0" />
        </div>
      </div>

      {/* Traditional Medicine Systems */}
      <div className="p-4">
        <div className="grid grid-cols-1 gap-3">
          {systemMatches.map((item, idx) => (
            <motion.div
              key={item.system}
              className={`p-3 rounded-lg border ${getSystemColor(item.system)} group-hover:shadow-sm transition-all`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + idx * 0.05 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getSystemIcon(item.system)}
                    <span className="text-xs font-semibold">
                      {item.label}
                    </span>
                    <span className="text-xs font-mono bg-white/70 px-1.5 py-0.5 rounded">
                      {item.match!.code}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium mb-1">
                    {item.match!.display}
                  </h4>
                  <p className="text-xs opacity-80 line-clamp-1">
                    {item.match!.description}
                  </p>
                </div>
                {/* Hide confidence for code search */}
                {searchMode === 'symptoms' && (
                  <div className="text-xs font-medium ml-2">
                    {Math.round(item.match!.confidenceScore * 100)}%
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{systemMatches.length} traditional systems</span>
          <span className="group-hover:text-emerald-600 transition-colors">
            Click for details →
          </span>
        </div>
      </div>
    </motion.div>
  );
}