"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue } from 'framer-motion';
import { User, Shield, Activity, Heart, Clock, Check, CreditCard as Edit3, Save, X, Lock, Eye, EyeOff, Bell, Settings, LogOut, Dna, Stethoscope, Plus, Key, Copy, RefreshCw, Code, Zap, Globe, BarChart2, TrendingUp, PieChart, Users, BookOpen, HelpCircle } from 'lucide-react';

// Types and Interfaces
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  aadhaar_masked: string;
  avatarUrl: string;
  verified: boolean;
  isOnline: boolean;
  lastLogin: string;
  joinedDate: string;
  apiKeys: ApiKey[];
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  masked_key: string;
  created_at: string;
  last_used: string;
  status: 'active' | 'inactive' | 'expired';
  usage_count: number;
}

// Mock API Helper
const mockFetch = async (url: string, options?: RequestInit): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  
  if (url === '/api/profile') {
    return {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex.johnson@techcorp.com',
      phone: '+91 98765 43210',
      aadhaar_masked: 'xxxx-xxxx-1234',
      avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      verified: true,
      isOnline: true,
      lastLogin: '2025-01-08T10:30:00Z',
      joinedDate: '2023-03-15T00:00:00Z',
      apiKeys: [
        {
          id: '1',
          name: 'Production API',
          key: 'hk_live_1234567890abcdef',
          masked_key: 'hk_live_••••••••••••cdef',
          created_at: '2024-12-01T00:00:00Z',
          last_used: '2025-01-08T09:45:00Z',
          status: 'active',
          usage_count: 15420
        },
      ]
    };
  }
  
  if (url === '/api/profile/aadhaar' && options?.method === 'POST') {
    const body = JSON.parse(options.body as string);
    return {
      success: true,
      aadhaar_masked: `xxxx-xxxx-${body.aadhaar.slice(-4)}`
    };
  }

  if (url === '/api/profile/update' && options?.method === 'POST') {
    const body = JSON.parse(options.body as string);
    return {
      success: true,
      ...body
    };
  }

  if (url === '/api/keys/generate' && options?.method === 'POST') {
    return {
      success: true,
      key: {
        id: Date.now().toString(),
        name: 'New API Key',
        key: `hk_live_${Math.random().toString(36).substring(2, 18)}`,
        masked_key: `hk_live_••••••••••••${Math.random().toString(36).substring(2, 6)}`,
        created_at: new Date().toISOString(),
        last_used: null,
        status: 'active',
        usage_count: 0
      }
    };
  }

  if (url === '/api/auth/logout' && options?.method === 'POST') {
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }
  
  throw new Error('API endpoint not implemented');
};

// Utility function for Aadhaar validation
const isValidAadhaar = (aadhaar: string): boolean => {
  const cleaned = aadhaar.replace(/\D/g, '');
  return cleaned.length === 12 && /^\d{12}$/.test(cleaned);
};

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,15}$/;
  return phoneRegex.test(phone);
};

