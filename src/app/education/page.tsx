
'use client';

import React from 'react';
import EducationSection from '@/components/sections/EducationSection';
import { LazyMotion, domAnimation } from "framer-motion";

export default function EducationPage() {
  return (
    <LazyMotion features={domAnimation}>
      {/* Section is now relative and z-10 to be above global background */}
      <div className="relative z-10">
        <EducationSection />
      </div>
    </LazyMotion>
  );
}
