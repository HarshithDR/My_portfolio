
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'; // Added SheetClose
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react'; // Removed PanelLeftClose as it's not used
import { navItems, socialLinks } from '@/config/nav'; // Import navItems and socialLinks
import { Separator } from '../ui/separator'; // Ensure Separator is imported
import { cn } from '@/lib/utils'; // Ensure cn is imported
import { ThemeToggle } from '@/components/layout/ThemeToggle'; // Import ThemeToggle

const MobileHeader: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  // Function to determine if a link is active on the single mobile page
  // Note: This basic check might need refinement if hash changes aren't perfectly tracked
  const isMobileLinkActive = (hash: string) => {
     if (typeof window === 'undefined') return false;
     // Check if the current path is the root and the hash matches
     return pathname === '/' && window.location.hash === hash;
  };

  return (
     // Make header sticky, full width, and only visible on mobile
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
       {/* Mobile Menu Trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8"> {/* Smaller icon button */}
            <Menu className="h-5 w-5" /> {/* Smaller icon */}
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        {/* Added SheetHeader and SheetTitle */}
        <SheetContent side="left" className="w-[300px] bg-sidebar p-0 flex flex-col">
            {/* Removed redundant close button from header */}
            <SheetHeader className="p-4 border-b">
                 <SheetTitle className="text-lg font-bold text-primary">Navigation</SheetTitle>
                 {/* The default 'X' close button from SheetContent is used */}
            </SheetHeader>

            {/* Scrollable content area */}
            <div className="flex-grow overflow-y-auto p-4">
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                      // Use hash links for mobile navigation within the single page
                       const mobileHref = `/${item.href === '/' ? '' : '#' + item.href.substring(1)}`; // Convert /about to /#about, etc. Keep / as /
                       const isActive = isMobileLinkActive(mobileHref.substring(1)); // Check active state based on hash

                      return (
                          <Button
                            key={item.name}
                            asChild
                            // Use isActive check for mobile variant
                            variant={isActive ? 'secondary' : 'ghost'}
                            className="justify-start"
                            onClick={() => setIsOpen(false)}
                          >
                            {/* Use mobileHref for Link */}
                            <Link href={mobileHref}>
                              <item.icon className="mr-2 h-5 w-5" />
                              {item.name}
                            </Link>
                          </Button>
                      );
                   })}
                </nav>

                 {/* Social Links Section - Keep this as external links */}
                 <Separator className="my-4 bg-sidebar-border" />
                 <nav className="flex flex-col gap-2">
                     <p className="px-2 text-xs font-medium text-muted-foreground">Connect</p>
                     {socialLinks.map((link) => (
                         <Button
                             key={link.name}
                             asChild
                             variant='ghost'
                             className="justify-start"
                             onClick={() => setIsOpen(false)}
                         >
                             <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                                 <link.icon className="mr-2 h-5 w-5" />
                                 {link.name}
                             </a>
                         </Button>
                     ))}
                 </nav>
            </div>
             {/* Footer section for ThemeToggle - Kept at bottom of sheet */}
             {/* <div className="p-4 border-t border-sidebar-border mt-auto">
                 <ThemeToggle />
             </div> */}
        </SheetContent>
      </Sheet>

       {/* Centered Logo/Title */}
       <div className="flex-grow text-center">
         <Link href="/" className="text-lg font-bold text-primary">
            Harshith's Portfolio
         </Link>
       </div>

       {/* Theme Toggle Button on the right */}
       <div className="ml-auto"> {/* Use ml-auto to push to the right */}
           <ThemeToggle />
       </div>
    </header>
  );
};

export default MobileHeader;
