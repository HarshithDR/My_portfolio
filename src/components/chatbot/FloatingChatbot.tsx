
'use client';

import React from 'react';
import { Bot, MessageSquare } from 'lucide-react'; // Added MessageSquare
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover" // Import Popover components
import Chatbot from './Chatbot'; // Import the main Chatbot UI

interface FloatingChatbotProps {
  context: {
    resumeText: string;
    githubUsername?: string;
    linkedinProfileUrl?: string;
  };
}

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ context }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline" // Using outline to better fit standard floating buttons, but keeping primary colors
          size="icon"
          className="fixed bottom-6 right-6 z-50 rounded-full h-16 w-16 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus-visible:ring-accent border-primary/50 flex items-center justify-center hover:scale-110 transition-transform duration-200" // Increased size and added hover effect
          aria-label="Open Chatbot"
        >
           <Bot className="h-8 w-8" /> {/* Slightly larger icon */}
        </Button>
      </PopoverTrigger>
      {/* Popover Content - Styled as a floating window */}
      <PopoverContent
        side="top" // Open above the button
        align="end" // Align to the right edge of the button
        sideOffset={10} // Add some space between button and popover
        className="w-[380px] h-[550px] p-0 rounded-xl shadow-2xl bg-background border border-border flex flex-col overflow-hidden" // Custom size, remove padding, add flex-col
        >
         {/* Header for the popover */}
         <div className="p-4 border-b bg-muted/50 flex items-center justify-between shrink-0">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
               <MessageSquare className="h-5 w-5 text-accent" /> Portfolio Assistant
            </h3>
            {/* Optional: Add a close button if Popover doesn't provide one easily */}
            {/* <PopoverClose asChild><Button variant="ghost" size="icon"><X className="h-4 w-4" /></Button></PopoverClose> */}
         </div>
         {/* Chatbot component takes remaining space and handles scrolling */}
          <div className="flex-grow overflow-hidden">
            <Chatbot context={context} />
          </div>
      </PopoverContent>
    </Popover>
  );
};

export default FloatingChatbot;
