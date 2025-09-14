"use client";

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import TechnicalSpecs from '@/components/TechnicalSpecs';
import EnterpriseReady from '@/components/EnterpriseReady';
import Footer from '@/components/Footer';
import GlobalStethoscope from '@/components/GlobalStethoscope';
import GlobalSphere from '@/components/GlobalSphere';
export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white">
      <Header />
      {/* <GlobalStethoscope /> */}
      {/* <GlobalSphere /> */}
      <Hero />
      <HowItWorks />
      <TechnicalSpecs />
      <EnterpriseReady />
      <Footer />
    </main>
  );
}