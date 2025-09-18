// components/StatusIndicator.tsx
import React from 'react';
import { Phase } from '../utils/demoUtils';

interface StatusIndicatorProps {
  phase: Phase;
  currentScenarioIndex: number;
  totalScenarios: number;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  phase,
  currentScenarioIndex,
  totalScenarios,
}) => {
  const getStatusText = () => {
    switch (phase) {
      case 'typing-user-input':
      case 'loading':
        return 'Processing...';
      case 'showing-fhir':
      case 'cursor-animation':
        return 'Analyzing...';
      case 'showing-output':
        return 'Results ready';
      case 'paused':
      case 'transitioning':
      default:
        return 'Ready';
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-2">
        <div className={`h-2 w-2 rounded-full ${
          phase === 'showing-output' ? 'bg-green-500' : 
          phase === 'typing-user-input' || phase === 'loading' || phase === 'cursor-animation' || phase === 'showing-fhir' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'
        }`} />
        <span className="text-sm font-medium text-gray-700">
          {getStatusText()}
        </span>
      </div>
      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
        Scenario {currentScenarioIndex + 1} of {totalScenarios}
      </div>
    </div>
  );
};

export default StatusIndicator;