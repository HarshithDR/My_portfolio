

'use client';

import React from 'react';
import AboutSection from '@/components/sections/AboutSection';
import { LazyMotion, domAnimation } from "framer-motion";

export default function AboutPage() {
  return (
    <LazyMotion features={domAnimation}>
       {/* Section is now relative and z-10 to be above global background */}
       <div className="relative z-10">
         <AboutSection />
       </div>
    </LazyMotion>
  );
}
