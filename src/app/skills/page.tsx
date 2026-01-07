

'use client';

import React from 'react';
import SkillsSection from '@/components/sections/SkillsSection';
import { LazyMotion, domAnimation } from "framer-motion";
import ScrollDownIndicator from '@/components/ui/scroll-down-indicator';

export default function SkillsPage() {
  return (
    <LazyMotion features={domAnimation}>
       {/* Section is now relative and z-10 to be above global background */}
       <div className="relative z-10">
         <SkillsSection />
       </div>
    </LazyMotion>
  );
}
