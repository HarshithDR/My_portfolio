
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'; // Import useTheme
import type { ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // next-themes handles the script injection internally and is designed to avoid hydration mismatches.
  // We just need to ensure we pass the props correctly.
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// Export useTheme hook for components that need theme access
export { useTheme };

  
