// src/components/LiveDemoAutoplay.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ClickSpark from './ClickSpark'; // Assuming this is already in your project

import AnimatedCursor from './AnimatedCursor';
import DemoHeader from './DemoHeader';
import LoadingAnimation from './LoadingAnimation';
import OutputCards from './OutputCards';
import ProgressIndicator from './ProgressIndicator';
import SearchInterface from './SearchInterface';
import StatusIndicator from './StatusIndicator';
import TopButton from './TopButton';
// import TopButton from './StatusIndicator';

import {
  TYPEWRITER_SPEED,
  LOADER_DURATION,
  CURSOR_MOVE_DURATION,
  PAUSE_AFTER_FHIR,
  PAUSE_BETWEEN_SCENARIOS,
  scenarios,
  Phase,
  TypewriterState,
  typeText,
  animateCursorToTarget
} from '../utils/demoUtils';

export default function LiveDemoAutoplay() {
  const [state, setState] = useState<TypewriterState>({
    currentScenarioIndex: 0,
    phase: 'typing-user-input',
    displayedUserInput: '',
    showSystemOutput: false,
    showFhirOutput: false,
    isFlipped: false,
    cursorPosition: { x: 0, y: 0 },
    showCursor: false,
    showClickEffect: false,
    clickPosition: { x: 0, y: 0 }
  });

  const timeoutRef = useRef<NodeJS.Timeout>();
  const fhirButtonRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, []);

  const handleTopButtonClick = () => {
    console.log('Top right button clicked!');
    alert('Settings button clicked!');
  };

  useEffect(() => {
    const currentScenario = scenarios[state.currentScenarioIndex];

    switch (state.phase) {
      case 'typing-user-input':
        typeText(
          currentScenario.userInput,
          state.displayedUserInput,
          (newText, isComplete) => {
            setState(prev => ({ ...prev, displayedUserInput: newText }));
            if (isComplete) {
              timeoutRef.current = setTimeout(() => {
                setState(prev => ({ ...prev, phase: 'loading' }));
              }, 300);
            }
          },
          prefersReducedMotion.current,
          timeoutRef
        );
        break;

      case 'loading':
        timeoutRef.current = setTimeout(() => {
          setState(prev => ({ ...prev, phase: 'showing-output' }));
        }, LOADER_DURATION);
        break;

      case 'showing-output':
        setState(prev => ({ ...prev, showSystemOutput: true }));
        timeoutRef.current = setTimeout(() => {
          setState(prev => ({ ...prev, phase: 'cursor-animation' }));
        }, 800);
        break;

      case 'cursor-animation':
        if (fhirButtonRef.current) {
          const rect = fhirButtonRef.current.getBoundingClientRect();
          const containerRect = fhirButtonRef.current.closest('.relative')?.getBoundingClientRect();
          
          if (containerRect) {
            const buttonCenterX = rect.left - containerRect.left + rect.width / 2;
            const buttonCenterY = rect.top - containerRect.top + rect.height / 2;
            const targetX = buttonCenterX + 25;
            const targetY = buttonCenterY + 23;
            
            const perfectStartingPositions = [
              { x: 50, y: containerRect.height - 30 },
              { x: containerRect.width - 80, y: 60 }
            ];
            
            const startPos = perfectStartingPositions[state.currentScenarioIndex % 2];
            
            console.log(`Scenario ${state.currentScenarioIndex}: Using perfect movement pattern ${state.currentScenarioIndex % 2}`);
            
            setState(prev => ({ 
              ...prev, 
              showCursor: true,
              cursorPosition: { x: startPos.x, y: startPos.y }
            }));
            
            setTimeout(() => {
              animateCursorToTarget(
                startPos.x,
                startPos.y,
                targetX,
                targetY,
                state.currentScenarioIndex,
                setState,
                timeoutRef
              );
            }, 250);
          }
        }
        break;

      case 'flipping':
        setState(prev => ({ ...prev, isFlipped: true }));
        timeoutRef.current = setTimeout(() => {
          setState(prev => ({ ...prev, phase: 'showing-fhir' }));
        }, 600);
        break;

      case 'showing-fhir':
        setState(prev => ({ ...prev, showFhirOutput: true }));
        setState(prev => ({ ...prev, phase: 'pause-after-fhir' }));
        break;

      case 'pause-after-fhir':
        timeoutRef.current = setTimeout(() => {
          setState(prev => ({ ...prev, phase: 'transitioning' }));
        }, PAUSE_AFTER_FHIR);
        break;

      case 'transitioning':
        timeoutRef.current = setTimeout(() => {
          const nextIndex = (state.currentScenarioIndex + 1) % scenarios.length;
          setState({
            currentScenarioIndex: nextIndex,
            phase: 'typing-user-input',
            displayedUserInput: '',
            showSystemOutput: false,
            showFhirOutput: false,
            isFlipped: false,
            cursorPosition: { x: 0, y: 0 },
            showCursor: false,
            showClickEffect: false,
            clickPosition: { x: 0, y: 0 }
          });
        }, PAUSE_BETWEEN_SCENARIOS);
        break;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state.phase, state.currentScenarioIndex, state.displayedUserInput]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const currentScenario = scenarios[state.currentScenarioIndex];

  return (
    <section id="demo" className="py-8 bg-gradient-to-br from-slate-50/50 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-100/20 via-white/40 to-teal-100/20 rounded-xl blur-xl" />
          <div className="relative bg-white/90 backdrop-blur-xl rounded-lg border border-white/60 p-4">
            <TopButton phase={state.phase} onClick={handleTopButtonClick} />

            <AnimatedCursor position={state.cursorPosition} visible={state.showCursor} />
            <ClickSpark position={state.clickPosition} visible={state.showClickEffect} />
            
            <DemoHeader />
            
            <SearchInterface 
              displayedUserInput={state.displayedUserInput} 
              isTyping={state.phase === 'typing-user-input'} 
            />
            
            <LoadingAnimation visible={state.phase === 'loading'} />
            
            <OutputCards
              showSystemOutput={state.showSystemOutput}
              isFlipped={state.isFlipped}
              showFhirOutput={state.showFhirOutput}
              systemOutput={currentScenario.systemOutput}
              fhirOutput={currentScenario.fhirOutput}
              fhirButtonRef={fhirButtonRef}
            />
            
            <ProgressIndicator 
              currentIndex={state.currentScenarioIndex} 
              total={scenarios.length} 
            />
            
            <StatusIndicator 
              phase={state.phase} 
              currentScenarioIndex={state.currentScenarioIndex} 
              totalScenarios={scenarios.length} 
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}