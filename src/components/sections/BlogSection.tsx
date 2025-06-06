
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Rss, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Blog } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { scrapeMediumPost } from '@/actions/scrape-medium-action';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import staticBlogInfo from '@/data/blogs.json'; // Import static info from JSON

// Client component to format date only after mount
const ClientFormattedDate = ({ dateString, className }: { dateString: string | null, className?: string }) => {
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    useEffect(() => {
        if (dateString) {
            try {
                setFormattedDate(format(new Date(dateString), 'PPP')); // e.g., Jun 15, 2024
            } catch (e) {
                console.error("Error formatting date:", e);
                setFormattedDate("Invalid date");
            }
        } else {
             setFormattedDate(null);
        }
    }, [dateString]);

    if (!formattedDate) {
        return <Skeleton className={cn("h-3 w-24", className)} />;
    }

    return <time dateTime={dateString || undefined} className={className}>{formattedDate}</time>;
};

const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogMetadata = async () => {
      setIsLoading(true);
      setError(null);
      console.log("Starting Medium metadata fetch...");

      try {
        const metadataPromises = staticBlogInfo.map(async (info) => {
          try {
              const metadata = await scrapeMediumPost(info.link);
              return {
                  ...info,
                  imageUrl: metadata.imageUrl ?? `https://picsum.photos/seed/${info.id}/600/400`,
                  date: metadata.date ?? new Date(0).toISOString(),
              };
          } catch (scrapeError) {
              console.warn(`Could not scrape metadata for ${info.title}:`, scrapeError);
              return {
                  ...info,
                  imageUrl: `https://picsum.photos/seed/${info.id}/600/400`,
                  date: new Date(0).toISOString(),
              };
          }
        });

        const fetchedBlogs = await Promise.all(metadataPromises);
        console.log("Medium metadata fetch complete.");

        const sortedBlogs = fetchedBlogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setBlogs(sortedBlogs);
      } catch (err: any) {
        console.error("Error fetching or processing blog metadata:", err);
        setError("Failed to load blog post details. Please try again later.");
        setBlogs(staticBlogInfo.map(info => ({
             ...info,
             imageUrl: `https://picsum.photos/seed/${info.id}/600/400`,
             date: new Date(0).toISOString()
         })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogMetadata();
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
      id="blogs"
      className="py-12 md:py-16 px-4 md:px-8 bg-transparent scroll-mt-20"
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary flex items-center justify-center gap-3">
           <Rss className="h-8 w-8 text-accent" /> Blogs / Articles from Medium
        </h2>

        {isLoading && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(staticBlogInfo.length || 1)].map((_, i) => (
                 <Card key={i} className="shadow-lg border border-border rounded-xl overflow-hidden bg-card">
                    <Skeleton className="w-full h-48" />
                    <CardHeader className="p-4 md:p-6">
                       <Skeleton className="h-6 w-3/4 mb-2" />
                       <Skeleton className="h-3 w-24" />
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter className="p-4 md:p-6 pt-0">
                         <Skeleton className="h-8 w-24" />
                    </CardFooter>
                 </Card>
              ))}
           </div>
        )}

        {error && !isLoading && (
          <Card className="text-center p-8 bg-destructive/10 border border-destructive rounded-xl shadow-md">
              <div className="flex justify-center items-center mb-3">
                 <AlertCircle className="h-8 w-8 text-destructive mr-3" />
                 <CardTitle className="text-xl text-destructive">Error Loading Blogs</CardTitle>
              </div>
              <CardDescription className="mt-2 text-destructive/90">
                  {error}
              </CardDescription>
          </Card>
        )}

        {!isLoading && !error && blogs.length === 0 && (
            <Card className="text-center p-8 bg-card border rounded-xl shadow-md">
                <CardTitle className="text-xl text-muted-foreground">No Blog Posts Found</CardTitle>
                <CardDescription className="mt-2">
                    Could not find any blog posts at the moment.
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
                        priority={index < 3}
                        onError={(e) => {
                            e.currentTarget.src = `https://picsum.photos/seed/${blog.id}/600/400`;
                            e.currentTarget.srcset = "";
                          }}
                      />
                    </div>
                  )}
                  {!blog.imageUrl && (
                       <div className="relative w-full h-48 bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center">
                          <Rss className="h-12 w-12 text-muted-foreground opacity-50" />
                       </div>
                  )}
                  <div className="flex flex-col justify-between flex-grow p-4 md:p-6">
                      <div>
                         <CardHeader className="p-0 mb-3">
                           <CardTitle className="text-lg md:text-xl font-semibold text-primary line-clamp-2">{blog.title}</CardTitle>
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
