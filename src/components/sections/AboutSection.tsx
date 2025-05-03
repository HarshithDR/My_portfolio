
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle } from 'lucide-react'; // Changed icon import
import { motion } from 'framer-motion';

// Static bio content provided by the user
const staticBio = `Harshith Deshalli Ravi is an AI/ML Engineer and Data Scientist passionate about building intelligent solutions. With a Master's in Data Science from the Illinois Institute of Technology and a Bachelor's in Electrical and Electronics Engineering, Harshith possesses a strong foundation in both theory and application. He excels in programming languages such as Python, C++, and JavaScript, and is proficient in frameworks like TensorFlow, PyTorch, and Langchain.

Harshith has a proven track record of impactful projects, including pioneering a Random Forest Regressor that achieved 86% accuracy for automated irrigation and optimizing a smart sprinkler system to reduce water consumption by 65%. As an AI Research Intern at the Indian Institute of Science (IISC), he engineered CNN models for real-time body-balancing and fine-tuned GPT-3 for personalized education, enhancing skill acquisition by 60%. Harshith also developed an AI product to improve accessibility for visually impaired individuals.

He's a hackathon winner, recognized for building a multimodal AI video generation system in 48 hours. Harshith streamlines AI deployment with his "one-click" platform for auto-tuning and RAG pipeline deployment on AWS, cutting API rollout time by 50% and boosting knowledge retrieval efficiency by 35%. His commitment to innovation and problem-solving drives him to create impactful AI solutions.`;


const AboutSection: React.FC = () => {

  return (
    <section
      id="about"
      className="py-12 md:py-16 px-4 md:px-8 bg-transparent scroll-mt-20" // Changed background to transparent
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div // Add motion to the card for entry animation
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
          <Card className="shadow-lg overflow-hidden rounded-xl border border-border bg-card">
            <CardHeader className="bg-muted/50 p-6 border-b border-border">
              <CardTitle className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center"> {/* Centered the title */}
                <UserCircle className="mr-3 text-accent h-8 w-8" /> {/* Changed Icon */}
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
               {/* Display the static bio content */}
               <p
                 className="text-base md:text-lg leading-relaxed text-foreground whitespace-pre-line"
               >
                 {staticBio}
               </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
