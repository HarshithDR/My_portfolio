'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './ThemeProvider'; // Import the original provider
import type { ThemeProviderProps } from 'next-themes/dist/types';

/**
 * Wrapper component to ensure ThemeProvider and its script are only rendered
 * on the client-side after hydration, as a potential workaround for stubborn
 * hydration mismatches caused by the next-themes script.
 * Note: This might cause a brief flash of the default theme on initial load.
 */
const ClientThemeProvider: React.FC<ThemeProviderProps> = ({ children, ...props }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted state to true only after the component has mounted on the client
    setIsMounted(true);
  }, []); // Empty dependency array ensures this runs once on mount

  if (!isMounted) {
    // Return null or a basic structure during SSR and initial client render
    // This avoids rendering the provider and its script during the diff
    // Render children directly without theme context during SSR/initial mount
    // Or render a placeholder if preferred, but might cause layout shifts
    return <>{children}</>;
     // Example placeholder: return <div className="min-h-screen">{children}</div>;
  }

  // Once mounted on the client, render the actual ThemeProvider
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
};

export default ClientThemeProvider;