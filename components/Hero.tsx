"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useAnimation, Variants } from 'framer-motion';
import { Search, ArrowRight, CheckCircle, Zap, Play, Star, Users, Globe, Sparkles } from 'lucide-react';
import { DNAHelix, MedicalCross, HeartbeatLine, StethoscopeIcon, MicroscopeIcon, PillIcon } from './MedicalIcons';

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  interface SearchResult {
    ayushTerm: string;
    icd11Code: string;
    icd11Description: string;
    fhirMapping: string;
    confidence: number;
    relatedTerms: string[];
    clinicalNotes: string;
  }

  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });
  const controls = useAnimation();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const helixRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const helixScale = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const floatingY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const floatingY2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const floatingY3 = useTransform(scrollYProgress, [0, 1], [0, -80]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setSearchResult(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockResult: SearchResult = {
      ayushTerm: searchTerm,
      icd11Code: 'QA02.0Z',
      icd11Description: 'Functional digestive disorders, unspecified',
      fhirMapping: 'CodeSystem: ICD-11 MMS | Version: 2022-02',
      confidence: 94,
      relatedTerms: ['Pitta imbalance', 'Digestive fire weakness', 'Agni mandya'],
      clinicalNotes: 'Commonly treated with Triphala and dietary modifications'
    };

    setSearchResult(mockResult);
    setIsSearching(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <section
    ref={ref}
    className="relative min-h-[100svh] h-full w-full flex flex-col justify-center overflow-hidden"
    data-stethoscope-anchor="hero-top"
    style={{
      minHeight: '-webkit-fill-available',
      margin: 0,
      padding: 0,
    }}
  >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.08)_1px,transparent_0)] [background-size:16px_16px] sm:[background-size:24px_24px]" />
      
      {/* Floating Medical Icons - More Subtle */}
      <motion.div
        className="absolute top-16 right-4 sm:top-20 sm:right-16 text-emerald-400/10 sm:text-emerald-400/15"
        style={{
          y: floatingY1,
          x: mousePosition.x * 0.3,
        }}
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <MedicalCross className="w-8 h-8 sm:w-12 sm:h-12" />
      </motion.div>
      
      <motion.div
        className="absolute top-24 left-4 sm:top-32 sm:left-16 text-teal-400/10 sm:text-teal-400/15"
        style={{
          y: floatingY2,
          x: mousePosition.x * -0.2,
        }}
        animate={{
          rotate: [0, -15, 15, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <StethoscopeIcon className="w-10 h-10 sm:w-16 sm:h-16" />
      </motion.div>

      <motion.div
        className="absolute bottom-32 right-4 sm:right-20 text-emerald-300/15 sm:text-emerald-300/20"
        style={{
          y: floatingY3,
          rotate: helixRotate,
          scale: helixScale,
        }}
      >
        <DNAHelix className="w-12 h-12 sm:w-20 sm:h-20" />
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-4 sm:left-20 text-blue-400/10 sm:text-blue-400/15"
        style={{
          y: floatingY1,
          x: mousePosition.y * 0.1,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <PillIcon className="w-6 h-6 sm:w-10 sm:h-10" />
      </motion.div>

      <div className="w-full max-w-full px-4 mx-auto relative z-10 flex-1 flex flex-col justify-center">
        <div className="w-full max-w-full px-4 mx-auto sm:max-w-7xl sm:px-4">
          <motion.div 
            className="text-center mb-8 sm:mb-16 pt-8 sm:pt-20"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {/* Trust Badge - More Elegant */}
            <motion.div
              className="inline-flex items-center space-x-2 sm:space-x-3 bg-white/80 backdrop-blur-sm px-3 sm:px-6 py-2 sm:py-3 rounded-full border border-emerald-200/50 shadow-lg shadow-emerald-100/50 mb-4 sm:mb-8 mx-auto"
              variants={itemVariants}
              // whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex -space-x-1">
                <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700">Trusted by 500+ Healthcare Providers</span>
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </motion.div>

            {/* Main Heading - Much More Refined */}
            <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 leading-[1.1] tracking-tight w-full">
                <span className="block mb-1 sm:mb-2">
                  <span className="text-slate-800">Bridge </span>
                  <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                    Ayush
                  </span>
                  <span className="text-slate-800"> &</span>
                </span>
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                    Modern Medicine
                  </span>
                  <motion.div
                    className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
                  />
                </span>
              </h1>
            </motion.div>

            {/* Subtitle - More Concise and Elegant */}
            <motion.p
              className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-2 sm:px-0"
              variants={itemVariants}
            >
              Intelligent terminology service enabling seamless 
              <span className="font-semibold text-emerald-600 mx-1">dual-coding</span> 
              of Ayush diagnoses with 
              <span className="font-semibold text-blue-600 mx-1">WHO ICD-11</span> 
              standards
            </motion.p>

            {/* Feature Pills - More Refined */}
            <motion.div
              className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-12 px-4 sm:px-0"
              variants={itemVariants}
            >
              {[
                { icon: CheckCircle, text: 'FHIR R4 Ready', color: 'emerald' },
                { icon: Zap, text: '< 50ms Response', color: 'amber' },
                { icon: Globe, text: '99.9% Uptime', color: 'blue' },
                { icon: Users, text: '10K+ Daily Users', color: 'purple' },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  className={`group flex items-center space-x-1.5 sm:space-x-2 bg-white/70 backdrop-blur-sm px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-${feature.color}-200/50 shadow-sm hover:shadow-md transition-all duration-300`}
                  variants={itemVariants}
                  // whileHover={{ scale: 1.03, y: -2 }}
                >
                  <feature.icon className={`w-3 sm:w-4 h-3 sm:h-4 text-${feature.color}-500`} />
                  <span className="text-xs sm:text-sm font-medium text-slate-700">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats - More Premium Layout */}
            <motion.div
              className="flex justify-center gap-4 sm:gap-12 mb-6 sm:mb-12"
              variants={itemVariants}
            >
              {[
                { number: '10K+', label: 'Daily Translations' },
                { number: '94%', label: 'Accuracy Rate' },
                { number: '< 50ms', label: 'Response Time' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-1">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-slate-500 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Demo Section - Much More Refined */}
          <motion.div
            className="max-w-4xl mx-auto relative px-4 sm:px-0"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {/* Subtle background glow */}
            <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-emerald-100/20 via-white/40 to-teal-100/20 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl" />
            
            <div className="relative bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-white/60 p-4 sm:p-8 md:p-10">
              {/* Demo Header - More Elegant */}
              <div className="text-center mb-6 sm:mb-8">
                <motion.div
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-200/50 mb-3 sm:mb-4"
                  whileHover={{ scale: 1.02 }}
                >
                  <Play className="w-3 sm:w-4 h-3 sm:h-4 text-emerald-600" />
                  <span className="text-xs sm:text-sm font-semibold text-emerald-700">Live Demo</span>
                </motion.div>
                
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-2 sm:mb-3">
                  Try Instant Translation
                </h2>
                <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
                  Experience real-time Ayush-to-ICD11 mapping powered by our AI engine
                </p>
              </div>

              {/* Search Interface - Cleaner Design */}
              <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Enter Ayush diagnosis (e.g., 'Vata dosha imbalance')"
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder:text-slate-400"
                  />
                  <Search className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
                </div>
                
                <motion.button
                  onClick={handleSearch}
                  disabled={isSearching || !searchTerm.trim()}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {isSearching ? (
                      <>
                        <motion.div
                          className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="text-sm sm:text-base">Translating...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 sm:w-5 h-4 sm:h-5" />
                        <span className="text-sm sm:text-base">Translate</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </div>

              {/* Search Results - Premium Layout */}
              {searchResult && (
                <motion.div
                  className="bg-gradient-to-br from-slate-50/80 to-white/80 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-200/50"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Ayush Term</h3>
                      <p className="text-emerald-600 font-semibold text-sm sm:text-base">{searchResult.ayushTerm}</p>
                    </motion.div>
                    
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">ICD-11 Code</h3>
                      <p className="text-blue-600 font-mono font-bold text-base sm:text-lg">{searchResult.icd11Code}</p>
                      <p className="text-slate-600 text-xs sm:text-sm">{searchResult.icd11Description}</p>
                    </motion.div>
                    
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Confidence</h3>
                      <div className="flex items-center space-x-3">
                        <span className="text-xl sm:text-2xl font-bold text-emerald-600">{searchResult.confidence}%</span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${searchResult.confidence}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 pt-3 sm:pt-4 border-t border-slate-200/50">
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2 sm:mb-3">Related Terms</h3>
                      <div className="flex flex-wrap gap-2">
                        {searchResult.relatedTerms.map((term: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium"
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2 sm:mb-3">Clinical Notes</h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{searchResult.clinicalNotes}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CTA Buttons - More Refined */}
              <motion.div
                className="flex flex-col gap-3 sm:gap-4 justify-center mt-6 sm:mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <motion.button
                  className="group bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center space-x-1.5 sm:space-x-2">
                    <span className="text-sm sm:text-base">Start Free Trial</span>
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </motion.button>
                
                <motion.button
                  className="border border-slate-300 text-slate-700 px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-sm sm:text-base">View Documentation</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}