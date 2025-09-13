"use client";

import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { HeartbeatLine, MedicalCross } from './MedicalIcons';

const footerLinks = {
  Product: [
    { name: 'API Documentation', href: '#docs' },
    { name: 'Interactive Demo', href: '#demo' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Status Page', href: '#' }
  ],
  Developers: [
    { name: 'Getting Started', href: '#' },
    { name: 'SDKs & Libraries', href: '#' },
    { name: 'Code Examples', href: '#' },
    { name: 'Community', href: '#' }
  ],
  Company: [
    { name: 'About Us', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#enterprise' }
  ],
  Legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Security', href: '#' },
    { name: 'Compliance', href: '#' }
  ]
};

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@medbridge.health', label: 'Email' }
];

export default function Footer() {
  return (
    <footer className="bg-[var(--text-black)] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10">
          <MedicalCross className="w-32 h-32" />
        </div>
        <div className="absolute bottom-10 right-10">
          <MedicalCross className="w-24 h-24" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                className="flex items-center space-x-3 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-10 h-10 bg-[var(--primary-green)] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">MB</span>
                </div>
                <span className="text-2xl font-bold">MedBridge</span>
              </motion.div>
              
              <motion.p
                className="text-gray-400 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                Bridging traditional Ayush medicine with modern healthcare standards. 
                Trusted by healthcare systems worldwide for accurate, fast, and compliant 
                medical terminology translation.
              </motion.p>

              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <HeartbeatLine className="w-24 h-6 text-[var(--primary-green)]" />
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="flex space-x-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[var(--primary-green)] transition-colors duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="sr-only">{social.label}</span>
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + categoryIndex * 0.1, duration: 0.6 }}
              >
                <h3 className="text-lg font-semibold mb-4">{category}</h3>
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + categoryIndex * 0.1 + linkIndex * 0.05, duration: 0.4 }}
                    >
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-[var(--primary-green)] transition-colors duration-200 flex items-center group"
                      >
                        <span>{link.name}</span>
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* API Status Banner */}
        <motion.div
          className="bg-gray-900 rounded-lg p-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[var(--success-green)] rounded-full">
                  <div className="w-3 h-3 bg-[var(--success-green)] rounded-full animate-ping"></div>
                </div>
                <span className="text-sm font-medium">All Systems Operational</span>
              </div>
              <div className="text-gray-400 text-sm">
                API Response Time: 87ms | Uptime: 99.98%
              </div>
            </div>
            <a
              href="#"
              className="text-[var(--primary-green)] hover:underline text-sm flex items-center"
            >
              View Status Page
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div
              className="flex items-center space-x-6 mb-4 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <p className="text-gray-400 text-sm">
                © 2025 MedBridge API. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-2 bg-[var(--primary-green)] rounded-sm"></div>
                  <span className="text-xs text-gray-500">FHIR R4</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-2 bg-blue-500 rounded-sm"></div>
                  <span className="text-xs text-gray-500">ICD-11</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-2 bg-orange-500 rounded-sm"></div>
                  <span className="text-xs text-gray-500">HIPAA</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="text-gray-400 text-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Built with ❤️ for healthcare innovation
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}