// Animated Background Elements
const FloatingTechIcons: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 50]);
  const rotate1 = useTransform(scrollY, [0, 1000], [0, 360]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        className="absolute top-20 right-20 opacity-5"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Code size={64} className="text-emerald-500" />
      </motion.div>
      
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-20 left-20 opacity-5"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <Globe size={48} className="text-teal-500" />
      </motion.div>
      
      <motion.div
        className="absolute top-1/2 left-10 opacity-5"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <Zap size={32} className="text-emerald-600" />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-10 opacity-5"
        animate={{ 
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <Key size={40} className="text-teal-600" />
      </motion.div>

      {/* Additional floating icons for more coverage */}
      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-40 right-40 opacity-5"
        animate={{ 
          rotate: [0, -360],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Dna size={56} className="text-emerald-500" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 left-1/3 opacity-5"
        animate={{ 
          y: [0, 30, 0],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <Stethoscope size={48} className="text-teal-500" />
      </motion.div>
    </div>
  );
};

// Animated Input Field Component
const AnimatedInput: React.FC<{
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  error?: string;
}> = ({ label, value, onChange, type = "text", placeholder, readOnly = false, className = "", error }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            background: isFocused 
              ? "linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)"
              : isHovered
              ? "linear-gradient(90deg, rgba(16, 185, 129, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%)"
              : "transparent"
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2"
          animate={{
            borderColor: error
              ? "rgb(239, 68, 68)"
              : isFocused 
              ? "rgb(16, 185, 129)"
              : isHovered
              ? "rgb(20, 184, 166)"
              : "rgb(226, 232, 240)"
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Flowing line animation */}
        <AnimatePresence>
          {isFocused && !error && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              exit={{ width: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative w-full p-4 bg-white/50 rounded-xl focus:outline-none transition-all ${
            readOnly ? 'cursor-default' : ''
          } ${className}`}
        />
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 mt-1"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

// Profile Header Component with Logout
const ProfileHeader: React.FC<{ 
  profile: UserProfile | null; 
  isLoading: boolean;
  onLogout: () => void;
}> = ({ profile, isLoading, onLogout }) => {
  if (isLoading || !profile) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-64" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative">
          <motion.div
            className="relative w-32 h-32 rounded-full overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
            {profile.isOnline && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-emerald-400"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            )}
          </motion.div>
          {profile.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              {profile.name}
            </h1>
            {profile.verified && (
              <motion.div
                className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                title="Verified Developer"
              >
                <Check size={14} />
                Verified
              </motion.div>
            )}
          </div>
          
          <p className="text-slate-600 mb-2">{profile.email}</p>
          <p className="text-slate-600 mb-4">{profile.phone}</p>
          
          <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              Last active: {new Date(profile.lastLogin).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <User size={14} />
              Developer since {new Date(profile.joinedDate).getFullYear()}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
            title="Settings"
          >
            <Settings size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
            title="Notifications"
          >
            <Bell size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors group"
            title="Logout"
          >
            <motion.div
              animate={{ x: [0, 2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <LogOut size={20} />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Profile Details Component with Integrated Aadhaar Editing
const ProfileDetails: React.FC<{ 
  profile: UserProfile; 
  onUpdate: (field: keyof UserProfile, value: any) => void;
  onEditToggle?: () => void;
}> = ({ profile, onUpdate, onEditToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Aadhaar editing states integrated into main editing flow
  const [aadhaarValue, setAadhaarValue] = useState('');
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [aadhaarValidationMessage, setAadhaarValidationMessage] = useState('');
  const [isConfirmingAadhaar, setIsConfirmingAadhaar] = useState(false);
  const [confirmValue, setConfirmValue] = useState('');
  const [aadhaarChanged, setAadhaarChanged] = useState(false);

  const validatePersonalInfo = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!editedProfile.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!editedProfile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(editedProfile.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!editedProfile.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(editedProfile.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Validate Aadhaar if changed
    if (aadhaarChanged && aadhaarValue && !isValidAadhaar(aadhaarValue)) {
      newErrors.aadhaar = 'Please enter a valid 12-digit Aadhaar number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    });
    setErrors({});
    setAadhaarValue('');
    setAadhaarChanged(false);
    setIsConfirmingAadhaar(false);
    setConfirmValue('');
    setAadhaarValidationMessage('');
    onEditToggle?.();
  };

  const handleAadhaarValidation = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    setAadhaarValue(cleaned);
    setAadhaarChanged(true);
    
    setTimeout(() => {
      if (cleaned.length === 0) {
        setAadhaarValidationMessage('');
      } else if (cleaned.length !== 12) {
        setAadhaarValidationMessage('Aadhaar must be 12 digits');
      } else if (isValidAadhaar(cleaned)) {
        setAadhaarValidationMessage('Valid Aadhaar format');
      } else {
        setAadhaarValidationMessage('Invalid Aadhaar format');
      }
    }, 300);
  };

  const handleSave = async () => {
    if (!validatePersonalInfo()) return;

    // If Aadhaar was changed and is valid, but not confirmed yet
    if (aadhaarChanged && aadhaarValue && isValidAadhaar(aadhaarValue) && !isConfirmingAadhaar) {
      setIsConfirmingAadhaar(true);
      return;
    }

    // If confirming Aadhaar, validate confirmation
    if (isConfirmingAadhaar && confirmValue !== aadhaarValue.slice(-4)) {
      setErrors({ aadhaar: 'Confirmation does not match last 4 digits' });
      return;
    }
    
    setIsSaving(true);
    try {
      // Update personal info
      const personalResponse = await mockFetch('/api/profile/update', {
        method: 'POST',
        body: JSON.stringify(editedProfile),
        headers: { 'Content-Type': 'application/json' }
      });

      if (personalResponse.success) {
        onUpdate('name', editedProfile.name);
        onUpdate('email', editedProfile.email);
        onUpdate('phone', editedProfile.phone);

        // Update Aadhaar if it was changed
        if (aadhaarChanged && aadhaarValue && isValidAadhaar(aadhaarValue)) {
          const aadhaarResponse = await mockFetch('/api/profile/aadhaar', {
            method: 'POST',
            body: JSON.stringify({ aadhaar: aadhaarValue }),
            headers: { 'Content-Type': 'application/json' }
          });

          if (aadhaarResponse.success) {
            onUpdate('aadhaar_masked', aadhaarResponse.aadhaar_masked);
          }
        }

        setIsEditing(false);
        setIsConfirmingAadhaar(false);
        setAadhaarValue('');
        setConfirmValue('');
        setAadhaarChanged(false);
        setAadhaarValidationMessage('');
        setErrors({});
      }
    } catch (error) {
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    });
    setErrors({});
    setAadhaarValue('');
    setAadhaarChanged(false);
    setIsConfirmingAadhaar(false);
    setConfirmValue('');
    setAadhaarValidationMessage('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <User className="text-emerald-500" size={24} />
          Personal Details
        </h2>
        
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEdit}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2"
          >
            <Edit3 size={16} />
            Edit Info
          </motion.button>
        )}
      </div>

      <div className="space-y-6">
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
          >
            {errors.general}
          </motion.div>
        )}

        <AnimatedInput
          label="Full Name"
          value={isEditing ? editedProfile.name : profile.name}
          onChange={isEditing ? (value) => setEditedProfile(prev => ({ ...prev, name: value })) : undefined}
          readOnly={!isEditing}
          error={errors.name}
        />

        <AnimatedInput
          label="Email Address"
          value={isEditing ? editedProfile.email : profile.email}
          onChange={isEditing ? (value) => setEditedProfile(prev => ({ ...prev, email: value })) : undefined}
          type="email"
          readOnly={!isEditing}
          error={errors.email}
        />

        <AnimatedInput
          label="Phone Number"
          value={isEditing ? editedProfile.phone : profile.phone}
          onChange={isEditing ? (value) => setEditedProfile(prev => ({ ...prev, phone: value })) : undefined}
          type="tel"
          readOnly={!isEditing}
          error={errors.phone}
        />

        {/* Integrated Aadhaar Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Aadhaar Number (12 digits)
          </label>
          
          {!isEditing ? (
            <div className="relative">
              <div className="flex items-center gap-4 p-4 bg-white/50 border border-slate-200 rounded-xl">
                <Lock size={16} className="text-slate-400" />
                <span className="flex-1 font-mono">
                  {showAadhaar ? '1234-5678-9012' : profile.aadhaar_masked}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    Secure
                  </span>
                  <button
                    onClick={() => setShowAadhaar(!showAadhaar)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    {showAadhaar ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Aadhaar number is stored securely and encrypted. Only the last 4 digits are shown.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div>
                <input
                  type="text"
                  value={aadhaarValue}
                  onChange={(e) => handleAadhaarValidation(e.target.value)}
                  placeholder="Enter 12-digit Aadhaar number (optional)"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={12}
                  className={`w-full p-4 bg-white/50 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-mono ${
                    errors.aadhaar ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Leave empty to keep current Aadhaar number unchanged
                </p>
              </div>

              {isConfirmingAadhaar && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
                >
                  <p className="text-sm text-amber-800 mb-3">
                    Please confirm by entering the last 4 digits of your Aadhaar:
                  </p>
                  <input
                    type="text"
                    value={confirmValue}
                    onChange={(e) => setConfirmValue(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="Last 4 digits"
                    maxLength={4}
                    className="w-32 p-2 bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
                    inputMode="numeric"
                  />
                </motion.div>
              )}

              {aadhaarValidationMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-sm ${
                    aadhaarValidationMessage.includes('Valid') ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {aadhaarValidationMessage}
                </motion.div>
              )}

              {errors.aadhaar && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600"
                >
                  {errors.aadhaar}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isConfirmingAadhaar ? 'Confirm & Save' : 'Save Changes'}
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors flex items-center gap-2"
            >
              <X size={16} />
              Cancel
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// API Key Management Component
const ApiKeyManagement: React.FC<{ profile: UserProfile; onUpdate: (field: keyof UserProfile, value: any) => void }> = ({ 
  profile, 
  onUpdate 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerateKey = async () => {
    setIsGenerating(true);
    try {
      const response = await mockFetch('/api/keys/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.success) {
        const newKeys = [...profile.apiKeys, response.key];
        onUpdate('apiKeys', newKeys);
      }
    } catch (error) {
      console.error('Failed to generate API key:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyKey = async (key: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error('Failed to copy key:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Key className="text-emerald-500" size={24} />
          API Keys
        </h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerateKey}
          disabled={isGenerating}
          className="relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium overflow-hidden group"
        >
          {/* Pulsing background animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400"
            animate={{
              opacity: [0, 0.3, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <div className="relative flex items-center gap-2">
            {isGenerating ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Generating...
              </>
            ) : (
              <>
                <Plus size={16} />
                Get API Key
              </>
            )}
          </div>
        </motion.button>
      </div>

      <div className="space-y-4">
        {profile.apiKeys.map((apiKey, index) => (
          <motion.div
            key={apiKey.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-200 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-800">{apiKey.name}</h3>
                <p className="text-sm text-slate-600">
                  Created {new Date(apiKey.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  apiKey.status === 'active' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {apiKey.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <code className="flex-1 p-3 bg-white rounded-lg font-mono text-sm border">
                {apiKey.masked_key}
              </code>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                className="p-3 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                title="Copy API Key"
              >
                {copiedKey === apiKey.id ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </motion.button>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Usage: {apiKey.usage_count.toLocaleString()} requests</span>
              <span>
                Last used: {apiKey.last_used 
                  ? new Date(apiKey.last_used).toLocaleDateString()
                  : 'Never'
                }
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {profile.apiKeys.length === 0 && (
        <div className="text-center py-12">
          <Key size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-600 mb-4">No API keys generated yet</p>
          <p className="text-sm text-slate-500">
            Generate your first API key to start using our services
          </p>
        </div>
      )}
    </motion.div>
  );
};

// Security Panel Component
const SecurityPanel: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Shield className="text-emerald-500" size={24} />
        Security & Privacy
      </h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <div>
            <h3 className="font-semibold text-slate-800">Two-Factor Authentication</h3>
            <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <motion.div
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              animate={{ x: twoFactorEnabled ? 26 : 2 }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-medium text-slate-800 mb-2">Last Login</h4>
            <p className="text-sm text-slate-600">
              {new Date(profile.lastLogin).toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-1">Mumbai, India</p>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-medium text-slate-800 mb-2">Account Status</h4>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-emerald-600 font-medium">Active & Verified</span>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between"
        >
          <span>View Security Activity</span>
          <Activity size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Usage Overview Component with Animations
const UsageOverview: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const totalUsage = profile.apiKeys.reduce((sum, key) => sum + key.usage_count, 0);
  const progress = useMotionValue(0);

  useEffect(() => {
    progress.set(0);
    progress.set(totalUsage % 100); // Mock progress for animation
  }, [totalUsage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <BarChart2 className="text-emerald-500" size={24} />
        Usage Overview
      </h2>

      <div className="space-y-6">
        <div className="p-4 bg-slate-50 rounded-xl">
          <h3 className="font-semibold text-slate-800 mb-4">API Usage Statistics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Total Requests</span>
                <span className="font-medium">{totalUsage.toLocaleString()}</span>
              </div>
              <motion.div 
                className="h-2 bg-emerald-100 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <motion.div 
                  className="h-full bg-emerald-500"
                  style={{ width: `${(totalUsage % 100)}%` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg text-center">
                <TrendingUp size={20} className="mx-auto mb-2 text-emerald-600" />
                <p className="text-sm text-slate-600">Monthly Growth</p>
                <p className="font-bold text-emerald-700">+24%</p>
              </div>
              <div className="p-3 bg-teal-50 rounded-lg text-center">
                <PieChart size={20} className="mx-auto mb-2 text-teal-600" />
                <p className="text-sm text-slate-600">Active Keys</p>
                <p className="font-bold text-teal-700">{profile.apiKeys.filter(k => k.status === 'active').length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl">
          <h3 className="font-semibold text-slate-800 mb-4">Recent Activity</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Activity size={16} className="text-emerald-500" />
              <span>API call to production endpoint</span>
              <span className="ml-auto text-slate-500">2h ago</span>
            </li>
            <li className="flex items-center gap-2">
              <Activity size={16} className="text-emerald-500" />
              <span>New key generated</span>
              <span className="ml-auto text-slate-500">Yesterday</span>
            </li>
            <li className="flex items-center gap-2">
              <Activity size={16} className="text-emerald-500" />
              <span>Login from new device</span>
              <span className="ml-auto text-slate-500">3 days ago</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

// Developer Resources Component with Subtle Animation
const DeveloperResources: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Code className="text-emerald-500" size={24} />
        Developer Resources
      </h2>

      <div className="space-y-4">
        <motion.a
          href="#docs"
          whileHover={{ scale: 1.02, x: 5 }}
          className="block p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-between"
        >
          <span>API Documentation</span>
          <Globe size={16} className="text-emerald-500" />
        </motion.a>

        <motion.a
          href="#tutorials"
          whileHover={{ scale: 1.02, x: 5 }}
          className="block p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-between"
        >
          <span>Tutorials & Guides</span>
          <BookOpen size={16} className="text-emerald-500" />
        </motion.a>

        <motion.a
          href="#community"
          whileHover={{ scale: 1.02, x: 5 }}
          className="block p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-between"
        >
          <span>Community Forum</span>
          <Users size={16} className="text-emerald-500" />
        </motion.a>

        <motion.a
          href="#support"
          whileHover={{ scale: 1.02, x: 5 }}
          className="block p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-between"
        >
          <span>Contact Support</span>
          <HelpCircle size={16} className="text-emerald-500" />
        </motion.a>
      </div>
    </motion.div>
  );
};

// Background Pattern Component
const BackgroundPattern: React.FC = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `radial-gradient(circle at 25px 25px, rgba(16, 185, 129, 0.1) 2px, transparent 0)`,
        backgroundSize: '50px 50px'
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50" />
  </div>
);

// Main Profile Page Component
const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await mockFetch('/api/profile');
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileUpdate = (field: keyof UserProfile, value: any) => {
    if (profile) {
      setProfile({
        ...profile,
        [field]: value
      });
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await mockFetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.success) {
        // In a real app, you would redirect to login page or clear auth state
        console.log('Logged out successfully');
        // Simulate logout process
        setTimeout(() => {
          alert('Logged out successfully! In a real app, you would be redirected to the login page.');
          setIsLoggingOut(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div className="min-h-screen relative">
      <BackgroundPattern />
      
      {!prefersReducedMotion && <FloatingTechIcons />}
      
      {/* Logout loading overlay */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 shadow-2xl flex items-center gap-4"
            >
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-lg font-medium text-slate-800">Logging out...</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-slate-800 tracking-tight"
          >
            Developer Dashboard
          </motion.h1>
        </div>

        {/* Profile Header - Full Width */}
        <ProfileHeader 
          profile={profile} 
          isLoading={isLoading} 
          onLogout={handleLogout}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Left Column */}
          <div className="space-y-8">
            {profile && (
              <ProfileDetails 
                profile={profile} 
                onUpdate={handleProfileUpdate} 
              />
            )}
            {profile && <UsageOverview profile={profile} />}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {profile && <SecurityPanel profile={profile} />}
            {profile && (
              <ApiKeyManagement 
                profile={profile} 
                onUpdate={handleProfileUpdate} 
              />
            )}
            <DeveloperResources />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;