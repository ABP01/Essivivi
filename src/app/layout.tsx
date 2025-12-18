import { Outfit } from 'next/font/google';
import './globals.css';
import './custom.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { EssiviHeader, EssiviSidebar } from '@/components/essivi/layout';

const outfit = Outfit({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-outfit',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${outfit.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans antialiased">
        <ThemeProvider>
          <SidebarProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <EssiviSidebar />
              <div className="lg:pl-64">
                <EssiviHeader />
                <main className="p-4 lg:p-6">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
