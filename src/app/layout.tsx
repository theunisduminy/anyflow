import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AnyFlow',
  description:
    'Generate any type of diagram or flowchart using AI. Create sequence diagrams, entity relationship diagrams, gantt charts, and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          disableTransitionOnChange
        >
          <Header />
          <main className='flex-1'>{children}</main>
          <footer className='bg-transparent p-4 text-center text-sm text-gray-500'>
            {new Date().getFullYear()} © Vertiqal, all rights reserved.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
