
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
// Removed Education type import as it's inferred from JSON
import educationData from '@/data/education.json'; // Import JSON data

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    GraduationCap: GraduationCap,
    // Add other icons here if needed
};

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

  const getIconComponent = (iconName: string | undefined): React.ComponentType<{ className?: string }> => {
      return iconName ? (iconMap[iconName] || GraduationCap) : GraduationCap; // Default to GraduationCap
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
          {educationData.map((edu, index) => {
            const EduIcon = getIconComponent(edu.icon); // Get the icon component
            return (
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
                         <EduIcon className="h-8 w-8 text-accent flex-shrink-0" />
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
                    </CardContent>
                  </Card>
                </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
