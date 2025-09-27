/*
  SubscriptionPage.tsx — Premium Plans UI (React + TypeScript)
  -----------------------------------------------------------
  Preview:
    - Install deps: npm i framer-motion lucide-react
    - Ensure Tailwind CSS configured (Tailwind v3+)
    - Run: npm run dev (Next.js or CRA)
  Notes:
    - Mock APIs: GET /api/plans, POST /api/checkout (replace with real billing API)
    - Motion respects prefers-reduced-motion
    - TODO: wire Stripe Checkout, secure server-side promo validation
*/

'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useAnimation, AnimatePresence, Variants } from 'framer-motion';
import { 
  Check, 
  X, 
  Zap, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  CreditCard, 
  Shield, 
  Users, 
  Clock,
  Phone,
  Mail,
  Building,
  Activity,
  Heart,
  Stethoscope
} from 'lucide-react';

// Types
interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PlanFeature[];
  recommended: boolean;
  limits: {
    queries: number | 'unlimited';
    users: number | 'unlimited';
    support: string;
  };
  description: string;
  popular?: boolean;
}

interface CheckoutData {
  planId: string;
  frequency: 'monthly' | 'yearly';
  promoCode?: string;
}

interface CheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  invoicePreview: {
    subtotal: number;
    discount: number;
    total: number;
  };
}

// Mock API functions
const mockPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Perfect for getting started with basic healthcare analytics',
    features: [
      { name: 'Basic Dashboard', included: true },
      { name: 'Up to 100 queries/month', included: true },
      { name: 'Community Support', included: true },
      { name: 'Basic Templates', included: true },
      { name: 'Priority Support', included: false },
      { name: 'Advanced Analytics', included: false },
      { name: 'API Access', included: false },
      { name: 'Custom Integrations', included: false },
      { name: 'SSO & Security', included: false }
    ],
    limits: {
      queries: 100,
      users: 1,
      support: 'Community'
    },
    recommended: false
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 19,
    yearlyPrice: 15,
    description: 'For growing teams that need advanced features and priority support',
    features: [
      { name: 'Advanced Dashboard', included: true },
      { name: 'Up to 10,000 queries/month', included: true },
      { name: 'Priority Support', included: true },
      { name: 'All Templates', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'API Access', included: true },
      { name: 'Team Collaboration', included: true },
      { name: 'Custom Integrations', included: false },
      { name: 'SSO & Security', included: false }
    ],
    limits: {
      queries: 10000,
      users: 10,
      support: 'Priority Email & Chat'
    },
    recommended: true,
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 0, // Custom pricing
    yearlyPrice: 0,
    description: 'For large organizations requiring enterprise-grade security and support',
    features: [
      { name: 'Enterprise Dashboard', included: true },
      { name: 'Unlimited queries', included: true },
      { name: 'Dedicated Support', included: true },
      { name: 'Custom Templates', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Full API Access', included: true },
      { name: 'Team Collaboration', included: true },
      { name: 'Custom Integrations', included: true },
      { name: 'SSO & Security', included: true }
    ],
    limits: {
      queries: 'unlimited',
      users: 'unlimited',
      support: 'Dedicated Account Manager'
    },
    recommended: false
  }
];

const mockGetPlans = async (): Promise<Plan[]> => {
  // TODO: Replace with real API call
  return new Promise(resolve => {
    setTimeout(() => resolve(mockPlans), 500);
  });
};

const mockCheckout = async (data: CheckoutData): Promise<CheckoutResponse> => {
  // TODO: Replace with Stripe Checkout / Payment Intent integration
  const plan = mockPlans.find(p => p.id === data.planId);
  if (!plan) throw new Error('Plan not found');

  const basePrice = data.frequency === 'yearly' 
    ? plan.yearlyPrice * 12 
    : plan.monthlyPrice;

  const discount = data.promoCode === 'HEALTH20' ? basePrice * 0.2 : 0;
  
  return new Promise(resolve => {
    setTimeout(() => resolve({
      success: true,
      checkoutUrl: `/checkout/${data.planId}`,
      invoicePreview: {
        subtotal: basePrice,
        discount,
        total: basePrice - discount
      }
    }), 1000);
  });
};

