"use client";

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Copy, Check, Code, Database, Shield, Zap } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const codeExamples = {
  curl: `curl -X POST "https://api.medbridge.health/v1/translate" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "term": "Vata dosha imbalance",
    "system": "NAMASTE",
    "target": "ICD11",
    "include_fhir": true
  }'`,
  javascript: `import { MedBridgeAPI } from '@medbridge/client';

const client = new MedBridgeAPI({
  apiKey: process.env.MEDBRIDGE_API_KEY
});

const result = await client.translate({
  term: 'Vata dosha imbalance',
  system: 'NAMASTE',
  target: 'ICD11',
  includeFhir: true
});

console.log(result.icd11Code); // "QA02.0Z"`,
  python: `from medbridge import MedBridgeAPI

client = MedBridgeAPI(api_key="YOUR_API_KEY")

result = client.translate(
    term="Vata dosha imbalance",
    system="NAMASTE", 
    target="ICD11",
    include_fhir=True
)

print(f"ICD-11 Code: {result.icd11_code}")`,
  response: `{
  "success": true,
  "data": {
    "original_term": "Vata dosha imbalance",
    "icd11": {
      "code": "QA02.0Z",
      "description": "Functional digestive disorders, unspecified",
      "chapter": "Diseases of the digestive system"
    },
    "fhir": {
      "system": "http://id.who.int/icd/release/11/mms",
      "code": "QA02.0Z",
      "display": "Functional digestive disorders, unspecified"
    },
    "confidence": 94.2,
    "alternatives": [
      {
        "code": "QA02.1",
        "confidence": 87.5
      }
    ]
  }
}`
};

const features = [
  {
    icon: Code,
    title: 'RESTful API',
    description: 'Simple HTTP endpoints with comprehensive documentation',
    specs: ['JSON Request/Response', 'OpenAPI 3.0 Schema', 'Rate Limiting: 1000/hour']
  },
  {
    icon: Database,
    title: 'Multiple Formats',
    description: 'Support for various medical coding systems and outputs',
    specs: ['NAMASTE → ICD-11', 'FHIR R4 Compatible', 'JSON/XML Response']
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security with compliance certifications',
    specs: ['OAuth 2.0 + API Keys', 'SOC 2 Type II', 'HIPAA Compliant']
  },
  {
    icon: Zap,
    title: 'High Performance',
    description: 'Optimized for speed and reliability at scale',
    specs: ['<100ms Response Time', '99.9% SLA Uptime', 'Global CDN']
  }
];

export default function TechnicalSpecs() {
  const [activeTab, setActiveTab] = useState('curl');
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates({ ...copiedStates, [key]: true });
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [key]: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const tabs = [
    { id: 'curl', label: 'cURL', language: 'bash' },
    { id: 'javascript', label: 'JavaScript', language: 'javascript' },
    { id: 'python', label: 'Python', language: 'python' },
    { id: 'response', label: 'Response', language: 'json' }
  ];

  return (
    <section id="docs" ref={ref} className="  py-20 bg-[var(--accent-gray)]">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-black)] mb-6">
            Technical Specifications
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive API documentation and code examples to get you started in minutes.
            Built for developers, trusted by healthcare systems worldwide.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-lg border border-[var(--border-light)] hover:shadow-xl transition-all duration-300 relative z-20"
                style={{ 
                  backgroundColor: '#ffffff',
                  position: 'relative'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="w-12 h-12 bg-[var(--primary-green)] rounded-lg flex items-center justify-center mb-4 relative z-30"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-[var(--text-black)] mb-2 relative z-30">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 relative z-30">{feature.description}</p>
                <ul className="space-y-1 relative z-30">
                  {feature.specs.map((spec, specIndex) => (
                    <li key={specIndex} className="text-xs text-[var(--primary-green)] flex items-center">
                      <Check className="w-3 h-3 mr-1" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Code Examples */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-[var(--border-light)] overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="bg-gray-50 border-b border-[var(--border-light)] p-4">
              <h3 className="text-xl font-bold text-[var(--text-black)] mb-4">
                API Examples
              </h3>
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-[var(--primary-green)] text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="relative">
              <motion.button
                onClick={() => copyToClipboard(codeExamples[activeTab as keyof typeof codeExamples], activeTab)}
                className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors z-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copiedStates[activeTab] ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </motion.button>

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SyntaxHighlighter
                  language={tabs.find(t => t.id === activeTab)?.language || 'bash'}
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.5'
                  }}
                >
                  {codeExamples[activeTab as keyof typeof codeExamples]}
                </SyntaxHighlighter>
              </motion.div>
            </div>
          </motion.div>

          {/* API Endpoints */}
          {/* <motion.div
            className="mt-12 bg-white rounded-2xl shadow-xl border border-[var(--border-light)] p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-[var(--text-black)] mb-6">Available Endpoints</h3>
            
            <div className="space-y-4">
              {[
                {
                  method: 'POST',
                  endpoint: '/v1/translate',
                  description: 'Translate Ayush terms to ICD-11 codes',
                  status: 'Production Ready'
                },
                {
                  method: 'GET',
                  endpoint: '/v1/search',
                  description: 'Search available terminology mappings',
                  status: 'Production Ready'
                },
                {
                  method: 'GET',
                  endpoint: '/v1/validate',
                  description: 'Validate ICD-11 codes and FHIR resources',
                  status: 'Production Ready'
                },
                {
                  method: 'GET',
                  endpoint: '/v1/batch',
                  description: 'Process multiple translations in batch',
                  status: 'Coming Soon'
                }
              ].map((endpoint, index) => (
                <motion.div
                  key={endpoint.endpoint}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-[var(--border-light)] hover:shadow-md transition-all duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                      endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono text-gray-700">
                      https://api.medbridge.health{endpoint.endpoint}
                    </code>
                    <span className="text-sm text-gray-600">{endpoint.description}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    endpoint.status === 'Production Ready' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {endpoint.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
}