"use client";

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Database, Zap } from 'lucide-react';
import { NetworkIcon, MedicalCross } from './MedicalIcons';

const steps = [
  {
    id: 1,
    title: 'Input Ayush Diagnosis',
    description: 'Submit traditional Ayush medical terms through our RESTful API endpoint',
    icon: MedicalCross,
    code: `POST /api/v1/translate
{
  "term": "Vata dosha imbalance",
  "system": "NAMASTE"
}`,
    color: 'from-blue-500 to-cyan-500',
    delay: 0
  },
  {
    id: 2,
    title: 'AI-Powered Mapping',
    description: 'Our ML engine processes the term using trained NAMASTE-ICD-11 models',
    icon: Zap,
    code: `{
  "processing": true,
  "algorithm": "neural-mapping",
  "confidence_threshold": 0.85
}`,
    color: 'from-[var(--primary-green)] to-[var(--secondary-green)]',
    delay: 0.2
  },
  {
    id: 3,
    title: 'ICD-11 Output',
    description: 'Receive standardized WHO ICD-11 codes with FHIR R4 compatibility',
    icon: Database,
    code: `{
  "icd11_code": "QA02.0Z",
  "description": "Functional disorders",
  "fhir_ready": true,
  "confidence": 94.2
}`,
    color: 'from-purple-500 to-pink-500',
    delay: 0.4
  }
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const { scrollYProgress } = useScroll({ 
    target: ref,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <section
      id="integration"
      ref={ref}
      className="py-20 relative overflow-hidden bg-white/30 backdrop-blur-xl"
      data-stethoscope-anchor="howitworks-top"
    >
      {/* optional mid anchor to make the stethoscope move further right while inside this section */}
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

      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-[var(--accent-gray)] to-white/40"
        style={{ y: backgroundY, opacity }}
      />
      
      {/* Floating Icons */}
      <motion.div
        className="absolute top-20 right-20 text-[var(--primary-green)] opacity-20"
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <NetworkIcon className="w-32 h-32" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-0">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-black)] mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Seamless integration in three simple steps. From traditional Ayush diagnoses 
            to WHO-compliant ICD-11 codes in milliseconds.
          </p>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-[var(--primary-green)] to-[var(--secondary-green)] rounded-full mx-auto mt-6"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative mb-16 last:mb-0"
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              transition={{ delay: step.delay, duration: 0.8 }}
            >
              <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}>
                {/* Step Content */}
                <div className="flex-1">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="rounded-2xl p-8 shadow-xl border border-white/20 bg-white/40 backdrop-blur-lg hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <motion.div 
                          className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mr-4`}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <step.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <span className="text-sm text-[var(--primary-green)] font-semibold">
                            STEP {step.id}
                          </span>
                          <h3 className="text-2xl font-bold text-[var(--text-black)]">
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {step.description}
                      </p>
                      
                      {/* Feature List */}
                      <div className="flex flex-wrap gap-2">
                        {step.id === 1 && ['RESTful API', 'JSON Format', 'Rate Limited'].map(feature => (
                          <span key={feature} className="bg-white/40 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm border border-white/20">
                            {feature}
                          </span>
                        ))}
                        {step.id === 2 && ['ML-Powered', 'Real-time', '94%+ Accuracy'].map(feature => (
                          <span key={feature} className="bg-white/40 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm border border-white/20">
                            {feature}
                          </span>
                        ))}
                        {step.id === 3 && ['FHIR R4', 'WHO Compliant', 'JSON/XML'].map(feature => (
                          <span key={feature} className="bg-white/40 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm border border-white/20">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Code Example */}
                <div className="flex-1">
                  <motion.div
                    className="rounded-xl p-6 border border-white/20 bg-white/30 backdrop-blur-md font-mono text-sm overflow-x-auto"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ delay: step.delay + 0.3, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <span className="text-xs text-gray-600">Step {step.id} Response</span>
                    </div>
                    <pre className="text-gray-800 whitespace-pre-wrap">
                      <code>{step.code}</code>
                    </pre>
                  </motion.div>
                </div>
              </div>

              {/* Connection Arrow */}
              {index < steps.length - 1 && (
                <motion.div
                  className="flex justify-center mt-8"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ delay: step.delay + 0.6, duration: 0.5 }}
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--primary-green)] flex items-center justify-center shadow-lg">
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-6 h-6 text-white rotate-90" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Performance Stats */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="rounded-2xl p-8 shadow-xl border border-white/20 bg-white/40 backdrop-blur-lg inline-block">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold text-[var(--primary-green)]"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  &lt;100ms
                </motion.div>
                <div className="text-sm text-gray-700">Response Time</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold text-[var(--primary-green)]"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  99.9%
                </motion.div>
                <div className="text-sm text-gray-700">Uptime</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold text-[var(--primary-green)]"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                >
                  94.2%
                </motion.div>
                <div className="text-sm text-gray-700">Accuracy</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
