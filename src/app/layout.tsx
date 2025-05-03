'use client'; // Keep 'use client' for hooks like useIsMobile, useState, useEffect

import type { Metadata } from 'next'; // Keep type import for potential static metadata
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider, useTheme } from '@/components/layout/ThemeProvider'; // Import ThemeProvider and useTheme
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar'; // Import useSidebar
import AppSidebar from '@/components/layout/AppSidebar';
import ClientOnlyFloatingChatbot from '@/components/chatbot/ClientOnlyFloatingChatbot';
import MobileHeader from '@/components/layout/MobileHeader'; // Import MobileHeader
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile hook
import React, { useState, useEffect, useMemo, Suspense } from 'react'; // Import React hooks and Suspense
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import MathSymbolBackground from '@/components/layout/MathSymbolBackground'; // Import background

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Define context data needed for the chatbot
const chatbotContext = {
  resumeText: `
HARSHITH DESHALLI RAVI
Santa Clara, CA | (224)-566 5998 | harshithdr10@gmail.com | linkedin.com/in/harshith-deshalli-ravi | github.com/HarshithDR

EDUCATION
Illinois Institute of Technology Aug 2023 – May 2025
Master of Science in Data Science
Visvesvaraya Technological University Aug 2019 – Jul 2023
Bachelor of Electrical and Electronics Engineering

SKILLS
Programming languages: Python | C | C++ | JS | shell
Frameworks and Libraries: TensorFlow | Pytorch | NLTK | Langchain | Langgraph | MCP | Transformers | Huggingface | OpenCV
AI/ML: NLP | CNN | RL | Tokenization embeddings | LLM Fine tuning | RAG | GraphRAG| Cross-Modal-learning | PEFT | vLLM
Cloud and llmOps: git | MLflow | Docker | WandB | AWS | Sagemaker | GCP | IBM | Jenkins | Kubeflow | Airflow
DB and Big Data: Apache Spark | Hadoop | SQL | MongoDB
Math: Calculus | Time Series | Advanced Statistics

WORK EXPERIENCE
AI/ML Intern – Alpha Ventures, Bengaluru May 2022 - Apr 2023
• Pioneered a Random Forest Regressor, achieving 86% test accuracy in predictive performance for automated irrigation, working with team of 5 as project lead
• Optimized a smart sprinkler system reducing water consumption by 65% compared to traditional methods, outperforming competing “smart” solutions by 15%
AI RESERCH INTERN - Indian Institute of Science (IISC), Bengaluru Feb 2023 - Apr 2023
• Engineered CNN models integrated with IoT robotics for real-time body-balancing task guidance, boosting system accuracy and improving the learning rate by 50%
• Optimized TensorFlow Lite deployment on Raspberry Pi with AWS S3 data storage to shrink model size and enable low-latency inference, reducing cloud round-trip by 40%
• Fine-tuned GPT-3 to serve as a virtual educator and applied customized reinforcement learning algorithms, enhancing skill acquisition by 60% through adaptive, real-time feedback
Machine Learning Intern - DHI Flagship and Innovation Centre, Bengaluru Aug 2020 - Dec 2021
• Developed an AI product to assist visually impaired individuals by improving accessibility to public transportation, currency recognition, and road-crossing safety through real-time object-detection and interaction
• Created YOLOv5 and advanced Computer-Vision models (Mobilenet) deployed on edge device, achieving 95% accuracy in identifying public buses and currency denominations in diverse conditions
• Designed and integrated an audio-based interaction system on the Raspberry-Pi, enhancing user experience by reducing response time by 30% and ensuring real-time communication

PROJECT
Auto Finetune, Rag Pipeline Deployment on Aws with Jenkins
• Streamlined the training and deployment cycle through a “one-click” platform that automatically converts unstructured data into trainable formats (via Guardian models) and applies advanced tuning (LoRA, QLoRA, knowledge distillation)
• Implemented dual Retrieval-Augmented Generation (RAG) pipelines, supporting up to 1M+ data points in both standard vector DBs and graph DBs (Neo4j), boosting knowledge retrieval efficiency by 35%
• Forged Jenkins CI/CD on AWS and created an Auto-LLM deployment pipeline with LORAX, cutting post-training API rollout time by 50% and increasing inference efficiency by 70% for enterprise AI solutions
Customer Support Chatbot with RAG
• Built a GPT-4 powered chatbot leveraging Zendesk APIs for real time Auto-support ticket handling and Pinecone’s vector search for efficient knowledge retrieval, reducing manual ticket resolution time by 30%
• Established a confidence-based fallback mechanism to trigger human escalation for predictions below a 0.7 threshold, enhancing customer satisfaction
• Designed a real-time monitoring pipeline with Prometheus and Grafana to track latency, accuracy, and escalation rates, improving model performance by 15%
Social media Driven Podcast generation platform using OpenAI and ElevenLabs
• Developed a comprehensive podcast creation solution that automatically fetches data from Twitter and Reddit, reducing content-scripting time by 70% and storing user profiles in MongoDB for personalized episodes
• Streamlined Eleven Labs for speech synthesis with GPT-4 via OpenAI’s API using Replit for cloud deployment, enabling on-demand podcasts generated in under 2 minutes

ACHIEVEMENTS AND CERTIFICATIONS
• Constructed a multimodal AI video generation system integrating news scraping and rapid video production, finishing the project in 48 hours; recognized as the best out of 70 teams, winning the OraHacks hackathon
• Secured Top 10 Finalists position in TikTok TechJam Hackathon for Gen AI project, ranking among the top 0.3% of global participants
• Certifications in Fine-tuning, RAG, Docker and AI from Udemy and DeepLearning.AI
`,
  githubUsername: 'HarshithDR',
  linkedinProfileUrl: 'https://linkedin.com/in/harshith-deshalli-ravi',
};

