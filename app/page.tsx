
'use client'

import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import EducationSection from '@/components/sections/EducationSection'; // Import EducationSection
import AchievementsSection from '@/components/sections/AchievementsSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactSection from '@/components/sections/ContactSection';
import { LazyMotion, domAnimation } from "framer-motion";
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile hook

export default function LandingPage() {
  const isMobile = useIsMobile();

  return (
     <LazyMotion features={domAnimation}>
       {/* Always render Hero Section */}
       <HeroSection />

       {/* Conditionally render other sections only on mobile */}
       {isMobile && (
         <>
           <AboutSection />
           <SkillsSection />
           <ExperienceSection />
           <ProjectsSection />
           <EducationSection /> {/* Add Education Section */}
           <AchievementsSection />
           <BlogSection />
           <ContactSection />
         </>
       )}
    </LazyMotion>
  );
}
