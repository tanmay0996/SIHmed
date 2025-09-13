"use client";

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { HeartbeatLine } from './MedicalIcons';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline'>('online');
  const { scrollY } = useScroll();
  
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']
  );

  const borderWidth = useTransform(scrollY, [0, 100], ['0%', '100%']);

  useEffect(() => {
    // Simulate API status check
    const checkApiStatus = () => {
      setApiStatus(Math.random() > 0.1 ? 'online' : 'offline');
    };
    
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-transparent"
      style={{ backgroundColor: headerBackground }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div 
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[var(--primary-green)] to-[var(--secondary-green)]"
        style={{ width: borderWidth }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="w-8 h-8 bg-[var(--primary-green)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MB</span>
            </div>
            <span className="text-xl font-bold text-[var(--text-black)]">MedBridge</span>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {['Demo', 'Integration', 'Docs', 'Pricing'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[var(--text-black)] hover:text-[var(--primary-green)] transition-colors font-medium"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              >
                {item}
              </motion.a>
            ))}
          </motion.nav>

          {/* API Status & CTA */}
          <motion.div 
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-[var(--success-green)]' : 'bg-red-500'}`}>
                <div className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-[var(--success-green)]' : 'bg-red-500'} animate-ping`} />
              </div>
              <span className="text-sm text-gray-600">
                API {apiStatus === 'online' ? '99.9%' : 'Offline'}
              </span>
              <HeartbeatLine className="w-8 h-4 text-[var(--primary-green)]" />
            </div>
            
            <motion.button 
              className="bg-[var(--primary-green)] text-white px-4 py-2 rounded-lg font-medium hover:bg-[var(--secondary-green)] transition-all duration-300 medical-pulse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get API Key
            </motion.button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-[var(--border-light)]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-4">
              {['Demo', 'Integration', 'Docs', 'Pricing'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-[var(--text-black)] hover:text-[var(--primary-green)] transition-colors font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
              <div className="pt-4 border-t border-[var(--border-light)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-[var(--success-green)]' : 'bg-red-500'}`} />
                    <span className="text-sm text-gray-600">API {apiStatus === 'online' ? 'Online' : 'Offline'}</span>
                  </div>
                  <button className="bg-[var(--primary-green)] text-white px-4 py-2 rounded-lg font-medium">
                    Get API Key
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}