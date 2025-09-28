"use client";

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import Link from 'next/link';
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

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (isMenuOpen && !(e.target as Element)?.closest('header')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
      // Prevent scroll when mobile menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
          {/* Logo - Responsive sizing */}
          <motion.div 
            className="flex items-center space-x-2 sm:space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[var(--primary-green)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">MB</span>
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text-black)]">
              <span className="block sm:hidden">MB</span>
              <span className="hidden sm:block">MedBridge</span>
            </span>
          </motion.div>

          {/* Desktop Navigation - Hidden on mobile and tablet */}
          <motion.nav 
            className="hidden lg:flex items-center space-x-6 xl:space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {['Demo', 'How It Works', 'Docs', 'Try Now'].map((item, index) => {
              if (item === 'Try Now') {
                return (
                  <Link 
                    key={item}
                    href="/TryNow"
                    className="text-[var(--text-black)] hover:text-[var(--primary-green)] transition-colors font-medium text-sm xl:text-base"
                  >
                    <motion.span
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + 3 * 0.1, duration: 0.4 }}
                      className="block"
                    >
                      {item}
                    </motion.span>
                  </Link>
                );
              }
              
              const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                const targetId = item === 'Demo' ? 'demo' : 'how-it-works';
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                  targetSection.scrollIntoView({ behavior: 'smooth' });
                }
              };
              
              return (
                <motion.a
                  key={item}
                  href={`#${item === 'Demo' ? 'demo' : 'how-it-works'}`}
                  onClick={handleClick}
                  className="text-[var(--text-black)] hover:text-[var(--primary-green)] transition-colors font-medium text-sm xl:text-base"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                >
                  {item}
                </motion.a>
              );
            })}
          </motion.nav>

          {/* Tablet Navigation - Visible only on tablet */}
          <motion.nav 
            className="hidden md:flex lg:hidden items-center space-x-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {['Demo', 'Docs'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[var(--text-black)] hover:text-[var(--primary-green)] transition-colors font-medium text-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              >
                {item}
              </motion.a>
            ))}
          </motion.nav>

          {/* Right Side Actions - API Status, Profile, CTA - Responsive layout */}
          <motion.div 
            className="hidden sm:flex items-center space-x-2 sm:space-x-3 lg:space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {/* API Status - Simplified on smaller screens */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full relative ${apiStatus === 'online' ? 'bg-[var(--success-green)]' : 'bg-red-500'}`}>
                <div className={`absolute inset-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${apiStatus === 'online' ? 'bg-[var(--success-green)]' : 'bg-red-500'} animate-ping opacity-75`} />
              </div>
              <span className="text-xs sm:text-sm text-gray-600 hidden md:block">
                API {apiStatus === 'online' ? '99.9%' : 'Offline'}
              </span>
              <span className="text-xs text-gray-600 md:hidden">
                {apiStatus === 'online' ? '99.9%' : 'Off'}
              </span>
              <HeartbeatLine className="w-6 h-3 sm:w-8 sm:h-4 text-[var(--primary-green)] hidden sm:block" />
            </div>

            {/* Profile Icon */}
            <motion.button 
              className="p-2 sm:p-2.5 rounded-full border border-[var(--border-light)] hover:border-[var(--primary-green)] hover:bg-[var(--primary-green)]/5 transition-all duration-300 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              aria-label="User profile"
            >
              <User 
                size={16}
                className="text-gray-600 group-hover:text-[var(--primary-green)] transition-colors sm:w-[18px] sm:h-[18px]" 
              />
            </motion.button>
            
            <motion.button 
              className="bg-[var(--primary-green)] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium hover:bg-[var(--secondary-green)] transition-all duration-300 medical-pulse text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="hidden sm:inline">Get API Key</span>
              <span className="sm:hidden">API Key</span>
            </motion.button>
          </motion.div>

          {/* Mobile Actions - Profile Icon + Menu Button */}
          <div className="flex items-center space-x-2 sm:hidden">
            <motion.button 
              className="p-2 rounded-full border border-[var(--border-light)] hover:border-[var(--primary-green)] hover:bg-[var(--primary-green)]/5 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              aria-label="User profile"
            >
              <User size={16} className="text-gray-600" />
            </motion.button>

            <motion.button
              className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>

          {/* Tablet Menu Button */}
          <motion.button
            className="hidden sm:block lg:hidden p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>

        {/* Mobile & Tablet Menu */}
        {isMenuOpen && (
          <motion.div
            className="lg:hidden py-4 border-t border-[var(--border-light)] bg-white/95 backdrop-blur-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-3 sm:space-y-4">
              {/* Navigation Links */}
              {['Demo', 'How It Works', 'Docs', 'Try Now'].map((item, index) => {
                if (item === 'Try Now') {
                  return (
                    <Link 
                      key={item}
                      href="/TryNow"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-[var(--text-black)] hover:text-[var(--primary-green)] transition-colors font-medium py-2 px-1 rounded-lg hover:bg-gray-50 text-base sm:text-lg block"
                    >
                      <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + 3 * 0.1, duration: 0.3 }}
                        className="block"
                      >
                        {item}
                      </motion.span>
                    </Link>
                  );
                }

                const handleMobileClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  let targetId = '';
                  
                  if (item === 'Demo') {
                    targetId = 'demo';
                  } else if (item === 'How It Works') {
                    targetId = 'how-it-works';
                  }
                  
                  if (targetId) {
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                      targetSection.scrollIntoView({ behavior: 'smooth' });
                      // Close the mobile menu after a short delay for better UX
                      setTimeout(() => {
                        setIsMenuOpen(false);
                      }, 300);
                    }
                  }
                };
                
                return (
                  <motion.a
                    key={item}
                    href={`#${item === 'Demo' ? 'demo' : 'how-it-works'}`}
                    onClick={handleMobileClick}
                    className="text-[var(--text-black)] hover:text-[var(--primary-green)] transition-colors font-medium py-2 px-1 rounded-lg hover:bg-gray-50 text-base sm:text-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                  >
                    {item}
                  </motion.a>
                );
              })}

              {/* Profile Section in Mobile Menu */}
              <motion.div
                className="flex items-center space-x-3 py-2 px-1 border-t border-[var(--border-light)] pt-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <div className="w-8 h-8 rounded-full border border-[var(--primary-green)] bg-[var(--primary-green)]/5 flex items-center justify-center">
                  <User size={18} className="text-[var(--primary-green)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text-black)]">Profile</p>
                  <p className="text-xs text-gray-500">Manage your account</p>
                </div>
              </motion.div>
              
              {/* Mobile API Status & CTA */}
              <div className="pt-3 sm:pt-4 border-t border-[var(--border-light)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full relative ${apiStatus === 'online' ? 'bg-[var(--success-green)]' : 'bg-red-500'}`}>
                      <div className={`absolute inset-0 w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-[var(--success-green)]' : 'bg-red-500'} animate-ping opacity-75`} />
                    </div>
                    <span className="text-sm text-gray-600">
                      API {apiStatus === 'online' ? 'Online (99.9%)' : 'Offline'}
                    </span>
                    <HeartbeatLine className="w-6 h-3 text-[var(--primary-green)]" />
                  </div>
                  <button 
                    className="bg-[var(--primary-green)] text-white px-4 py-2 rounded-lg font-medium text-sm sm:text-base hover:bg-[var(--secondary-green)] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
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