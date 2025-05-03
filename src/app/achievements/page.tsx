

'use client';

import React from 'react';
import AchievementsSection from '@/components/sections/AchievementsSection';
import { LazyMotion, domAnimation } from "framer-motion";

export default function AchievementsPage() {
  return (
    <LazyMotion features={domAnimation}>
      {/* Section is now relative and z-10 to be above global background */}
      <div className="relative z-10">
        <AchievementsSection />
      </div>
    </LazyMotion>
  );
}
