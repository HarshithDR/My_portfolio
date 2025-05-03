
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, MapPin, Phone, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactSection: React.FC = () => {
  const contactInfo = [
    { icon: Mail, text: 'harshithdr10@gmail.com', href: 'mailto:harshithdr10@gmail.com', label: 'Email' },
    { icon: Phone, text: '(224)-566 5998', href: 'tel:+12245665998', label: 'Phone' },
    { icon: MapPin, text: 'Santa Clara, CA', href: '#', label: 'Location', isLink: false }, // No link needed for location usually
    { icon: Linkedin, text: 'linkedin.com/in/harshith-deshalli-ravi', href: 'https://linkedin.com/in/harshith-deshalli-ravi', label: 'LinkedIn Profile' },
    { icon: Github, text: 'github.com/HarshithDR', href: 'https://github.com/HarshithDR', label: 'GitHub Profile' },
  ];

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


  return (
    <section
      id="contact"
      className="py-12 md:py-16 px-4 md:px-8 bg-transparent scroll-mt-20" // Changed background to transparent
    >
      <div className="container mx-auto max-w-3xl text-center">
        <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8 text-primary"
            variants={itemVariants} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}
        >
            Get In Touch
        </motion.h2>
        <motion.p
            className="text-lg text-foreground/80 mb-10"
            variants={itemVariants} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}
        >
          I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
        </motion.p>

        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
           <Card className="shadow-xl border border-border rounded-xl overflow-hidden bg-card p-6 md:p-10 text-left">
              <div className="space-y-6">
                 {contactInfo.map((item, index) => (
                     <motion.div
                        key={item.label}
                        className="flex items-center gap-4"
                        custom={index + 2} // Continue stagger delay
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                     >
                       <item.icon className="h-6 w-6 text-accent flex-shrink-0" />
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
                 ))}
              </div>
           </Card>
        </motion.div>
         {/* Removed the "Send me an Email" button */}
      </div>
    </section>
  );
};

export default ContactSection;