// --- Placeholder Components ---
const LoadingPlaceholder = () => (
  <div className="flex flex-col md:flex-row w-full min-h-screen">
    {/* Placeholder Header (Mobile) */}
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden w-full">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-6" />
    </header>
    {/* Placeholder Sidebar (Desktop) */}
    <div className="hidden md:flex flex-col w-64 h-screen border-r bg-sidebar p-2">
       <div className="flex flex-col p-2"> {/* Updated header structure */}
         <div className="flex items-center justify-between w-full mb-2">
            <Skeleton className="h-6 w-32"/>
            <Skeleton className="h-6 w-6"/>
         </div>
          <div className="w-full flex justify-center pt-1"> {/* Updated theme toggle position */}
             <Skeleton className="h-6 w-11" />
          </div>
       </div>
       <div className="flex-grow space-y-2 p-2"> {/* Added padding */}
         {[...Array(7)].map((_, i) => (
           <div key={i} className="flex items-center gap-2 p-1"> {/* Reduced padding/gap */}
             <Skeleton className="h-5 w-5"/>
             <Skeleton className="h-5 w-24"/>
           </div>
         ))}
          <Skeleton className="h-px w-full my-3"/> {/* Reduced margin */}
          <div className="flex items-center gap-2 p-1 text-xs font-medium text-muted-foreground">Connect</div>
          {[...Array(4)].map((_, i) => (
           <div key={i+7} className="flex items-center gap-2 p-1">
             <Skeleton className="h-5 w-5"/>
             <Skeleton className="h-5 w-24"/>
           </div>
         ))}
         {/* No theme toggle placeholder here */}
       </div>
        <div className="mt-auto p-2 border-t border-sidebar-border">
           <Skeleton className="h-8 w-full" /> {/* Placeholder for copyright */}
       </div>
    </div>
    {/* Placeholder Main Content */}
    <main className="flex-grow p-4 pt-14 md:pt-4 md:pl-64 relative z-10"> {/* Adjusted SSR padding, added relative z-10 */}
        <Skeleton className="h-full w-full" /> {/* Placeholder for children content */}
    </main>
  </div>
);


// Wrapper component to access Sidebar context and Theme context
const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { state: sidebarState } = useSidebar();
  const { resolvedTheme } = useTheme(); // Get resolved theme
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getPaddingClass = () => {
    if (!isClient) return 'pt-14 md:pt-0'; // Default SSR padding (keep for safety)
    if (isMobile) {
      return 'pt-14'; // Mobile padding top for header
    }
    // Desktop padding left based on sidebar state
    return sidebarState === 'expanded' ? 'md:pl-64' : 'md:pl-12';
  };

  // Determine symbol color based on theme, only on client
  const symbolColor = useMemo(() => {
      if (!isClient) return 'hsl(210 15% 18% / 0.6)'; // Default light theme color for SSR (increased opacity)
      // Dark theme symbols lighter, light theme symbols darker (increased opacity)
      return resolvedTheme === 'dark' ? 'hsl(210 10% 85% / 0.6)' : 'hsl(210 15% 18% / 0.6)';
  }, [resolvedTheme, isClient]);


  return (
    <div className="flex-grow relative"> {/* Use relative positioning for z-index context */}
       {/* MathSymbolBackground moved inside MainContent to access theme */}
        <MathSymbolBackground
           className="fixed inset-0 z-0" // Position fixed behind everything
           symbolColor={symbolColor} // Pass dynamic color
           symbolCount={30}
           speed={0.5}
           fontSize={20}
        />
        {/* Main content area */}
        <main className={cn(
            'relative z-10 min-h-screen', // Content is above background, ensure min height
            getPaddingClass(),
            isClient && !isMobile && 'transition-[padding-left] duration-300 ease-in-out' // Apply transition only on desktop client-side
        )}>
          {children}
        </main>
    </div>
  );
};

// --- Main Application Layout Component ---
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile(); // Determine if mobile

  return (
    <SidebarProvider defaultOpen={!isMobile}> {/* Default open on desktop, closed on mobile */}
      <div className="flex flex-col md:flex-row w-full">
        {isMobile ? <MobileHeader /> : <AppSidebar />}
        <MainContent>
          {children}
        </MainContent>
      </div>
      {/* Floating chatbot needs high z-index */}
      <ClientOnlyFloatingChatbot context={chatbotContext} />
    </SidebarProvider>
  );
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>{/* Remove any whitespace between tags inside head */}
        <title>Harshith's Portfolio</title>
        <meta name="description" content="Portfolio of Harshith Deshalli Ravi, AI/ML Engineer and Data Scientist." />
        {/* Add other meta tags, link tags (like favicon) here */}
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased flex flex-col md:flex-row', inter.variable)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Use Suspense to handle client-side only rendering logic */}
            <Suspense fallback={<LoadingPlaceholder />}>
              <AppLayout>{children}</AppLayout>
            </Suspense>
            <Toaster />
          </ThemeProvider>
      </body>
    </html>
  );
}
