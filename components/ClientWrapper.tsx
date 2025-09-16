'use client';

import { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import GlobalBackground from '@/components/GlobalBackground';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showBackground, setShowBackground] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Small delay to show background before content
    setTimeout(() => {
      setShowBackground(true);
    }, 100);
  };

  return (
    <>
      {/* Loading Screen - Shows first */}
      {isLoading && (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      )}
      
      {/* Background and Content - Only render after loading */}
      {!isLoading && (
        <>
          <GlobalBackground />
          <div 
            className={`transition-opacity duration-300 ${
              showBackground ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {children}
          </div>
        </>
      )}
    </>
  );
}