// Utility functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price);
};

const calculateDiscountedPrice = (monthlyPrice: number, yearlyPrice: number): number => {
  const yearlyTotal = yearlyPrice * 12;
  const monthlyTotal = monthlyPrice * 12;
  return ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100;
};

// Floating Medical Icons Component
const FloatingMedicalIcons: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -75]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        style={{ y: y1 }}
        className="absolute top-20 left-10 text-emerald-200/20"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Activity size={48} />
      </motion.div>
      
      <motion.div
        style={{ y: y2 }}
        className="absolute top-40 right-16 text-teal-300/20"
        animate={{ 
          rotate: [360, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ 
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Heart size={40} />
      </motion.div>

      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-32 left-20 text-emerald-300/20"
        animate={{ 
          rotate: [0, -360],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          rotate: { duration: 30, repeat: Infinity, ease: "linear" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Stethoscope size={44} />
      </motion.div>
    </div>
  );
};

// Billing Toggle Component
interface BillingToggleProps {
  isYearly: boolean;
  onToggle: (isYearly: boolean) => void;
}

const BillingToggle: React.FC<BillingToggleProps> = ({ isYearly, onToggle }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      <motion.div 
        className="flex items-center bg-white/70 backdrop-blur-sm border border-emerald-200/40 rounded-2xl p-2 shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => onToggle(false)}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            !isYearly 
              ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-lg' 
              : 'text-slate-700 hover:text-emerald-600'
          }`}
          aria-pressed={!isYearly}
          role="tab"
        >
          Monthly
        </button>
        <button
          onClick={() => onToggle(true)}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            isYearly 
              ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-lg' 
              : 'text-slate-700 hover:text-emerald-600'
          }`}
          aria-pressed={isYearly}
          role="tab"
        >
          Yearly
        </button>
      </motion.div>
      
      <AnimatePresence mode="wait">
        {isYearly && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -10 }}
            className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
          >
            Save 25%
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Plan Card Component
interface PlanCardProps {
  plan: Plan;
  isYearly: boolean;
  onSelectPlan: (planId: string) => void;
  index: number;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isYearly, onSelectPlan, index }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });
  const [priceCount, setPriceCount] = useState(0);

  const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const displayPrice = plan.id === 'enterprise' ? 'Custom' : formatPrice(currentPrice);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
      // Animate price counter
      if (typeof currentPrice === 'number' && currentPrice > 0) {
        let start = 0;
        const increment = currentPrice / 20;
        const timer = setInterval(() => {
          start += increment;
          if (start >= currentPrice) {
            setPriceCount(currentPrice);
            clearInterval(timer);
          } else {
            setPriceCount(Math.floor(start));
          }
        }, 50);
        return () => clearInterval(timer);
      }
    }
  }, [inView, controls, currentPrice]);

  const cardVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={cardVariants}
      whileHover={{ 
        y: -6, 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' 
      }}
      className={`relative bg-white/70 backdrop-blur-sm border rounded-2xl p-8 shadow-xl transition-all duration-300 ${
        plan.recommended 
          ? 'border-emerald-300/60 ring-2 ring-emerald-200/40 scale-105' 
          : 'border-emerald-200/40'
      }`}
    >
      {/* Recommended Badge */}
      {plan.recommended && (
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            Most Popular
          </div>
        </motion.div>
      )}

      {/* Popular Badge with Shimmer */}
      {plan.popular && (
        <motion.div
          className="absolute top-4 right-4"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="relative bg-gradient-to-r from-emerald-400 to-teal-400 text-white p-2 rounded-lg">
            <Star size={16} fill="currentColor" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: [-100, 100] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        </motion.div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
        <p className="text-slate-600 mb-6">{plan.description}</p>
        
        <div className="mb-4">
          {plan.id === 'enterprise' ? (
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Custom
            </div>
          ) : (
            <>
              <motion.div 
                className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent"
                key={`${plan.id}-${isYearly}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {formatPrice(priceCount)}
              </motion.div>
              <div className="text-slate-600 mt-1">
                per {isYearly ? 'month, billed yearly' : 'month'}
              </div>
              {isYearly && plan.monthlyPrice > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-slate-500 line-through"
                >
                  {formatPrice(plan.monthlyPrice)}/month
                </motion.div>
              )}
            </>
          )}
        </div>

        {plan.id === 'pro' && (
          <div className="text-sm text-emerald-600 font-medium">
            Try free for 14 days
          </div>
        )}
      </div>

      {/* Features List */}
      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, idx) => (
          <motion.li
            key={feature.name}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.1 * idx }}
            className="flex items-center gap-3"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              feature.included 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'bg-slate-100 text-slate-400'
            }`}>
              {feature.included ? <Check size={12} /> : <X size={12} />}
            </div>
            <span className={feature.included ? 'text-slate-700' : 'text-slate-400'}>
              {feature.name}
            </span>
          </motion.li>
        ))}
      </ul>

      {/* CTA Button */}
      <motion.button
        onClick={() => onSelectPlan(plan.id)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
          plan.recommended
            ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl'
            : plan.id === 'enterprise'
            ? 'border-2 border-emerald-300 text-emerald-600 hover:bg-emerald-50'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        {plan.id === 'free' 
          ? 'Get Started Free' 
          : plan.id === 'enterprise'
          ? 'Contact Sales'
          : 'Start Free Trial'
        }
      </motion.button>
    </motion.div>
  );
};

