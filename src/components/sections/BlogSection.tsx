
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Rss, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Blog } from '@/types';
// Removed Medium service import
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import ClientFormattedDate from '@/components/ClientFormattedDate'; // Import the new component

// Static blog data provided by the user
const staticBlogs: Blog[] = [
  {
    id: 'cuda-install-guide',
    title: 'Installing CUDA is not that hard!',
    link: 'https://medium.com/@harshithdr10/installing-cuda-is-not-that-hard-5886deff812c',
    date: '2024-01-15T00:00:00Z', // Assign a placeholder date
    summary: 'A straightforward guide to installing NVIDIA CUDA drivers and toolkit, simplifying a process often perceived as complex.',
    imageUrl: `https://picsum.photos/seed/cuda-install/600/400`, // Placeholder image
    aiHint: 'nvidia cuda gpu code',
  },
   {
    id: 'run-deepseek-android',
    title: 'Run Deepseek-r1 model on android locally!',
    link: 'https://medium.com/@harshithdr10/run-deepseek-model-on-android-locally-f0198948905a',
    date: '2024-03-10T00:00:00Z', // Placeholder date
    summary: 'Explore how to run the Deepseek-r1 language model directly on your Android device for local AI capabilities.',
    imageUrl: `https://picsum.photos/seed/deepseek-android/600/400`,
    aiHint: 'android phone ai model',
  },
   {
    id: 'deepseek-qwen-broken',
    title: 'Deepseek r1 qwen1.5b model is broken!',
    link: 'https://medium.com/@harshithdr10/deepseek-r1-qwen1-5b-model-is-broken-8691ccbd4025',
    date: '2024-04-05T00:00:00Z', // Placeholder date
    summary: 'Investigating issues and potential problems encountered with the Deepseek r1 Qwen 1.5b language model.',
    imageUrl: `https://picsum.photos/seed/deepseek-broken/600/400`,
    aiHint: 'broken code ai model',
  },
  // Add more static blog posts here if needed in the future
];


const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading static data
    setIsLoading(true);
    setError(null);
    // Use a timeout to mimic network request time if desired, otherwise load instantly
    const timer = setTimeout(() => {
        // Sort blogs by date descending before setting state
        const sortedBlogs = staticBlogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setBlogs(sortedBlogs);
        setIsLoading(false);
    }, 500); // 0.5 second delay, adjust as needed

    return () => clearTimeout(timer); // Cleanup timer on unmount

  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <section
      id="blogs" // Changed id to blogs
      className="py-12 md:py-16 px-4 md:px-8 bg-transparent scroll-mt-20" // Changed background to transparent
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary flex items-center justify-center gap-3">
           <Rss className="h-8 w-8 text-accent" /> Blogs / Articles from Medium
        </h2>

        {isLoading && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(staticBlogs.length || 1)].map((_, i) => ( // Use staticBlogs length for skeleton count
                 <Card key={i} className="shadow-lg border border-border rounded-xl overflow-hidden bg-card">
                    <Skeleton className="w-full h-48" />
                    <CardHeader>
                       <Skeleton className="h-6 w-3/4 mb-2" />
                       <Skeleton className="h-4 w-1/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter>
                         <Skeleton className="h-8 w-24" />
                    </CardFooter>
                 </Card>
              ))}
           </div>
        )}

        {error && (
          <Card className="text-center p-8 bg-card border border-destructive rounded-xl shadow-md">
              <CardTitle className="text-xl text-destructive">{error}</CardTitle>
              <CardDescription className="mt-2">
                  Please check your internet connection or try again later.
              </CardDescription>
          </Card>
        )}

        {!isLoading && !error && blogs.length === 0 && (
            <Card className="text-center p-8 bg-card border rounded-xl shadow-md">
                <CardTitle className="text-xl text-muted-foreground">No Blog Posts Yet</CardTitle>
                <CardDescription className="mt-2">
                    Looks like I haven't posted anything on Medium yet. Stay tuned!
                </CardDescription>
                 <div className="mt-6 flex justify-center">
                     <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 border-4 border-accent border-t-transparent rounded-full opacity-30"
                     />
                 </div>
            </Card>
        )}

        {!isLoading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <Card className="flex flex-col h-full overflow-hidden shadow-lg border border-border rounded-xl bg-card hover:shadow-xl transition-shadow duration-300">
                  {blog.imageUrl && (
                    <div className="relative w-full h-48">
                      <Image
                        src={blog.imageUrl}
                        alt={blog.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint={blog.aiHint || 'abstract blog topic'}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                   {/* Fallback if no image */}
                  {!blog.imageUrl && (
                       <div className="relative w-full h-48 bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center">
                          <Rss className="h-12 w-12 text-muted-foreground opacity-50" />
                       </div>
                  )}
                  <div className="flex flex-col justify-between flex-grow p-4 md:p-6">
                      <div>
                         <CardHeader className="p-0 mb-3">
                           <CardTitle className="text-lg md:text-xl font-semibold text-primary line-clamp-2">{blog.title}</CardTitle>
                           {/* Use ClientFormattedDate component here */}
                           <ClientFormattedDate
                             dateString={blog.date}
                             className="text-xs text-muted-foreground pt-1"
                           />
                         </CardHeader>
                         <CardContent className="p-0 mb-4">
                           <CardDescription className="text-sm text-foreground/90 line-clamp-4">
                               {blog.summary}
                           </CardDescription>
                         </CardContent>
                      </div>
                      <CardFooter className="p-0 mt-auto">
                        <Button asChild variant="link" className="text-accent p-0 hover:text-accent/80">
                          <a href={blog.link} target="_blank" rel="noopener noreferrer">
                            Read on Medium <ExternalLink className="ml-1 h-4 w-4" />
                          </a>
                        </Button>
                      </CardFooter>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
