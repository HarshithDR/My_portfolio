
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Experience } from '@/types';

const experiences: Experience[] = [
    {
        title: 'AI/ML Intern',
        company: 'Alpha Ventures',
        location: 'Bengaluru',
        period: 'May 2022 - Apr 2023',
        description: [
            'Pioneered a Random Forest Regressor, achieving 86% test accuracy in predictive performance for automated irrigation, working with team of 5 as project lead.',
            'Optimized a smart sprinkler system reducing water consumption by 65% compared to traditional methods, outperforming competing “smart” solutions by 15%.',
        ],
    },
    {
        title: 'AI Research Intern',
        company: 'Indian Institute of Science (IISc)',
        location: 'Bengaluru',
        period: 'Feb 2023 - Apr 2023',
        description: [
            'Engineered CNN models integrated with IoT robotics for real-time body-balancing task guidance, boosting system accuracy and improving the learning rate by 50%.',
            'Optimized TensorFlow Lite deployment on Raspberry Pi with AWS S3 data storage to shrink model size and enable low-latency inference, reducing cloud round-trip by 40%.',
            'Fine-tuned GPT-3 to serve as a virtual educator and applied customized reinforcement learning algorithms, enhancing skill acquisition by 60% through adaptive, real-time feedback.',
        ],
    },
    {
        title: 'Machine Learning Intern',
        company: 'DHI Flagship and Innovation Centre',
        location: 'Bengaluru',
        period: 'Aug 2020 - Dec 2021',
        description: [
            'Developed an AI product to assist visually impaired individuals by improving accessibility to public transportation, currency recognition, and road-crossing safety through real-time object-detection and interaction.',
            'Created YOLOv5 and advanced Computer-Vision models (Mobilenet) deployed on edge device, achieving 95% accuracy in identifying public buses and currency denominations in diverse conditions.',
            'Designed and integrated an audio-based interaction system on the Raspberry-Pi, enhancing user experience by reducing response time by 30% and ensuring real-time communication.',
        ],
    },
];

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
      className="py-12 md:py-16 px-4 md:px-8 bg-transparent scroll-mt-20" // Changed background to transparent
    >
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">Work Experience</h2>
        <div className="relative pl-8 md:pl-10 border-l-2 border-accent">
           {/* Timeline line */}
          {experiences.map((exp, index) => (
             <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="mb-12 last:mb-0"
             >
                {/* Timeline Dot */}
               <span className="absolute -left-[1.1rem] md:-left-[1.35rem] mt-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-accent ring-8 ring-background"> {/* Changed ring color to background */}
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
