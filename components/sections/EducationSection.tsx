
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, MapPin } from 'lucide-react'; // Use GraduationCap icon
import { motion } from 'framer-motion';
import type { Education } from '@/types';

// Education data based on resume
const educationData: Education[] = [
  {
    id: 'iit',
    institution: 'Illinois Institute of Technology',
    degree: 'Master of Science',
    major: 'Data Science',
    period: 'Aug 2023 – May 2025',
    location: 'Chicago, IL', // Updated location based on IIT campus
    icon: GraduationCap,
  },
  {
    id: 'vtu',
    institution: 'Visvesvaraya Technological University',
    degree: 'Bachelor of Engineering',
    major: 'Electrical and Electronics Engineering',
    period: 'Aug 2019 – Jul 2023',
    location: 'Bengaluru, India',
    icon: GraduationCap,
  },
];

const EducationSection: React.FC = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
      },
    }),
  };

  return (
    <section
      id="education"
      className="py-12 md:py-16 px-4 md:px-8 bg-transparent scroll-mt-20"
    >
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary flex items-center justify-center gap-3">
          <GraduationCap className="h-8 w-8 text-accent" /> Education
        </h2>
        <div className="space-y-8">
          {educationData.map((edu, index) => (
            <motion.div
              key={edu.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border rounded-xl overflow-hidden bg-card">
                <CardHeader className="p-6 bg-muted/30 border-b">
                  <div className="flex items-center gap-4">
                     {edu.icon && <edu.icon className="h-8 w-8 text-accent flex-shrink-0" />}
                     <div>
                        <CardTitle className="text-xl md:text-2xl font-semibold text-primary">{edu.institution}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground flex items-center gap-1 pt-1">
                            <MapPin className="h-3 w-3" /> {edu.location}
                        </CardDescription>
                     </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-2">
                  <p className="text-lg font-medium text-foreground">{edu.degree} in {edu.major}</p>
                  <p className="text-sm text-muted-foreground">{edu.period}</p>
                  {/* Add any additional details like GPA or relevant coursework if needed */}
                   {/* <p className="text-sm text-foreground/80 mt-2">Relevant Coursework: Advanced Algorithms, Machine Learning, Big Data Technologies...</p> */}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
