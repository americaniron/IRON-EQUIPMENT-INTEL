import type {Metadata} from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'IRON INTEL | Industrial Equipment Acquisition Intelligence',
  description: 'Deterministic exact-match public heavy equipment search and verification platform.',
  openGraph: {
    title: 'IRON INTEL | Industrial Equipment Acquisition Intelligence',
    description: 'Deterministic exact-match public heavy equipment search and verification platform.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IRON INTEL | Industrial Equipment Acquisition Intelligence',
    description: 'Deterministic exact-match public heavy equipment search and verification platform.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
         <AuthProvider>
            {children}
         </AuthProvider>
      </body>
    </html>
  );
}
