
'use client';

import React, { useState, useEffect } from 'react';
import FloatingChatbot from './FloatingChatbot'; // Import the original component

interface ClientOnlyFloatingChatbotProps {
  context: {
    resumeText: string;
    githubUsername?: string;
    linkedinProfileUrl?: string;
  };
}

/**
 * Wrapper component to ensure FloatingChatbot is only rendered on the client-side
 * after hydration is complete, preventing potential hydration mismatches.
 */
const ClientOnlyFloatingChatbot: React.FC<ClientOnlyFloatingChatbotProps> = ({ context }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted state to true only after the component has mounted on the client
    setIsMounted(true);
  }, []); // Empty dependency array ensures this runs once on mount

  if (!isMounted) {
    // Return null during server-side rendering and initial client-side render before mount
    // This prevents the component from being part of the initial HTML diff
    return null;
    // Optional: Render a placeholder or skeleton if needed during loading
    // return <div className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-muted animate-pulse"></div>;
  }

  // Once mounted on the client, render the actual FloatingChatbot component
  return <FloatingChatbot context={context} />;
};

export default ClientOnlyFloatingChatbot;
