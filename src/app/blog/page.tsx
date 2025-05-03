

'use client';

import React from 'react';
import BlogSection from '@/components/sections/BlogSection';
import { LazyMotion, domAnimation } from "framer-motion";

export default function BlogPage() {
  return (
    <LazyMotion features={domAnimation}>
       {/* Section is now relative and z-10 to be above global background */}
       <div className="relative z-10">
         <BlogSection />
       </div>
    </LazyMotion>
  );
}
