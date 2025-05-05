'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react'; // Added FileText icon
import MathSymbolBackground from '@/components/layout/MathSymbolBackground';
import { cn } from '@/lib/utils';
import { socialLinks } from '@/config/nav';
import { useIsMobile } from '@/hooks/use-mobile';
import heroData from '@/data/hero.json'; // Import hero data
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog" // Import Dialog components
import PdfViewer from '@/components/ui/pdf-viewer'; // Import the new PDF viewer

const HeroSection: React.FC = () => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayTextLeft, setDisplayTextLeft] = useState('');
  const [displayTextRight, setDisplayTextRight] = useState('');
  const [isTypingLeft, setIsTypingLeft] = useState(true);
  const [isTypingRight, setIsTypingRight] = useState(true);
  const isMobile = useIsMobile();

  const roles = heroData.roles;
  const currentLeftText = roles[currentRoleIndex].left;
  const currentRightText = roles[currentRoleIndex].right;

  useEffect(() => {
    const roleInterval = setInterval(() => {
      setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
      setDisplayTextLeft('');
      setDisplayTextRight('');
      setIsTypingLeft(true);
      setIsTypingRight(true);
    }, 5000);

    return () => clearInterval(roleInterval);
  }, [roles.length]);

   useEffect(() => {
     if (!isTypingLeft) return;
     if (displayTextLeft.length < currentLeftText.length) {
       const timeoutId = setTimeout(() => {
         setDisplayTextLeft(currentLeftText.slice(0, displayTextLeft.length + 1));
       }, 70);
       return () => clearTimeout(timeoutId);
     } else {
       setIsTypingLeft(false);
     }
   }, [displayTextLeft, currentLeftText, isTypingLeft]);

   useEffect(() => {
     // Start typing right only after left is done
     if (!isTypingRight || isTypingLeft) return;
     if (displayTextRight.length < currentRightText.length) {
       const timeoutId = setTimeout(() => {
         setDisplayTextRight(currentRightText.slice(0, displayTextRight.length + 1));
       }, 50);
       return () => clearTimeout(timeoutId);
     } else {
       setIsTypingRight(false);
     }
   }, [displayTextRight, currentRightText, isTypingRight, isTypingLeft]);

  return (
    <section
      id="home"
      className="h-[calc(100vh-56px)] md:h-[calc(100vh)] flex flex-col items-center justify-center text-center p-4 md:p-8 bg-transparent scroll-mt-20 relative z-10 overflow-hidden"
    >
        {/* Background is handled by MathSymbolBackground in RootLayout */}

        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative z-10 mb-4"
        >
           <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-primary shadow-lg">
              <Image
                src={heroData.profileImage.src}
                alt={heroData.profileImage.alt}
                width={192} // Adjusted width for slightly larger image
                height={192} // Adjusted height
                className="object-cover w-full h-full"
                data-ai-hint={heroData.profileImage.aiHint || 'profile picture'}
                priority
              />
           </div>
        </motion.div>

      <motion.div
        className="mb-4 text-primary relative z-10 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
      >
         {/* Greeting only on desktop */}
         <span className="hidden md:block text-4xl md:text-6xl font-normal text-foreground/80">{heroData.greeting}</span>
         {/* Name on its own line */}
         <h1 className="block text-5xl md:text-7xl font-bold">{heroData.name}</h1>
      </motion.div>

       {/* Animated text container */}
       <div className="flex items-center justify-center min-h-[5rem] relative z-10 overflow-hidden min-w-[350px] md:min-w-[700px] px-2">
        <span className="inline-block text-lg md:text-xl text-foreground text-right w-1/2 pr-1">
           {displayTextLeft}
           <span className={cn("inline-block w-0.5 h-5 md:h-6 bg-accent ml-1 align-middle", isTypingLeft ? 'animate-pulse' : 'opacity-0')}></span>
        </span>
        <span className="mx-2 text-lg md:text-xl text-accent font-light">|</span>
         <span className="inline-block text-lg md:text-xl text-foreground text-left w-1/2 pl-1">
           {displayTextRight}
            <span className={cn("inline-block w-0.5 h-5 md:h-6 bg-accent ml-1 align-middle", !isTypingLeft && isTypingRight ? 'animate-pulse' : 'opacity-0')}></span>
         </span>
       </div>

       {/* Container for buttons */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="relative z-10 mt-8 flex flex-col sm:flex-row gap-4" // Use flex layout
      >
        {/* Explore Projects Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all duration-300 ease-in-out hover:shadow-accent/40 hover:shadow-xl transform hover:-translate-y-0.5"
              >
              <Link href={heroData.buttonLink} className="flex items-center">
                 {heroData.buttonText} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
        </motion.div>

         {/* View Resume Button wrapped in Dialog */}
         <Dialog>
            <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                   {/* The trigger button */}
                   <Button
                       size="lg"
                       variant="outline"
                       className="border-accent text-accent hover:bg-accent/10 shadow-lg transition-all duration-300 ease-in-out hover:shadow-accent/40 hover:shadow-xl transform hover:-translate-y-0.5"
                     >
                     View Resume <FileText className="ml-2 h-5 w-5" />
                   </Button>
                </motion.div>
            </DialogTrigger>
            {/* The content of the dialog (modal) */}
            <DialogContent className="max-w-4xl h-[85vh] p-0 flex flex-col">
               {/* Added a DialogHeader for accessibility and context */}
               <DialogHeader className="p-4 border-b bg-muted/50">
                  <DialogTitle className="text-lg font-semibold text-primary">Resume - Harshith Deshalli Ravi</DialogTitle>
               </DialogHeader>
               {/* The PDF viewer takes up the remaining space */}
               <div className="flex-grow overflow-hidden">
                  {/* Pass the correct path to the resume file */}
                  <PdfViewer file="/resume.pdf" />
               </div>
            </DialogContent>
         </Dialog>
      </motion.div>

       {/* Social links only on mobile */}
       {isMobile && (
          <motion.div
            className="relative z-10 mt-8 flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {socialLinks.map((link) => (
               <Button key={link.name} asChild variant="ghost" size="icon" className="text-foreground hover:text-accent h-8 w-8">
                 <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                   <link.icon className="h-5 w-5" />
                 </a>
               </Button>
            ))}
          </motion.div>
       )}
    </section>
  );
};

export default HeroSection;
