"use client";
import BackButton from './components/BackButton';
import { usePathname } from 'next/navigation';
import ClientWrapper from '@/components/ClientWrapper';
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideBackButton = pathname === '/' || pathname === '/abha';
  return (
    <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans relative`}>
      {!hideBackButton && <BackButton />}
      <ClientWrapper>
        {children}
      </ClientWrapper>
    </body>
  );
}
