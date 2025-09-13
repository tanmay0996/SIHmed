"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useAnimation, Variants } from 'framer-motion';
import { Search, ArrowRight, CheckCircle, Zap, Play, Star, Users, Globe } from 'lucide-react';
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
  const [strokeFilled, setStrokeFilled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });
  const controls = useAnimation();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Enhanced transforms for parallax effects
  const helixRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const helixScale = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const floatingY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const floatingY2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const floatingY3 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0.1]);

  // Mouse tracking for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setStrokeFilled(true), 1500);
    return () => clearTimeout(timer);
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
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section
      ref={ref}
      className="relative min-h-[200vh] pt-20 pb-12 overflow-hidden"
      data-stethoscope-anchor="hero-top"
    >
      {/* Medical Cross in top right */}
      {/* <div className="absolute top-16 right-8 z-10">
        <MedicalCross className="w-10 h-10 text-emerald-500/80 hover:text-emerald-400 transition-colors duration-300" />
      </div> */}

      <motion.div
        className="absolute top-16 right-8 z-10 text-emerald-400/20"
        style={{
          y: floatingY1,
          x: mousePosition.x * 0.5,
        }}
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <MedicalCross className="w-20 h-20" />
      </motion.div>
      
      {/* Background provided globally by GlobalBackground */}

      {/* Floating Medical Icons */}
      <motion.div
        className="absolute top-1/6 left-1/6 text-emerald-400/20"
        style={{
          y: floatingY1,
          x: mousePosition.x * 0.5,
        }}
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <StethoscopeIcon className="w-20 h-20" />
      </motion.div>

      <motion.div
        className="absolute top-1/4 right-1/5 text-teal-400/20"
        style={{
          y: floatingY2,
          x: mousePosition.x * -0.3,
        }}
        animate={{
          rotate: [0, -15, 15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <MicroscopeIcon className="w-16 h-16" />
      </motion.div>

      <motion.div
        className="absolute top-2/3 right-1/4 text-emerald-300/30"
        style={{
          y: floatingY3,
          rotate: helixRotate,
          scale: helixScale,
        }}
      >
        <DNAHelix className="w-28 h-28" />
      </motion.div>

      <motion.div
        className="absolute top-3/4 left-1/8 text-blue-400/25"
        style={{
          y: floatingY1,
          x: mousePosition.y * 0.2,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <PillIcon className="w-12 h-12" />
      </motion.div>

      {/* Stethoscope anchor */}
      <div
        aria-hidden
        data-stethoscope-anchor="hero-bottom"
        style={{
          position: 'absolute',
          left: '8%',
          bottom: '6rem',
          width: 1,
          height: 1,
          pointerEvents: 'none',
          opacity: 0
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto min-h-screen flex flex-col justify-center">
          <motion.div 
            className="text-center mb-12"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full border border-emerald-200/50 mb-6"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Trusted by 500+ Healthcare Providers</span>
            </motion.div>

            <motion.h1
              className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight`}
              variants={itemVariants}
              style={{
                background: 'linear-gradient(to right, #059669, #0d9488, #0891b2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 10px rgba(5, 150, 105, 0.3)'
              }}
            >
              Bridge Ayush &<br />
              <span className="relative">
                <span className="relative z-10 text-white font-extrabold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-100 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                    Modern Medicine
                  </span>
                </span>
                <motion.div
                  className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 2, duration: 1.5, ease: "easeOut" }}
                />
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Intelligent terminology micro-service enabling seamless dual-coding of
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600"> Ayush diagnoses </span>
              with <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">WHO ICD-11</span> standards
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12"
              variants={itemVariants}
            >
              {[
                { icon: CheckCircle, text: 'FHIR R4 Certified', color: 'from-emerald-500 to-teal-500' },
                { icon: Zap, text: '< 50ms Response', color: 'from-yellow-500 to-orange-500' },
                { icon: MedicalCross, text: 'WHO Compliant', color: 'from-blue-500 to-indigo-500' },
                { icon: Globe, text: '99.9% Uptime', color: 'from-purple-500 to-pink-500' },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  className="group relative"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl blur group-hover:blur-md transition-all duration-300" />
                  <div className="relative flex items-center space-x-3 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/50 shadow-lg">
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-md`}>
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-800">{feature.text}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats Section */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 mb-12"
              variants={itemVariants}
            >
              {[
                { number: '10K+', label: 'Translations Daily', icon: Users },
                { number: '94%', label: 'Accuracy Rate', icon: CheckCircle },
                { number: '50ms', label: 'Avg Response', icon: Zap },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-emerald-500 mr-2" />
                    <span className="text-3xl md:text-4xl font-bold text-gray-800">{stat.number}</span>
                  </div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Spacer for scroll effect */}
          {/* <div className="h-screen" /> */}

          {/* Enhanced Live Demo Section */}
          <motion.div
            className="max-w-5xl mx-auto relative z-20"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            {/* Demo container with enhanced styling */}
            <div className="relative">
              {/* Background glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-300/20 via-teal-300/20 to-blue-300/20 rounded-3xl blur-2xl" />
              
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 md:p-12">
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full border border-emerald-200/50 mb-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Play className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Live Demo</span>
                  </motion.div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                    Try Instant Translation
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Experience real-time Ayush-to-ICD11 mapping with our AI-powered terminology engine
                  </p>
                  
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <HeartbeatLine className="mx-auto mt-4 text-emerald-500 w-20 h-10" />
                  </motion.div>
                </div>

                {/* Enhanced Search Interface */}
                <div className="relative mb-8">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Enter Ayush diagnosis (e.g., 'Vata dosha imbalance', 'Pitta aggravation')"
                        className="w-full px-6 py-4 text-lg border-2 border-emerald-200 rounded-2xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Search className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={handleSearch}
                      disabled={isSearching || !searchTerm.trim()}
                      className="relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        {isSearching ? (
                          <>
                            <motion.div
                              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <span>Translating...</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-6 h-6" />
                            <span>Translate</span>
                          </>
                        )}
                      </div>
                      
                      {/* Button glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-30 -z-10" />
                    </motion.button>
                  </div>
                </div>

                {/* Enhanced Search Results */}
                {searchResult && (
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    {/* Results glow */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-2xl blur-xl" />
                    
                    <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h3 className="font-bold text-gray-800 flex items-center">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                            Ayush Term
                          </h3>
                          <p className="text-emerald-600 font-semibold text-lg">{searchResult.ayushTerm}</p>
                        </motion.div>
                        
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h3 className="font-bold text-gray-800 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            ICD-11 Mapping
                          </h3>
                          <p className="text-blue-600 font-mono text-lg font-bold">{searchResult.icd11Code}</p>
                          <p className="text-gray-600 text-sm leading-relaxed">{searchResult.icd11Description}</p>
                        </motion.div>
                        
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <h3 className="font-bold text-gray-800 flex items-center">
                            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                            FHIR R4 Ready
                          </h3>
                          <p className="text-teal-600 text-sm font-medium">{searchResult.fhirMapping}</p>
                        </motion.div>
                      </div>
                      
                      {/* Confidence meter with enhanced styling */}
                      <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold text-gray-800">Confidence Score</h3>
                          <span className="text-2xl font-bold text-emerald-600">{searchResult.confidence}%</span>
                        </div>
                        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${searchResult.confidence}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                        </div>
                      </motion.div>
                      
                      {/* Additional info sections */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <h3 className="font-bold text-gray-800 mb-3">Related Terms</h3>
                          <div className="flex flex-wrap gap-2">
                            {searchResult.relatedTerms.map((term: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                              >
                                {term}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <h3 className="font-bold text-gray-800 mb-3">Clinical Notes</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{searchResult.clinicalNotes}</p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Enhanced CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                >
                  <motion.button
                    className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <span>Start Free Trial</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-50 -z-10 group-hover:opacity-70 transition-opacity" />
                  </motion.button>
                  
                  <motion.button
                    className="border-2 border-emerald-500 text-emerald-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all duration-300 backdrop-blur-sm"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Documentation
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}