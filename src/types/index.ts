
import type React from 'react';

// Define ProjectCategory type based on the categories array including new ones
export type ProjectCategory = "Featured" | "AI" | "Machine Learning" | "Data Analysis" | "Web/Cloud" | "Robotics" | "Other";

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  aiHint?: string;
  link?: string | null; // Allow null for link
  // Changed to an array of categories
  categories?: ProjectCategory[];
  category?: ProjectCategory; // Keep single category for backward compatibility with initial JSON load if needed, but prioritize 'categories'
  readmeContent?: string | null; // Add readme content for manual projects too
}

// Type specifically for GitHub repository data fetched from the API
export interface GitHubRepository {
  id: string;
  name: string;
  description: string | null;
  url: string; // GitHub URL
  language: string | null;
  stars: number;
  forks: number;
  updatedAt?: string;
  readmeContent?: string | null;
  // Compatibility fields (optional)
  title?: string; // Use name from GitHub
  technologies?: string[]; // Will be populated from language/AI analysis
  imageUrl?: string; // Placeholder generated
  aiHint?: string; // Placeholder generated
  link?: string; // Use url from GitHub
  // Changed to an array of categories
  categories?: ProjectCategory[];
}


export interface Blog {
  id: string;
  title: string;
  date: string | null; // Date is now fetched, can be null initially or if scraping fails
  summary: string;
  imageUrl?: string | null; // Image URL is fetched, can be null
  aiHint?: string;
  link: string; // Link to the full blog post on Medium
}

export interface Skill {
  name: string;
  icon: React.ComponentType<{ className?: string }>; // SVG component
}

export interface Experience {
    title: string;
    company: string;
    period: string;
    description: string[];
    location?: string;
}

// Add Education type
export interface Education {
    id: string;
    institution: string;
    degree: string;
    major: string;
    period: string;
    location: string;
    icon?: React.ComponentType<{ className?: string }>; // Optional: icon for institution type (e.g., university)
}


export interface Certification {
  name: string;
  issuer: string;
}

// Updated Achievement type to include optional icon
export interface Achievement {
    id: string; // Add an ID for mapping keys
    title: string;
    description: string;
    icon?: React.ComponentType<{ className?: string }>; // Optional icon component
}
