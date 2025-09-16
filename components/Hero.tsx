"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useAnimation, Variants } from 'framer-motion';
import { Star, Sparkles, CheckCircle, Zap, Globe, Users } from 'lucide-react';
import { DNAHelix, MedicalCross, StethoscopeIcon, PillIcon } from './MedicalIcons';

export default function Hero() {
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
        className="absolute top-16 right-4 sm:top-20 sm:right-16 text-emerald-400/30 sm:text-emerald-400/40"
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
        <MedicalCross className="w-10 h-10 sm:w-14 sm:h-14" />
      </motion.div>
      
      <motion.div
        className="absolute top-24 left-4 sm:top-32 sm:left-16 text-teal-400/30 sm:text-teal-400/40"
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
        className="absolute bottom-32 right-4 sm:right-20 text-emerald-400/30 sm:text-emerald-400/40"
        style={{
          y: floatingY3,
          rotate: helixRotate,
          scale: helixScale,
        }}
      >
        <DNAHelix className="w-12 h-12 sm:w-20 sm:h-20" />
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-4 sm:left-20 text-blue-400/30 sm:text-blue-400/40"
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
        </div>
      </div>
    </section>
  );
}