"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Search, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { DNAHelix, MedicalCross, HeartbeatLine } from './MedicalIcons';

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [strokeFilled, setStrokeFilled] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // small local transforms used for decorative elements (no stethoscope here)
  const helixRotate = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const helixScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const certOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [1, 0.8, 0.3]);

  useEffect(() => {
    const timer = setTimeout(() => setStrokeFilled(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setSearchResult(null);

    await new Promise(resolve => setTimeout(resolve, 1200));

    const mockResult = {
      ayushTerm: searchTerm,
      icd11Code: 'QA02.0Z',
      icd11Description: 'Functional digestive disorders, unspecified',
      fhirMapping: 'CodeSystem: ICD-11 MMS | Version: 2022-02',
      confidence: 94
    };

    setSearchResult(mockResult);
    setIsSearching(false);
  };

  return (
    <section
      ref={ref}
      className="  relative min-h-[200vh] pt-20 pb-12 overflow-hidden"
      data-stethoscope-anchor="hero-top" // anchor for global stethoscope
    >
      {/* invisible anchor where stethoscope should rest at bottom-left of hero */}
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

      {/* Background Grid */}
      <div className="absolute inset-0 medical-grid opacity-30" />

      {/* Certification Stamp (kept) */}
      <motion.div
        className="fixed top-1/3 left-[35%] z-20 pointer-events-none"
        initial={{ opacity: 0, scale: 100, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: -20 }}
        transition={{ duration: 0.2, ease: "backOut", delay: 0.7 }}
        style={{
          opacity: certOpacity
        }}
      >
        <div className="bg-[var(--primary-green)] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform -translate-x-1/2 -translate-y-1/2">
          FHIR R4 CERTIFIED
        </div>
      </motion.div>

      {/* Secondary Medical Elements */}
      <motion.div
        className="absolute top-3/4 left-1/4 text-[var(--secondary-green)] opacity-10"
        style={{
          rotate: helixRotate,
          scale: helixScale,
        }}
      >
        <DNAHelix className="w-24 h-24" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto min-h-screen flex flex-col justify-center">
          <div className="text-center mb-12">
            <motion.h1
              className={`text-5xl md:text-7xl font-bold mb-6 stroke-text ${strokeFilled ? 'filled' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              Bridge Ayush &<br />Modern Medicine
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Lightweight terminology micro-service enabling dual-coding of
              <span className="text-[var(--primary-green)] font-semibold"> Ayush diagnoses (NAMASTE) </span>
              with <span className="text-[var(--primary-green)] font-semibold">WHO ICD-11</span> standards
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-6 mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {[
                { icon: CheckCircle, text: 'FHIR R4 Certified' },
                { icon: Zap, text: '< 100ms Response' },
                { icon: MedicalCross, text: 'WHO Compliant' },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[var(--border-light)] shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <feature.icon className="w-5 h-5 text-[var(--primary-green)]" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Spacer for scroll effect */}
          <div className="h-screen" />

          {/* Live Demo Section */}
          <motion.div
            className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-[var(--border-light)] p-8 relative z-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-black)] mb-2">
                Try Live Translation
              </h2>
              <p className="text-gray-600">Search Ayush terms and get instant ICD-11 mappings</p>
              <HeartbeatLine className="mx-auto mt-4 text-[var(--primary-green)]" />
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter Ayush diagnosis (e.g., 'Vata dosha imbalance')"
                  className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent"
                />
              </div>
              <motion.button
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
                className="bg-[var(--primary-green)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--secondary-green)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSearching ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span>{isSearching ? 'Translating...' : 'Translate'}</span>
              </motion.button>
            </div>

            {/* Search Results */}
            {searchResult && (
              <motion.div
                className="bg-[var(--accent-gray)] rounded-lg p-6 border border-[var(--border-light)]"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-[var(--text-black)] mb-2">Ayush Term</h3>
                    <p className="text-[var(--primary-green)] font-medium">{searchResult.ayushTerm}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-black)] mb-2">ICD-11 Mapping</h3>
                    <p className="text-[var(--secondary-green)] font-mono text-sm">{searchResult.icd11Code}</p>
                    <p className="text-gray-600 text-sm mt-1">{searchResult.icd11Description}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-black)] mb-2">FHIR R4 Ready</h3>
                    <p className="text-gray-600 text-sm">{searchResult.fhirMapping}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-black)] mb-2">Confidence</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-[var(--primary-green)] h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${searchResult.confidence}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-sm font-medium">{searchResult.confidence}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              <motion.button
                className="bg-[var(--primary-green)] text-white px-8 py-3 rounded-lg font-medium hover:bg-[var(--secondary-green)] transition-all duration-300 flex items-center justify-center space-x-2 medical-pulse"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="border-2 border-[var(--primary-green)] text-[var(--primary-green)] px-8 py-3 rounded-lg font-medium hover:bg-[var(--primary-green)] hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Documentation
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
