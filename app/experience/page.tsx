

'use client';

import React from 'react';
import ExperienceSection from '@/components/sections/ExperienceSection';
import { LazyMotion, domAnimation } from "framer-motion";

export default function ExperiencePage() {
  return (
    <LazyMotion features={domAnimation}>
       {/* Section is now relative and z-10 to be above global background */}
       <div className="relative z-10">
         <ExperienceSection />
       </div>
    </LazyMotion>
  );
}
