"use client";

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import TechnicalSpecs from '@/components/TechnicalSpecs';
import EnterpriseReady from '@/components/EnterpriseReady';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <HowItWorks />
      <TechnicalSpecs />
      <EnterpriseReady />
      <Footer />
    </main>
  );
}