"use client";

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2, Shield, Zap, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { HeartbeatLine } from './MedicalIcons';

const enterpriseFeatures = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade security with comprehensive compliance certifications',
    features: ['SOC 2 Type II Certified', 'HIPAA Compliant', 'ISO 27001 Certified', 'End-to-end Encryption']
  },
  {
    icon: Zap,
    title: 'High Performance',
    description: 'Built for scale with guaranteed performance and reliability',
    features: ['99.9% SLA Uptime', '<100ms Response Time', 'Auto-scaling Infrastructure', 'Global CDN Network']
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: '24/7 technical support with dedicated healthcare specialists',
    features: ['24/7 Technical Support', 'Dedicated Account Manager', 'Custom Integration Help', 'SLA Guarantees']
  },
  {
    icon: Building2,
    title: 'EMR Integration',
    description: 'Seamless integration with major healthcare systems and EMRs',
    features: ['Epic Integration', 'Cerner Compatibility', 'FHIR R4 Native', 'HL7 Support']
  }
];

const testimonials = [
  {
    quote: "MedBridge API has revolutionized how we handle Ayush diagnoses in our hospital system. The accuracy and speed are exceptional.",
    author: "Dr. Sarah Chen",
    role: "Chief Medical Officer",
    company: "Metro Health Network",
    logo: "MH"
  },
  {
    quote: "Integration was seamless. Our developers had it running in production within hours, not weeks.",
    author: "Michael Rodriguez",
    role: "CTO",
    company: "HealthTech Solutions",
    logo: "HT"
  },
  {
    quote: "The FHIR R4 compliance means we can trust this data in our clinical workflows without additional validation.",
    author: "Dr. Priya Sharma",
    role: "Director of Informatics",
    company: "Integrated Care Systems",
    logo: "IC"
  }
];

export default function EnterpriseReady() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', company: '', message: '' });
    }, 1000);
  };

  return (
    <section id="enterprise" ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-black)] mb-6">
            Enterprise Ready
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted by healthcare systems worldwide. Built for scale, 
            security, and seamless integration with existing EMR workflows.
          </p>
          <HeartbeatLine className="mx-auto mt-6 text-[var(--primary-green)]" />
        </motion.div>

        {/* Enterprise Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {enterpriseFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-[var(--accent-gray)] rounded-xl p-6 border border-[var(--border-light)] hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="w-12 h-12 bg-[var(--primary-green)] rounded-lg flex items-center justify-center mb-4"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-lg font-bold text-[var(--text-black)] mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.features.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-xs text-gray-700 flex items-start">
                    <CheckCircle className="w-3 h-3 text-[var(--primary-green)] mr-2 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-[var(--text-black)] text-center mb-12">
            Trusted by Healthcare Leaders
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                className="bg-white rounded-xl p-6 shadow-lg border border-[var(--border-light)] relative"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute top-4 right-4 w-10 h-10 bg-[var(--primary-green)] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{testimonial.logo}</span>
                </div>
                <blockquote className="text-gray-700 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-[var(--text-black)]">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-[var(--primary-green)]">{testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

       {/* Contact Form */}
       <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="relative z-20"
          >
            <h3 className="text-3xl font-bold text-[var(--text-black)] mb-6">
              Ready for Enterprise?
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Join leading healthcare organizations who trust MedBridge API for their 
              critical terminology translation needs. Our enterprise team will work 
              with you to ensure seamless integration and ongoing support.
            </p>
            
            <div className="space-y-4">
              {[
                'Custom pricing for high-volume usage',
                'Dedicated technical account manager',
                'Priority support with SLA guarantees',
                'Custom integration assistance',
                'Compliance documentation and audits'
              ].map((benefit, index) => (
                <motion.div
                  key={benefit}
                  className="flex items-center space-x-3 relative z-30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                >
                  <CheckCircle className="w-5 h-5 text-[var(--primary-green)] flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-8 border border-[var(--border-light)] relative z-20 shadow-lg"
            style={{ 
              backgroundColor: '#ffffff',
              position: 'relative'
            }}
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-30">
                <div>
                  <h4 className="text-xl font-bold text-[var(--text-black)] mb-2">
                    Contact Enterprise Sales
                  </h4>
                  <p className="text-gray-600 text-sm mb-6">
                    Get a custom quote and implementation timeline
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent bg-white"
                      placeholder="Dr. John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent bg-white"
                      placeholder="john@hospital.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent bg-white"
                    placeholder="Metro Health System"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about your needs
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-green)] focus:border-transparent bg-white"
                    placeholder="We're looking to integrate Ayush terminology into our EMR system..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-[var(--primary-green)] text-white py-3 rounded-lg font-medium hover:bg-[var(--secondary-green)] transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Schedule Enterprise Demo</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <p className="text-xs text-gray-500 text-center">
                  We'll respond within 24 hours with a custom proposal
                </p>
              </form>
            ) : (
              <motion.div
                className="text-center py-8 relative z-30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="w-16 h-16 bg-[var(--success-green)] rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h4 className="text-xl font-bold text-[var(--text-black)] mb-2">
                  Thank You!
                </h4>
                <p className="text-gray-600 mb-4">
                  Your enterprise inquiry has been received. Our team will contact you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-[var(--primary-green)] hover:underline text-sm"
                >
                  Submit another inquiry
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}