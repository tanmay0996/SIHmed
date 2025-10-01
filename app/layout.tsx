import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import AppLayoutClient from './AppLayoutClient';
import { SpeedInsights } from '@vercel/speed-insights/next';


export const metadata: Metadata = {
  title: 'MedBridge API - Dual-Code Ayush Diagnoses with WHO ICD-11',
  description: 'Lightweight terminology micro-service enabling seamless integration between Ayush diagnoses (NAMASTE) and WHO ICD-11 standards. FHIR R4 certified for modern healthcare systems.',
  keywords: 'Ayush, ICD-11, FHIR R4, medical coding, terminology service, healthcare API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </head>
      <AppLayoutClient>{children}</AppLayoutClient>
      <SpeedInsights />
    </html>
  );
}