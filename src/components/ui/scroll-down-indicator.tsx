'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from './sidebar';

interface ScrollDownIndicatorProps {
  className?: string;
  href?: string; // Optional href for the link
}

const ScrollDownIndicator: React.FC<ScrollDownIndicatorProps> = ({ className, href }) => {
    const isMobile = useIsMobile();
    const { state: sidebarState } = useSidebar();

    // Do not render on mobile devices
    if (isMobile) {
        return null;
    }

    const effectiveHref = href || '#'; // Default to '#' if no href is provided

    // Adjust left positioning based on sidebar state
    const getLeftPosition = () => {
        if (sidebarState === 'expanded') {
            // Half of (Viewport - SidebarWidth) + SidebarWidth
            return 'calc( (100vw - 16rem) / 2 + 16rem )';
        }
        // Half of (Viewport - CollapsedSidebarWidth) + CollapsedSidebarWidth
        return 'calc( (100vw - 3rem) / 2 + 3rem )';
    };

    return (
        <a href={effectiveHref} aria-label="Scroll down">
             <motion.div
                className={cn("fixed bottom-10 z-20 -translate-x-1/2 transition-[left] duration-300 ease-in-out", className)}
                style={{ left: getLeftPosition() }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
            >
                <motion.div
                    animate={{
                      y: [0, 8, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: 'loop',
                    }}
                >
                    <ChevronDown className="h-8 w-8 text-foreground/50" />
                </motion.div>
             </motion.div>
        </a>
    );
};

export default ScrollDownIndicator;
