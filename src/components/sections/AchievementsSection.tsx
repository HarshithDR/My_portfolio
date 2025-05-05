
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, CheckCircle, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
// Removed Achievement, Certification type imports as they are inferred from JSON
import data from '@/data/achievements.json'; // Import the combined JSON data
import { Button } from '@/components/ui/button';

const { achievements, attendedHackathons, certifications } = data; // Destructure data

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Award: Award,
    CheckCircle: CheckCircle,
    Activity: Activity,
    // Add other icons here if needed
};

const AchievementsSection: React.FC = () => {

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  const getIconComponent = (iconName: string | undefined, defaultIcon: React.ComponentType<{ className?: string }>): React.ComponentType<{ className?: string }> => {
      return iconName ? (iconMap[iconName] || defaultIcon) : defaultIcon;
  };


  return (
    <section
      id="achievements"
      className="py-12 md:py-16 px-4 md:px-8 bg-transparent scroll-mt-20"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Achievements Column */}
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary flex items-center justify-center gap-3">
                    <Award className="h-8 w-8 text-accent" /> Achievements
                </h2>
                <div className="space-y-6">
                    {achievements.map((ach, index) => {
                        const AchievementIcon = getIconComponent(ach.icon, Award); // Get icon component
                        return (
                            <motion.div
                                key={ach.id}
                                custom={index}
                                variants={itemVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                            >
                               <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-border rounded-xl overflow-hidden bg-card flex flex-col h-full">
                                    <CardHeader className="p-4 bg-muted/30 border-b flex flex-row items-center gap-3">
                                        <AchievementIcon className="h-5 w-5 text-accent flex-shrink-0" />
                                        <CardTitle className="text-lg font-semibold text-primary">{ach.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 text-sm text-foreground/90 flex-grow">
                                        <CardDescription>{ach.description}</CardDescription>
                                    </CardContent>
                               </Card>
                            </motion.div>
                        );
                     })}
                    {/* Hackathon Participation Card */}
                    <motion.div
                        key="hackathon-participation"
                        custom={achievements.length}
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                       <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-border rounded-xl overflow-hidden bg-card flex flex-col h-full">
                            <CardHeader className="p-4 bg-muted/30 border-b flex flex-row items-center gap-3">
                                <Activity className="h-5 w-5 text-accent flex-shrink-0" />
                                <CardTitle className="text-lg font-semibold text-primary">Hackathon Participation</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 text-sm text-foreground/90 flex-grow">
                                <CardDescription>Actively participated in numerous hackathons, continuously honing skills and exploring new technologies, including:</CardDescription>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-xs text-muted-foreground">
                                    {attendedHackathons.map((hackathon, idx) => (
                                        <li key={idx}>{hackathon}</li>
                                    ))}
                                </ul>
                            </CardContent>
                       </Card>
                    </motion.div>
                </div>
            </div>

            {/* Certifications Column */}
            <div>
                 <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary flex items-center justify-center gap-3">
                     <CheckCircle className="h-8 w-8 text-accent" /> Certifications
                 </h2>
                 <div className="space-y-4">
                     {certifications.map((cert, index) => (
                         <motion.div
                           key={cert.name + index} // Composite key
                           custom={achievements.length + 1 + index} // Adjust delay index
                           variants={itemVariants}
                           initial="hidden"
                           whileInView="visible"
                           viewport={{ once: true, amount: 0.5 }}
                         >
                             <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border border-border rounded-lg overflow-hidden bg-card p-3">
                                 <div className="flex items-center gap-3">
                                     <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                     <div>
                                         <p className="text-base font-medium text-primary">{cert.name}</p>
                                         <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                                     </div>
                                 </div>
                             </Card>
                         </motion.div>
                     ))}
                 </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
