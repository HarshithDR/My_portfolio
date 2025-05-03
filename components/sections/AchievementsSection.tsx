
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Added CardDescription
import { Award, CheckCircle, Activity } from 'lucide-react'; // Added Activity icon
import { motion } from 'framer-motion';
import type { Achievement, Certification } from '@/types';
import { Button } from '@/components/ui/button'; // Added Button

// Updated Achievements Data - includes specific wins and general participation
const achievements: Achievement[] = [
    {
        id: 'wildhacks-mlh-winner',
        title: 'Wild Hacks MLH Hackathon Winner (1st Place)',
        description: 'Won 1st place in Wild Hacks MLH 2025. Built an edge device for long-distance forest fire detection, using a fine-tuned GenAI model deployed on Raspberry Pi.',
        icon: Award, // Specific icon for wins
    },
    {
        id: 'orahacks-winner',
        title: 'OraHacks Hackathon Winner (1st Place)',
        description: 'Won 1st place in Chicago OraHacks 2024. Constructed a multimodal AI video generation system integrating news scraping and rapid video production, finishing in 48 hours.',
        icon: Award, // Specific icon for wins
    },
    {
        id: 'tiktok-finalist',
        title: 'TikTok TechJam Hackathon Finalist (Top 10)',
        description: 'Reached Top 10 in TikTok TechJam 2024 (USA section). Secured position for Gen AI project, ranking among the top 0.3% of global participants.',
        icon: Award, // Specific icon for finalists/top placements
    },
     {
        id: 'googleai-finalist',
        title: 'Google AI Hackathon Finalist (Top 25)',
        description: 'Reached top 25 in Google AI hackathon 2024.',
         icon: Award,
    },
    {
        id: 'ksit-runnerup',
        title: 'KSIT State Hackathon Runner-up (2nd Place)',
        description: 'Won 2nd place in Ksit State India Hackathon 2022.',
        icon: Award,
    },
    {
        id: 'global-third',
        title: 'Global Academy State Hackathon (3rd Place)',
        description: 'Won 3rd place in Global Academy State India Hackathon 2022.',
        icon: Award,
    },
];

// List of attended hackathons in reverse chronological order
const attendedHackathons = [
    "Northwestern University Hacks - 2025", // Added new hackathon
    "Wild Hacks MLH - 2025",
    "TikTok TechJam - 2024",
    "Snowflake-Streamlit Hackathon - 2024",
    "Microsoft Generative AI Hackathon - 2024",
    "Google AI Hackathon - 2024",
    "Scarlet-Hacks - 2024",
    "OraHacks Chicago - 2024",
    "KSIT Gamathon - 2023",
    "Global Academy of Technology State India Hackathon - 2023",
    "Mysore Institute of Technology State India Hackathon - 2022",
    "Reva Hackathon - 2022",
    "KSIT State India Hackathon - 2022",
    "Global Academy of Technology State India Hackathon - 2022",
];


const certifications: Certification[] = [
    { name: 'Fine-tuning Large Language Models', issuer: 'DeepLearning.AI' },
    { name: 'Building Systems with the ChatGPT API', issuer: 'DeepLearning.AI' }, // Assuming specific certs
    { name: 'LangChain for LLM Application Development', issuer: 'DeepLearning.AI' },
    { name: 'Building Generative AI Applications with Gradio', issuer: 'DeepLearning.AI' }, // Assuming
    { name: 'Docker Essentials', issuer: 'Udemy / LinuxAcademy' }, // Assuming source
    { name: 'Retrieval Augmented Generation (RAG)', issuer: 'Udemy / DeepLearning.AI' }, // Assuming source
];

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

  return (
    <section
      id="achievements"
      className="py-12 md:py-16 px-4 md:px-8 bg-transparent scroll-mt-20" // Changed background to transparent
    >
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Achievements Column */}
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary flex items-center justify-center gap-3">
                    <Award className="h-8 w-8 text-accent" /> Achievements
                </h2>
                <div className="space-y-6">
                    {achievements.map((ach, index) => (
                        <motion.div
                            key={ach.id} // Use ID for key
                            custom={index}
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }} // Adjust viewport amount
                        >
                           <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-border rounded-xl overflow-hidden bg-card flex flex-col h-full">
                                <CardHeader className="p-4 bg-muted/30 border-b flex flex-row items-center gap-3"> {/* Added flex layout */}
                                    {/* Conditionally render icon or default Award */}
                                    {ach.icon ? <ach.icon className="h-5 w-5 text-accent flex-shrink-0" /> : <Award className="h-5 w-5 text-accent flex-shrink-0" />}
                                    <CardTitle className="text-lg font-semibold text-primary">{ach.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 text-sm text-foreground/90 flex-grow">
                                    <CardDescription>{ach.description}</CardDescription>
                                </CardContent>
                           </Card>
                        </motion.div>
                    ))}
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
