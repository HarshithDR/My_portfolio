
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
// Removed MathSymbolBackground import as it's handled globally
import { cn } from '@/lib/utils'; // Import cn
import { socialLinks } from '@/config/nav'; // Import social links
import { useIsMobile } from '@/hooks/use-mobile'; // Import mobile hook

// Define roles as pairs for split animation
const roles = [
  { left: "AI/ML Engineer", right: "Crafting Intelligent Solutions" },
  { left: "Data Scientist", right: "Building the Future with Data" },
  { left: "AI Specialist", right: "Innovator in AI/ML Applications" },
  { left: "ML Engineer", right: "Specializing in LLMs and RAG" },
];

const HeroSection: React.FC = () => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayTextLeft, setDisplayTextLeft] = useState('');
  const [displayTextRight, setDisplayTextRight] = useState('');
  const [isTypingLeft, setIsTypingLeft] = useState(true);
  const [isTypingRight, setIsTypingRight] = useState(true);
  const isMobile = useIsMobile(); // Check if mobile

  // Text for the current role
  const currentLeftText = roles[currentRoleIndex].left;
  const currentRightText = roles[currentRoleIndex].right;

  useEffect(() => {
    // Cycle through roles every 5 seconds (adjust timing as needed)
    const roleInterval = setInterval(() => {
      setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
      // Reset typing animation state for the new role
      setDisplayTextLeft('');
      setDisplayTextRight('');
      setIsTypingLeft(true);
      setIsTypingRight(true);
    }, 5000); // Change role text every 5 seconds

    return () => clearInterval(roleInterval);
  }, []);

  // Typing effect for the left part
   useEffect(() => {
     if (!isTypingLeft) return; // Stop if not typing

     if (displayTextLeft.length < currentLeftText.length) {
       const timeoutId = setTimeout(() => {
         setDisplayTextLeft(currentLeftText.slice(0, displayTextLeft.length + 1));
       }, 70); // Adjust typing speed (milliseconds)
       return () => clearTimeout(timeoutId);
     } else {
       setIsTypingLeft(false); // Finished typing this part
     }
   }, [displayTextLeft, currentLeftText, isTypingLeft]);

   // Typing effect for the right part
   useEffect(() => {
     if (!isTypingRight || isTypingLeft) return; // Start right only after left finishes

     if (displayTextRight.length < currentRightText.length) {
       const timeoutId = setTimeout(() => {
         setDisplayTextRight(currentRightText.slice(0, displayTextRight.length + 1));
       }, 50); // Adjust typing speed
       return () => clearTimeout(timeoutId);
     } else {
       setIsTypingRight(false); // Finished typing this part
     }
   }, [displayTextRight, currentRightText, isTypingRight, isTypingLeft]); // Add isTypingLeft dependency


  return (
    <section
      id="home"
      // Adjusted mobile height, ensure content is above global background with relative z-10
      className="h-[calc(100vh-56px)] md:h-[calc(100vh)] flex flex-col items-center justify-center text-center p-4 md:p-8 bg-transparent scroll-mt-20 relative z-10 overflow-hidden"
    >
        {/* Global background is handled in layout.tsx */}

        {/* Profile Image */}
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative z-10 mb-4" // Added margin-bottom
        >
            <Image
               src="https://picsum.photos/seed/profile-pic/160/160" // Increased size
               alt="Harshith Deshalli Ravi Profile Picture"
               width={160} // Increased size
               height={160} // Increased size
               className="rounded-full border-4 border-primary shadow-lg"
               data-ai-hint="professional headshot developer"
               priority // Load image faster
            />
        </motion.div>

      {/* Greeting and Name Container */}
      <motion.div // Using div instead of h1 for more layout flexibility
        className="mb-4 text-primary relative z-10 text-center" // Center text within the div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
      >
         {/* Conditional greeting for desktop - use md:block to show only on medium+ screens */}
         <span className="hidden md:block text-4xl md:text-6xl font-normal text-foreground/80">Hi, I am</span>
         {/* Name - force onto next line by making it block */}
         <h1 className="block text-5xl md:text-7xl font-bold"> {/* Use h1 semantically for the name */}
            Harshith Deshalli Ravi
         </h1>
      </motion.div>

      {/* Animated subtitle - split into left, separator, right */}
       <div className="flex items-center justify-center min-h-[5rem] relative z-10 overflow-hidden min-w-[350px] md:min-w-[700px] px-2"> {/* Increased min-height */}
        {/* Left part - Typing Animation */}
        <span className="inline-block text-lg md:text-xl text-foreground text-right w-1/2 pr-1"> {/* Adjusted font size */}
           {displayTextLeft}
           {/* Blinking cursor effect */}
           <span className={cn("inline-block w-0.5 h-5 md:h-6 bg-accent ml-1 align-middle", isTypingLeft ? 'animate-pulse' : 'opacity-0')}></span>
        </span>

        {/* Separator */}
        <span className="mx-2 text-lg md:text-xl text-accent font-light">|</span>

        {/* Right part - Typing Animation */}
         <span className="inline-block text-lg md:text-xl text-foreground text-left w-1/2 pl-1"> {/* Adjusted font size */}
           {displayTextRight}
           {/* Blinking cursor effect */}
            <span className={cn("inline-block w-0.5 h-5 md:h-6 bg-accent ml-1 align-middle", !isTypingLeft && isTypingRight ? 'animate-pulse' : 'opacity-0')}></span>
         </span>
       </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="relative z-10 mt-8" // Added margin-top for spacing
        // Add hover animation to the container div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
            asChild
            size="lg"
            // Enhanced button styling: added transition, subtle shadow/glow on hover
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all duration-300 ease-in-out hover:shadow-accent/40 hover:shadow-xl transform hover:-translate-y-0.5"
          >
          {/* Pass className directly to Link for styling the anchor tag */}
          <Link href="/projects" className="flex items-center">
             Explore My Projects <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </motion.div>

       {/* Conditionally render social links only on mobile */}
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
