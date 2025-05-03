

'use client';

import React from 'react';
import ProjectsSection from '@/components/sections/ProjectsSection';
import { LazyMotion, domAnimation } from "framer-motion";

export default function ProjectsPage() {
  return (
    <LazyMotion features={domAnimation}>
       {/* Section is now relative and z-10 to be above global background */}
       <div className="relative z-10">
         <ProjectsSection />
       </div>
    </LazyMotion>
  );
}
