import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import './globals.css';
import AppContextProvider from './AppContext';
import { ClerkProvider } from '@clerk/nextjs';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});
const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'AI Verse - Effortless Content Creation for Maximum Impact',
  description:
    'Boost your content strategy with AI Verse – the ultimate tool for creating high-quality, SEO-optimized content. With real-time analytics, customizable templates, and flexible plans, elevate your workflow and achieve powerful results today!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <ClerkProvider>
          <AppContextProvider>{children}</AppContextProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
