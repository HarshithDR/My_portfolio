
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
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <FloatingChatbot context={context} />;
};

export default ClientOnlyFloatingChatbot;
