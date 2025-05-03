
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar, // Import useSidebar hook
} from '@/components/ui/sidebar';
import { navItems, socialLinks } from '@/config/nav'; // Import shared nav config
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/layout/ThemeToggle'; // Import ThemeToggle
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const [currentYear, setCurrentYear] = React.useState<number | null>(null);
  const { state } = useSidebar(); // Get state directly

  React.useEffect(() => {
     // Ensure this runs only on the client
     setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    // Apply aria-label for accessibility
    <Sidebar collapsible="icon" variant="sidebar" aria-label="Main Navigation Sidebar">
      {/* Header now contains title and theme toggle on separate lines */}
      <SidebarHeader className="flex flex-col p-2"> {/* Changed flex direction */}
         {/* Title Links Container */}
         <div className="flex items-center justify-between w-full">
             {/* Link container for Expanded Title */}
             <div className="flex items-center flex-grow min-w-0 mr-2 group-data-[collapsible=icon]:hidden">
                <Link href="/" className="text-xl font-bold text-primary hover:text-accent transition-colors truncate" aria-label="Homepage">
                    Harshith's Portfolio
                </Link>
             </div>
              {/* Link for Icon-only Title */}
             <Link href="/" className="text-lg font-bold text-primary hover:text-accent transition-colors hidden group-data-[collapsible=icon]:block flex-shrink-0 mr-auto" aria-label="Homepage">
                    HP
             </Link>
             {/* Trigger button remains inline with icon title when collapsed */}
              {/* No ThemeToggle here */}
         </div>

         {/* Theme Toggle - On next line, centered, hidden when collapsed */}
         <div className={cn("w-full flex justify-center pt-2", state === 'collapsed' && "hidden")}>
             <ThemeToggle />
         </div>
      </SidebarHeader>

      <SidebarContent className="p-2 flex-grow">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.name}
                className={cn(
                   "justify-start",
                   pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
         <SidebarSeparator className="my-4"/>
         {/* Social Links Section */}
          <SidebarMenu>
              <SidebarMenuItem>
                <p className="px-2 text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">Connect</p>
              </SidebarMenuItem>
              {socialLinks.map((link) => (
                 <SidebarMenuItem key={link.name}>
                     <SidebarMenuButton
                        asChild
                        tooltip={link.name}
                        className="justify-start"
                      >
                         <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                            <link.icon className="h-5 w-5" />
                            <span>{link.name}</span>
                         </a>
                     </SidebarMenuButton>
                 </SidebarMenuItem>
              ))}
          </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-sidebar-border">
         {/* Footer content like copyright */}
         <div className="text-center text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden pt-2">
            {currentYear !== null ? (
              <p>
                 &copy; {currentYear} Harshith D. Ravi.<br/> All rights reserved.
              </p>
            ) : (
               <div className="h-8 w-32 mx-auto"> {/* Centering the skeleton */}
                 <Skeleton className="h-4 w-3/4 mx-auto mb-1" />
                 <Skeleton className="h-3 w-1/2 mx-auto" />
               </div>
            )}
         </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
