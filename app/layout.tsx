import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

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
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>{children}</body>
    </html>
  );
}