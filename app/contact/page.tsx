

'use client';

import React from 'react';
import ContactSection from '@/components/sections/ContactSection';
import { LazyMotion, domAnimation } from "framer-motion";

export default function ContactPage() {
  return (
    <LazyMotion features={domAnimation}>
       {/* Section is now relative and z-10 to be above global background */}
       <div className="relative z-10">
         <ContactSection />
       </div>
    </LazyMotion>
  );
}
