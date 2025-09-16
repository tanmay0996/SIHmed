'use client';

import { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Hide the body content while loading
    document.body.style.overflow = 'hidden';
    
    // Wait for all resources to load (images, CSS, JS, etc.)
    const handleWindowLoad = () => {
      // Optional: Add minimum loading time so users can see the animation
      const minLoadingTime = 5000; // 1 second minimum
      
      setTimeout(() => {
        onLoadingComplete();
        document.body.style.overflow = 'auto';
      }, minLoadingTime);
    };

    // If already loaded
    if (document.readyState === 'complete') {
      handleWindowLoad();
    } else {
      // Wait for window load event
      window.addEventListener('load', handleWindowLoad);
    }

    return () => {
      window.removeEventListener('load', handleWindowLoad);
      document.body.style.overflow = 'auto';
    };
  }, [onLoadingComplete]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="w-64 h-64">
        <DotLottieReact
          src="https://lottie.host/9de34256-1868-4f29-83b6-1280facff7a3/CAkDOhgEjb.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
};

export default LoadingScreen;