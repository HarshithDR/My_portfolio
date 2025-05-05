
'use client';

import React from 'react';
import { Card } from '@/components/ui/card'; // Removed unused imports
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, MapPin, Phone, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import contactData from '@/data/contact.json'; // Import JSON data

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Mail: Mail,
    Phone: Phone,
    MapPin: MapPin,
    Linkedin: Linkedin,
    Github: Github,
    BrainCircuit: BrainCircuit, // Keep if used, otherwise remove
    // Add other icons here if needed
};


const ContactSection: React.FC = () => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const itemVariants = {
      hidden: { opacity: 0, x: -20 },
      visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
          delay: i * 0.1,
        },
      }),
  };

  const getIconComponent = (iconName: string | undefined): React.ComponentType<{ className?: string }> => {
    return iconName ? (iconMap[iconName] || Mail) : Mail; // Default to Mail icon
  };


  return (
    <section
      id="contact"
      className="py-12 md:py-16 px-4 md:px-8 bg-transparent scroll-mt-20"
    >
      <div className="container mx-auto max-w-3xl text-center">
        <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8 text-primary"
            variants={itemVariants} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}
        >
            {contactData.title}
        </motion.h2>
        <motion.p
            className="text-lg text-foreground/80 mb-10"
            variants={itemVariants} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}
        >
          {contactData.description}
        </motion.p>

        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
           <Card className="shadow-xl border border-border rounded-xl overflow-hidden bg-card p-6 md:p-10 text-left">
              <div className="space-y-6">
                 {contactData.contactInfo.map((item, index) => {
                    const ContactIcon = getIconComponent(item.icon); // Get icon component
                    return (
                        <motion.div
                            key={item.label}
                            className="flex items-center gap-4"
                            custom={index + 2}
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                        >
                           <ContactIcon className="h-6 w-6 text-accent flex-shrink-0" />
                           {item.href && item.isLink !== false ? (
                             <a
                               href={item.href}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-base md:text-lg text-foreground hover:text-accent transition-colors break-all"
                               aria-label={item.label}
                             >
                               {item.text}
                             </a>
                           ) : (
                             <span className="text-base md:text-lg text-foreground break-all">{item.text}</span>
                           )}
                        </motion.div>
                     );
                  })}
              </div>
           </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
