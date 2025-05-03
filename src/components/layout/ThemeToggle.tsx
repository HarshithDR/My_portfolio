
'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react'; // Keep icons for visual aid next to switch
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch'; // Import Switch
import { cn } from '@/lib/utils'; // Import cn

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  // Determine the effective theme for the switch state
  // Use resolvedTheme to handle 'system' correctly after client mount
  const isDarkMode = isClient ? resolvedTheme === 'dark' : false; // Default to light theme for SSR/pre-mount

  if (!isClient) {
    // Render a placeholder or nothing during SSR/initial render to avoid hydration mismatch
    // A simple div with fixed size might be best
    return <div className="h-6 w-11"></div>; // Placeholder matching switch size
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className={cn("h-4 w-4", isDarkMode ? "text-muted-foreground" : "text-foreground")} />
      <Switch
        id="theme-toggle"
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
        // Use accent for checked (dark) and secondary for unchecked (light) for better contrast
        className={cn(
           'data-[state=checked]:bg-accent data-[state=unchecked]:bg-secondary' // Changed colors
        )}
      />
      <Moon className={cn("h-4 w-4", isDarkMode ? "text-foreground" : "text-muted-foreground")} />
    </div>
  );
}
