
'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { useTheme } from '@/components/layout/ThemeProvider';
import ClientThemeProvider from '@/components/layout/ClientThemeProvider';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import ClientOnlyFloatingChatbot from '@/components/chatbot/ClientOnlyFloatingChatbot';
import MobileHeader from '@/components/layout/MobileHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import MathSymbolBackground from '@/components/layout/MathSymbolBackground';
import { Analytics } from "@vercel/analytics/react";
import heroData from '@/data/hero.json'; // Import hero data (might be used elsewhere)
import chatbotData from '@/data/chatbot.json'; // Import chatbot data

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

// --- Placeholder Components ---
const LoadingPlaceholder = () => (
  <div className="flex flex-col md:flex-row w-full min-h-screen">
    {/* Placeholder Header (Mobile) */}
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden w-full">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-6 w-11" />
    </header>
    {/* Placeholder Sidebar (Desktop) */}
    <div className="hidden md:flex flex-col w-64 h-screen border-r bg-sidebar p-2">
       <div className="flex flex-col p-2">
         <div className="flex items-center justify-between w-full mb-2">
            <Skeleton className="h-6 w-32"/>
         </div>
          <div className="w-full flex justify-center pt-1">
             <Skeleton className="h-6 w-11" />
          </div>
       </div>
       <div className="flex-grow space-y-2 p-2">
         {[...Array(7)].map((_, i) => (
           <div key={i} className="flex items-center gap-2 p-1">
             <Skeleton className="h-5 w-5"/>
             <Skeleton className="h-5 w-24"/>
           </div>
         ))}
          <Skeleton className="h-px w-full my-3"/>
          <div className="flex items-center gap-2 p-1 text-xs font-medium text-muted-foreground">Connect</div>
          {[...Array(4)].map((_, i) => (
           <div key={i+7} className="flex items-center gap-2 p-1">
             <Skeleton className="h-5 w-5"/>
             <Skeleton className="h-5 w-24"/>
           </div>
         ))}
       </div>
        <div className="mt-auto p-2 border-t border-sidebar-border">
           <Skeleton className="h-8 w-full" />
       </div>
    </div>
    {/* Placeholder Main Content */}
    <main className="flex-grow p-4 pt-14 md:pt-4 md:pl-64 relative z-10">
        <Skeleton className="h-full w-full" />
    </main>
  </div>
);

// Helper hook to access resolved theme safely on client
const useClientResolvedTheme = () => {
  const { resolvedTheme } = useTheme();
  const [clientResolvedTheme, setClientResolvedTheme] = useState<string | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setClientResolvedTheme(resolvedTheme);
  }, [resolvedTheme]);

  return { isClient, resolvedTheme: clientResolvedTheme };
};

// Wrapper component to access Sidebar context and Theme context
const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { state: sidebarState } = useSidebar();
  const { isClient, resolvedTheme } = useClientResolvedTheme();
  const isMobile = useIsMobile();

  const getPaddingClass = () => {
    if (!isClient) return 'pt-14 md:pt-0';
    if (isMobile) {
      return 'pt-14';
    }
    return sidebarState === 'expanded' ? 'md:pl-64' : 'md:pl-12';
  };

  const symbolColor = useMemo(() => {
      if (!isClient) return 'hsl(210 15% 18% / 0.6)';
      return resolvedTheme === 'dark' ? 'hsl(210 10% 85% / 0.6)' : 'hsl(210 15% 18% / 0.6)';
  }, [resolvedTheme, isClient]);


  return (
    <div className="flex-grow relative">
        <MathSymbolBackground
           className="fixed inset-0 z-0"
           symbolColor={symbolColor}
           symbolCount={50} // Increased count
           speed={0.5} // Adjusted speed
           fontSize={20} // Adjusted font size
        />
        <main className={cn(
            'relative z-10 min-h-screen',
            getPaddingClass(),
            isClient && !isMobile && 'transition-[padding-left] duration-300 ease-in-out'
        )}>
          {children}
        </main>
    </div>
  );
};

// --- Main Application Layout Component ---
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  return (
    <ClientThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        <SidebarProvider defaultOpen={!isMobile}>
          <div className="flex flex-col md:flex-row w-full">
            {isMobile ? <MobileHeader /> : <AppSidebar />}
            <MainContent>
              {children}
            </MainContent>
          </div>
          <ClientOnlyFloatingChatbot context={chatbotData} />
        </SidebarProvider>
        <Toaster />
        <Analytics />
    </ClientThemeProvider>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>{/* Remove any whitespace between tags inside head */}
        <title>Harshith's Portfolio</title>
        <meta name="description" content="Portfolio of Harshith Deshalli Ravi, AI/ML Engineer and Data Scientist." />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased flex flex-col md:flex-row', inter.variable)}>
            <Suspense fallback={<LoadingPlaceholder />}>
              <AppLayout>{children}</AppLayout>
            </Suspense>
      </body>
    </html>
  );
}