// Comparison Table Component
interface ComparisonTableProps {
  plans: Plan[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ plans }) => {
  const features = [
    'Basic Dashboard',
    'Advanced Analytics', 
    'API Access',
    'Team Collaboration',
    'Priority Support',
    'Custom Integrations',
    'SSO & Security'
  ];

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-emerald-200/40 rounded-2xl p-8 shadow-xl">
      <h3 className="text-2xl font-bold text-center text-slate-800 mb-8">
        Feature Comparison
      </h3>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-slate-700">Features</th>
              {plans.map(plan => (
                <th key={plan.id} className="text-center py-4 px-6 font-semibold text-slate-700">
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, idx) => (
              <motion.tr
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border-t border-slate-200"
              >
                <td className="py-4 px-6 text-slate-700">{feature}</td>
                {plans.map(plan => {
                  const planFeature = plan.features.find(f => f.name === feature);
                  return (
                    <td key={`${plan.id}-${feature}`} className="py-4 px-6 text-center">
                      <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                        planFeature?.included 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {planFeature?.included ? <Check size={16} /> : <X size={16} />}
                      </div>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Accordion */}
      <div className="md:hidden space-y-4">
        {plans.map(plan => (
          <div key={plan.id} className="border border-slate-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-800 mb-4">{plan.name}</h4>
            <div className="space-y-2">
              {features.map(feature => {
                const planFeature = plan.features.find(f => f.name === feature);
                return (
                  <div key={feature} className="flex items-center justify-between">
                    <span className="text-slate-700">{feature}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      planFeature?.included 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {planFeature?.included ? <Check size={12} /> : <X size={12} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// FAQ Accordion Component
const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Can I change plans at any time?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise customers."
    },
    {
      question: "Is there a setup fee?",
      answer: "No, there are no setup fees for any of our plans. You only pay the monthly or yearly subscription fee."
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "Your data is safely stored for 30 days after cancellation. You can export all your data during this period or reactivate your account."
    },
    {
      question: "Do you offer discounts for non-profits?",
      answer: "Yes, we offer special pricing for qualified non-profit organizations and educational institutions. Contact our sales team for more information."
    }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-emerald-200/40 rounded-2xl p-8 shadow-xl">
      <h3 className="text-2xl font-bold text-center text-slate-800 mb-8">
        Frequently Asked Questions
      </h3>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-slate-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
              aria-expanded={openIndex === index}
              aria-controls={`faq-${index}`}
            >
              <span className="font-semibold text-slate-800">{faq.question}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={20} className="text-slate-500" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  id={`faq-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 text-slate-600">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Payment CTA Modal Component
interface PaymentCTAProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: Plan | null;
  isYearly: boolean;
}

const PaymentCTA: React.FC<PaymentCTAProps> = ({ 
  isOpen, 
  onClose, 
  selectedPlan, 
  isYearly 
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState({
    subtotal: 0,
    discount: 0,
    total: 0
  });

  useEffect(() => {
    if (selectedPlan) {
      const price = isYearly ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice;
      const subtotal = isYearly ? price * 12 : price;
      const discount = promoCode === 'HEALTH20' ? subtotal * 0.2 : 0;
      setPriceBreakdown({
        subtotal,
        discount,
        total: subtotal - discount
      });
    }
  }, [selectedPlan, isYearly, promoCode]);

  const handleCheckout = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    
    try {
      const result = await mockCheckout({
        planId: selectedPlan.id,
        frequency: isYearly ? 'yearly' : 'monthly',
        promoCode: promoCode || undefined
      });
      
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          onClose();
          setShowSuccess(false);
          setIsProcessing(false);
        }, 2000);
      }
    } catch (error) {
      setIsProcessing(false);
      console.error('Checkout failed:', error);
    }
  };

 

  if (!isOpen || !selectedPlan) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-title"
        >
          {showSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Success!</h3>
              <p className="text-slate-600">Your subscription has been activated.</p>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 id="checkout-title" className="text-2xl font-bold text-slate-800">
                  Complete Your Order
                </h3>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Plan Summary */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-800">{selectedPlan.name} Plan</span>
                  <span className="font-bold text-emerald-600">
                    {formatPrice(isYearly ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice)}
                    /{isYearly ? 'month (yearly)' : 'month'}
                  </span>
                </div>
                {selectedPlan.id === 'pro' && (
                  <p className="text-sm text-slate-600">Includes 14-day free trial</p>
                )}
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label htmlFor="promo-code" className="block text-sm font-medium text-slate-700 mb-2">
                  Promo Code (Optional)
                </label>
                <input
                  id="promo-code"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {promoCode === 'HEALTH20' && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-emerald-600 mt-1"
                  >
                    ✓ 20% discount applied!
                  </motion.p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(priceBreakdown.subtotal)}</span>
                </div>
                {priceBreakdown.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-{formatPrice(priceBreakdown.discount)}</span>
                  </div>
                )}
                <hr className="border-slate-200" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(priceBreakdown.total)}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <motion.button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Start {selectedPlan.id === 'pro' ? 'Free Trial' : 'Subscription'}
                    </>
                  )}
                </motion.button>
                
                <p className="text-xs text-slate-500 text-center">
                  Secure checkout powered by Stripe. Cancel anytime.
                  {/* TODO: Add real security badges and PCI compliance notice */}
                </p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main Subscription Page Component
const SubscriptionPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isYearly, setIsYearly] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const plansData = await mockGetPlans();
        setPlans(plansData);
      } catch (error) {
        console.error('Failed to load plans:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const handleSelectPlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
      if (plan.id === 'enterprise') {
        // TODO: Open contact form or redirect to sales page
        window.open('mailto:sales@healthsaas.com', '_blank');
      } else {
        setShowPaymentModal(true);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
      
      {/* Floating Medical Icons */}
      <FloatingMedicalIcons />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Unlock the full potential of healthcare analytics with our comprehensive suite of tools. 
            Start free, upgrade as you grow.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isYearly={isYearly}
              onSelectPlan={handleSelectPlan}
              index={index}
            />
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <ComparisonTable plans={plans} />
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <FaqAccordion />
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500">
            <div className="flex items-center gap-2">
              <Shield size={20} />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span>10,000+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={20} />
              <span>24/7 Support</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <PaymentCTA
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        selectedPlan={selectedPlan}
        isYearly={isYearly}
      />
    </div>
  );
};

export default SubscriptionPage;