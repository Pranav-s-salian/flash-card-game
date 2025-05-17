import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/sidebar';
import { Providers } from '@/components/providers';
import { AnimatedBackground } from '@/components/animated-bg';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'NeuroCards | Spaced Repetition Flashcard Engine',
  description: 'A beautiful flashcard application with spaced repetition algorithm to help you learn more effectively',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AnimatedBackground />
          <Sidebar />
          <main className="sm:pl-[240px] min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}