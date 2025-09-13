"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, useAnimation } from 'framer-motion';
import { ArrowRight, Database, Zap, Code, Clock, Shield, CheckCircle, TrendingUp, Globe } from 'lucide-react';
import { MedicalCross, MicroscopeIcon, DNAHelix, StethoscopeIcon, PillIcon } from './MedicalIcons';

const steps = [
  {
    id: 1,
    title: 'Input Ayush Diagnosis',
    description: 'Submit traditional Ayush medical terms through our secure RESTful API endpoint with enterprise-grade authentication',
    icon: MedicalCross,
    code: `POST /api/v1/translate
{
  "term": "Vata dosha imbalance",
  "system": "NAMASTE",
  "context": "digestive",
  "confidence_threshold": 0.85
}`,
    color: 'from-blue-500 via-cyan-500 to-teal-500',
    delay: 0,
    features: ['RESTful API', 'OAuth 2.0', 'Rate Limited', 'JSON Schema'],
    stats: { requests: '10K+', latency: '< 50ms' }
  },
  {
    id: 2,
    title: 'AI-Powered Neural Mapping',
    description: 'Advanced ML engine processes terms using transformer-based NAMASTE-ICD-11 models with contextual understanding',
    icon: Zap,
    code: `{
  "processing": true,
  "algorithm": "transformer-neural-mapping",
  "model_version": "v2.1.3",
  "context_analysis": "enabled",
  "confidence_threshold": 0.85,
  "processing_time_ms": 47
}`,
    color: 'from-emerald-500 via-teal-500 to-green-500',
    delay: 0.2,
    features: ['Transformer AI', 'Context-Aware', '94%+ Accuracy', 'Real-time'],
    stats: { accuracy: '94.2%', speed: '47ms avg' }
  },
  {
    id: 3,
    title: 'Standardized ICD-11 Output',
    description: 'Receive WHO-compliant ICD-11 codes with comprehensive FHIR R4 compatibility and clinical context',
    icon: Database,
    code: `{
  "icd11_code": "QA02.0Z",
  "description": "Functional digestive disorders",
  "fhir_ready": true,
  "confidence": 94.2,
  "related_codes": ["QA02.1", "QA02.Y"],
  "clinical_context": "Traditional medicine mapping",
  "validation": "WHO_ICD11_2022"
}`,
    color: 'from-purple-500 via-pink-500 to-rose-500',
    delay: 0.4,
    features: ['FHIR R4', 'WHO Compliant', 'JSON/XML', 'HL7 Ready'],
    stats: { compliance: '100%', formats: '3+' }
  }
];

