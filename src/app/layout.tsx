import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthGuard } from '@/components/auth-guard';

export const metadata: Metadata = {
  title: 'YEGLEEL Event Management System',
  description: 'Enterprise-grade event management and ticketing platform.',
  keywords: 'event management, enterprise events, ticket management, YEGLEEL',
  openGraph: {
    title: 'YEGLEEL Event Management System',
    description: 'Enterprise-grade event management platform',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AuthGuard>
          {children}
        </AuthGuard>
        <Toaster />
      </body>
    </html>
  );
}
