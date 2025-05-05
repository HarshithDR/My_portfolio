
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
// Removed Experience type import as it's inferred from JSON
import experiencesData from '@/data/experience.json'; // Import JSON data

const ExperienceSection: React.FC = () => {
   const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
      },
    }),
  };

  return (
    <section
      id="experience"
      className="py-12 md:py-16 px-4 md:px-8 bg-transparent scroll-mt-20"
    >
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">Work Experience</h2>
        <div className="relative pl-8 md:pl-10 border-l-2 border-accent">
          {experiencesData.map((exp, index) => ( // Use experiencesData from JSON
             <motion.div
              key={index} // Use index as key since IDs aren't in the JSON structure provided
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="mb-12 last:mb-0"
             >
               <span className="absolute -left-[1.1rem] md:-left-[1.35rem] mt-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-accent ring-8 ring-background">
                 <Briefcase className="h-4 w-4 text-accent-foreground" />
               </span>
               <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-border rounded-xl overflow-hidden bg-card ml-4 md:ml-6">
                 <CardHeader className="p-4 md:p-6">
                   <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                     <CardTitle className="text-xl md:text-2xl font-semibold text-primary">{exp.title}</CardTitle>
                     <span className="text-sm text-muted-foreground mt-1 sm:mt-0">{exp.period}</span>
                   </div>
                   <CardDescription className="text-base md:text-lg font-medium text-foreground">
                     {exp.company} {exp.location && ` - ${exp.location}`}
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="p-4 md:p-6 pt-0">
                   <ul className="list-disc list-outside pl-5 space-y-2 text-sm md:text-base text-foreground/90">
                     {exp.description.map((point, i) => (
                       <li key={i}>{point}</li>
                     ))}
                   </ul>
                 </CardContent>
               </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