const performanceMetrics = [
  { label: 'Response Time', value: '<50ms', icon: Clock, color: 'text-blue-500' },
  { label: 'Uptime SLA', value: '99.9%', icon: Shield, color: 'text-emerald-500' },
  { label: 'Accuracy Rate', value: '94.2%', icon: TrendingUp, color: 'text-purple-500' },
  { label: 'Global CDN', value: '15+ Regions', icon: Globe, color: 'text-orange-500' }
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const controls = useAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({ 
    target: ref,
    offset: ["start end", "end start"]
  });

  // Enhanced parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  const floatingY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const floatingY2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const floatingRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30
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
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: any = {
    hidden: { y: 30, opacity: 0 },
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
      id="how-it-works"
      ref={ref}
      className="py-24 relative overflow-hidden"
      data-stethoscope-anchor="howitworks-top"
    >
      {/* Background elements are now provided by GlobalBackground */}
      <div className="absolute inset-0 -z-10">
        {/* Semi-transparent overlay to improve text readability */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
      </div>

      {/* Floating Medical Icons - Reduced opacity to work with global background */}
      <motion.div
        className="absolute top-20 right-20 text-emerald-400/10"
        style={{
          y: floatingY1,
          rotate: floatingRotate,
          x: mousePosition.x * 0.3,
        }}
      >
        <MicroscopeIcon className="w-32 h-32" />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-16 text-blue-400/20"
        style={{
          y: floatingY2,
          x: mousePosition.y * 0.2,
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
        <DNAHelix className="w-24 h-24" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-8 text-teal-400/15"
        style={{
          y: floatingY1,
          x: mousePosition.x * -0.2,
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <StethoscopeIcon className="w-20 h-20" />
      </motion.div>

      {/* Optional mid anchor */}
      <div
        aria-hidden
        data-stethoscope-anchor="howitworks-mid"
        style={{
          position: 'absolute',
          left: '60%',
          top: '40%',
          width: 1,
          height: 1,
          pointerEvents: 'none',
          opacity: 0
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full border border-emerald-200/50 mb-6"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <Code className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Enterprise Integration</span>
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight"
            variants={itemVariants}
            style={{
              textShadow: '0 2px 20px rgba(16, 185, 129, 0.15)'
            }}
          >
            How It Works
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8"
            variants={itemVariants}
          >
            Seamless integration in three intelligent steps. Transform traditional Ayush diagnoses 
            into WHO-compliant ICD-11 codes with enterprise-grade reliability and precision.
          </motion.p>

          <motion.div 
            className="w-32 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto"
            variants={itemVariants}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative mb-20 last:mb-0"
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              transition={{ delay: step.delay, duration: 0.8, type: "spring", stiffness: 100 }}
              onHoverStart={() => setActiveStep(step.id)}
              onHoverEnd={() => setActiveStep(null)}
            >
              <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16`}>
                {/* Enhanced Step Content */}
                <div className="flex-1">
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-emerald-300/20 via-teal-300/20 to-blue-300/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative rounded-3xl p-8 shadow-2xl border border-white/60 bg-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-500">
                      <div className="flex items-start mb-6">
                        <motion.div 
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mr-6 shadow-lg`}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                        >
                          <step.icon className="w-8 h-8 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <motion.span 
                            className="text-sm text-emerald-600 font-bold tracking-wider"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: step.delay + 0.2 }}
                          >
                            STEP {step.id}
                          </motion.span>
                          <h3 className="text-3xl font-bold text-gray-800 mb-3">
                            {step.title}
                          </h3>
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{step.stats.latency || step.stats.speed || step.stats.compliance}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{step.stats.requests || step.stats.accuracy || step.stats.formats}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                        {step.description}
                      </p>
                      
                      {/* Enhanced Feature Tags */}
                      <div className="flex flex-wrap gap-3">
                        {step.features.map((feature, featureIndex) => (
                          <motion.span 
                            key={feature} 
                            className="bg-gradient-to-r from-white/80 to-gray-50/80 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-xl text-sm border border-white/40 shadow-sm hover:shadow-md transition-all duration-300"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: step.delay + 0.4 + featureIndex * 0.1 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                          >
                            <CheckCircle className="w-3 h-3 text-emerald-500 inline mr-2" />
                            {feature}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Enhanced Code Example */}
                <div className="flex-1">
                  <motion.div
                    className="relative group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ delay: step.delay + 0.3, duration: 0.5, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.02, y: -3 }}
                  >
                    {/* Code block glow */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-gray-300/20 to-slate-300/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative rounded-2xl p-6 border border-white/40 bg-gradient-to-br from-gray-900 to-slate-800 font-mono text-sm overflow-x-auto shadow-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-400" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400" />
                          <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <motion.span 
                          className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full"
                          animate={activeStep === step.id ? { scale: 1.05 } : { scale: 1 }}
                        >
                          Step {step.id} {step.id === 1 ? 'Request' : step.id === 2 ? 'Processing' : 'Response'}
                        </motion.span>
                      </div>
                      <pre className="text-gray-100 whitespace-pre-wrap leading-relaxed">
                        <code className="language-json">{step.code}</code>
                      </pre>
                      
                      {/* Syntax highlighting effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Enhanced Connection Arrow */}
              {index < steps.length - 1 && (
                <motion.div
                  className="flex justify-center mt-12"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ delay: step.delay + 0.6, duration: 0.5 }}
                >
                  <div className="relative">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRight className="w-8 h-8 text-white rotate-90" />
                      </motion.div>
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur opacity-50 -z-10" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Enhanced Performance Stats */}
        <motion.div 
          className="mt-24"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Enterprise Performance</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for scale with industry-leading performance metrics and reliability guarantees
            </p>
          </div>

          <div className="relative">
            {/* Background glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-300/20 via-teal-300/20 to-blue-300/20 rounded-3xl blur-2xl" />
            
            <div className="relative rounded-3xl p-8 shadow-2xl border border-white/60 bg-white/90 backdrop-blur-xl">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {performanceMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    className="text-center group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-r from-gray-100 to-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <metric.icon className={`w-8 h-8 ${metric.color}`} />
                      </div>
                    </div>
                    <motion.div 
                      className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                    >
                      {metric.value}
                    </motion.div>
                    <p className="text-gray-600 font-medium">{metric.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <motion.button
            className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-center space-x-3">
              <span>Explore API Documentation</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-50 -z-10 group-hover:opacity-70 transition-opacity" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}