// src/components/ClientFormattedDate.tsx
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for placeholder

interface ClientFormattedDateProps {
  dateString: string;
  className?: string; // Allow passing className
}

const ClientFormattedDate: React.FC<ClientFormattedDateProps> = ({ dateString, className }) => {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs only on the client, after the initial render
    try {
      // Format the date only after component mounts on the client
      setFormattedDate(format(new Date(dateString), 'MMMM d, yyyy'));
    } catch (e) {
      console.error("Error formatting date:", e);
      setFormattedDate("Invalid Date"); // Fallback
    }
  }, [dateString]); // Re-run if the date string changes

  // Render placeholder or null during SSR and initial client render
  if (formattedDate === null) {
    // Use a skeleton that matches the approximate size and style
    return <Skeleton className={`h-4 w-24 ${className}`} />;
  }

  // Render the formatted date once available
  return <p className={className}>{formattedDate}</p>;
};

export default ClientFormattedDate;
