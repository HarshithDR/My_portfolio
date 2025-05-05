
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import aboutData from '@/data/about.json'; // Import JSON data

const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="py-12 md:py-16 px-4 md:px-8 bg-transparent scroll-mt-20"
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
          <Card className="shadow-lg overflow-hidden rounded-xl border border-border bg-card">
            <CardHeader className="bg-muted/50 p-6 border-b border-border">
              <CardTitle className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center">
                <UserCircle className="mr-3 text-accent h-8 w-8" />
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
               {/* Display the bio content from JSON */}
               <p
                 className="text-base md:text-lg leading-relaxed text-foreground whitespace-pre-line"
               >
                 {aboutData.bio}
               </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
