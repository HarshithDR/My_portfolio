
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Loader2, GitBranch, Server, AlertCircle } from 'lucide-react'; // Added AlertCircle
import { motion } from 'framer-motion';
import type { Project, GitHubRepository, ProjectCategory } from '@/types';
import projectsData from '@/data/projects.json';
import { getGitHubRepositories } from '@/services/github';
import { categorizeProject, ProjectCategorizationInput, ProjectCategorizationOutput } from '@/ai/flows/categorize-project-flow'; // Import AI categorization flow
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Define categories array including new ones
const projectCategories: readonly ProjectCategory[] = ["Featured", "AI", "Machine Learning", "Data Analysis", "Web/Cloud", "Robotics", "Other"];

// Define a type that includes the possibility of multiple categories
type CategorizedProjectItem = (Project | GitHubRepository) & { id: string; categories?: ProjectCategory[]; isCategorizing?: boolean };


const ProjectsSection: React.FC = () => {
  const [manualProjects] = useState<Project[]>(projectsData);
  const [githubRepos, setGithubRepos] = useState<GitHubRepository[]>([]);
  const [categorizedProjects, setCategorizedProjects] = useState<CategorizedProjectItem[]>([]); // Holds combined and categorized projects
  const [isLoadingGithub, setIsLoadingGithub] = useState(true);
  const [isCategorizing, setIsCategorizing] = useState(false); // Separate state for categorization process
  const [categorizationProgress, setCategorizationProgress] = useState(0);
  const [totalToCategorize, setTotalToCategorize] = useState(0);
  const [error, setError] = useState<string | null>(null); // Store error message
  const [activeTab, setActiveTab] = useState<ProjectCategory>("Featured");

  // Effect to fetch GitHub repositories (includes README content)
  useEffect(() => {
    const fetchRepos = async () => {
      setIsLoadingGithub(true);
      setError(null); // Clear previous errors
      console.log("Starting GitHub repo fetch (including READMEs)...");
      try {
        const repos = await getGitHubRepositories('HarshithDR');

        // Check if the service returned an empty array (potentially due to rate limit or other handled error)
        if (repos.length === 0 && githubRepos.length === 0) { // Check previous state too
           // Check if manual projects exist to determine if it's a complete failure or just GitHub part
           if (manualProjects.length > 0) {
               setError("Could not load GitHub projects due to API limits or errors. Displaying manually added projects only.");
               console.warn("GitHub fetch returned empty, possibly due to rate limits. Proceeding with manual projects.");
           } else {
               setError("Failed to load any project data. Please check GitHub API status or try again later.");
               console.error("GitHub fetch returned empty and no manual projects found.");
           }
        } else if (repos.length > 0) {
            console.log(`GitHub repo fetch complete. Found ${repos.length} repos.`);
            setGithubRepos(repos);
        }
        // If repos is empty but manual projects exist, we don't set an error here, proceed with manual

      } catch (err: any) { // Catch only *unexpected* errors not handled by the service
        console.error("Unexpected error during GitHub repositories fetch:", err);
        setError(err.message || "An unexpected error occurred while loading GitHub projects.");
      } finally {
        setIsLoadingGithub(false);
      }
    };
    fetchRepos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Added manualProjects to dependency array if its state could change, otherwise keep empty

  // Combine manual and GitHub projects - This runs once manual/github data is ready
  const allProjects = useMemo<CategorizedProjectItem[]>(() => {
    const combined: CategorizedProjectItem[] = manualProjects.map(p => ({
      ...p,
      id: p.id, // Ensure ID is present
      categories: p.category ? [p.category] : undefined,
      isCategorizing: !p.category || p.category !== "Featured" // Mark for AI categorization if not Featured
    }));

    const manualIds = new Set(manualProjects.map(p => p.id));

    // Only add github repos if the fetch didn't result in an error state preventing it
    if (githubRepos.length > 0) {
        githubRepos.forEach(repo => {
          const repoId = repo.id.toString(); // Ensure ID is string
          if (!manualIds.has(repoId)) {
            combined.push({
              ...repo,
              id: repoId,
              title: repo.name,
              link: repo.url,
              technologies: repo.language ? [repo.language] : [],
              imageUrl: `https://picsum.photos/seed/${repo.name}/400/300`,
              aiHint: `${repo.language || 'code'} abstract technology`,
              categories: undefined, // Needs categorization
              isCategorizing: true, // Mark for AI categorization
            });
          }
        });
    }
    console.log(`Combined ${combined.length} projects (manual + available GitHub).`);
    return combined;
  }, [manualProjects, githubRepos]); // Removed error dependency here


  // Effect to initialize categorizedProjects state when allProjects is ready
  useEffect(() => {
    // Initialize only if not loading, projects are combined, and state isn't already set
    if (!isLoadingGithub && allProjects.length > 0 && categorizedProjects.length === 0) {
      console.log("Initializing categorized projects state with combined data.");
      setCategorizedProjects(allProjects);
    }
     // If loading is done, no GitHub repos were fetched (due to error/rate limit),
     // but manual projects exist and state is empty, initialize with manual projects.
     else if (!isLoadingGithub && githubRepos.length === 0 && manualProjects.length > 0 && categorizedProjects.length === 0) {
        console.log("Initializing categorized projects state with manual data only (GitHub fetch failed).");
        setCategorizedProjects(
            manualProjects.map(p => ({
                ...p,
                id: p.id,
                categories: p.category ? [p.category] : undefined,
                isCategorizing: !p.category || p.category !== "Featured"
            }))
        );
     }

  }, [allProjects, isLoadingGithub, categorizedProjects.length, manualProjects, githubRepos.length]);


   // Function to update a single project's category in the state
   const updateProjectInState = useCallback((projectId: string, newCategories: ProjectCategory[]) => {
      setCategorizedProjects(prevProjects =>
        prevProjects.map(proj =>
          proj.id === projectId
            ? { ...proj, categories: newCategories, isCategorizing: false }
            : proj
        )
      );
      setCategorizationProgress(prev => prev + 1);
   }, []);


   // Effect to run AI categorization in parallel after data is fetched and state initialized
   useEffect(() => {
      // Only run if GitHub loading is done, state is initialized, and not already categorizing
      // AND categorization hasn't hit an error previously that prevents it
      if (isLoadingGithub || categorizedProjects.length === 0 || isCategorizing ) { // Removed || error dependency here, let it try categorization even if fetch had *warnings*
        return;
      }

       // Filter projects that still need categorization (isCategorizing flag is true)
       const projectsToCategorize = categorizedProjects.filter(p => p.isCategorizing === true);


       if (projectsToCategorize.length === 0) {
           // console.log("No projects need AI categorization or all categorization is complete.");
           if (isCategorizing) setIsCategorizing(false); // Ensure state is reset if somehow stuck
           return; // Exit if no projects need categorization
       }

       const runAICategorizationParallel = async () => {
            console.log(`Starting parallel AI categorization for ${projectsToCategorize.length} projects...`);
            setIsCategorizing(true);
            setCategorizationProgress(0);
            setTotalToCategorize(projectsToCategorize.length);
            // Don't clear fetch errors here, but allow categorization to proceed if possible

            const categorizationTasks = projectsToCategorize.map(async (project) => {
                const input: ProjectCategorizationInput = {
                    name: project.title || project.name,
                    description: project.description ?? null,
                    technologies: 'technologies' in project ? project.technologies : (project.language ? [project.language] : []),
                    // Use optional chaining and provide null if link/url is undefined
                    githubUrl: ('url' in project ? project.url : project.link) ?? null,
                    readmeContent: project.readmeContent ?? null,
                };
                try {
                    const result: ProjectCategorizationOutput = await categorizeProject(input);
                    updateProjectInState(project.id, result.categories);
                    return { id: project.id, categories: result.categories };
                } catch (err: any) {
                    console.error(`Error categorizing project "${project.title || project.name}":`, err);
                    updateProjectInState(project.id, ["Other"]);
                    // Set error state *only* for categorization-specific errors
                    setError(prev => prev || `Error during AI categorization: ${err.message || 'Unknown error'}. Some projects defaulted to 'Other'.`);
                    return { id: project.id, categories: ["Other" as ProjectCategory], error: true };
                }
            });

             try {
                await Promise.all(categorizationTasks);
                console.log("All parallel AI categorization tasks have finished processing.");
             } catch (overallError: any) {
                console.error("An unexpected error occurred during parallel categorization:", overallError);
                 setError(prev => prev || `An error occurred during project categorization: ${overallError.message || 'Unknown error'}.`);
             } finally {
                setIsCategorizing(false);
                 console.log("Categorization process complete.");
             }
       };

       runAICategorizationParallel();

   // Dependencies adjustment: Run when loading finishes, or categorizedProjects array ref changes, or update function changes.
   // Avoid dependency on `error` here to allow categorization attempt even with fetch warnings/errors.
   // Also avoid `isCategorizing` dependency to prevent loops.
   }, [isLoadingGithub, categorizedProjects, updateProjectInState]);


  // Filter projects based on the active tab using the latest categorizedProjects state
  const filteredProjects = useMemo(() => {
    return categorizedProjects.filter(project => {
       const currentCategories = project.categories ?? (project.category ? [project.category] : (project.isCategorizing ? [] : ["Other"]));

      if (activeTab === "Featured") {
        return currentCategories.includes("Featured");
      }
       // Exclude Featured projects from non-Featured tabs
      return !currentCategories.includes("Featured") && currentCategories.includes(activeTab);
    });
  }, [categorizedProjects, activeTab]);


  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
      },
    }),
  };

  // Show loading skeleton only during the initial GitHub fetch AND if there's no error
   const showInitialLoadingSkeleton = isLoadingGithub && categorizedProjects.length === 0 && !error;
   // Show categorization progress indicator when AI is running
   const showCategorizationIndicator = isCategorizing;


  return (
    <section
      id="projects"
      className="py-12 md:py-16 px-4 md:px-8 bg-transparent scroll-mt-20"
    >
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-primary">Projects</h2>

         {/* Initial GitHub Loading Skeleton */}
          {showInitialLoadingSkeleton && (
            <div className="flex flex-col items-center justify-center space-y-4 my-12 p-8 bg-muted/50 rounded-lg border border-border shadow-sm">
                <div className="flex items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <GitBranch className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-primary">
                    Fetching projects from GitHub...
                </p>
                <p className="text-sm text-muted-foreground text-center">
                    Gathering repository data and READMEs. Please wait...
                </p>
                <Skeleton className="h-2 w-64 rounded-full mt-2" />
            </div>
          )}

          {/* Show General Fetch/Categorization Error Message */}
            {error && !isLoadingGithub && ( // Show error only after loading attempt finishes
                <Card className="text-center p-8 bg-destructive/10 border border-destructive rounded-xl shadow-md my-8">
                    <div className="flex justify-center items-center mb-3">
                        <AlertCircle className="h-8 w-8 text-destructive mr-3" />
                        <CardTitle className="text-xl text-destructive">Error Loading Projects</CardTitle>
                    </div>
                    <CardDescription className="mt-2 text-destructive/90">
                        {error}
                    </CardDescription>
                     {/* Optionally suggest checking PAT or trying later */}
                     {error.includes("403") && <p className="text-xs text-destructive/80 mt-2">Please ensure your GitHub PAT is valid and has 'public_repo' scope, or try again later if this is a rate limit issue.</p>}
                </Card>
            )}


         {/* Tabs and Content (Show after initial GitHub fetch attempt completes, regardless of error, if manual projects exist or categorization is happening) */}
          {(!isLoadingGithub || manualProjects.length > 0 || isCategorizing) && (
             <>
                 {/* Categorization Progress Indicator */}
                 {showCategorizationIndicator && (
                   <div className="flex flex-col items-center justify-center space-y-2 my-4 p-4 bg-muted/30 rounded-lg border border-dashed border-border/50 text-center text-sm">
                     <div className="flex items-center gap-2">
                       <Server className="h-5 w-5 text-accent animate-pulse" />
                       <p className="text-primary font-medium">
                         AI Categorization in Progress... ({categorizationProgress}/{totalToCategorize})
                       </p>
                     </div>
                     <p className="text-xs text-muted-foreground">Projects will move to their categories as they are analyzed.</p>
                       {(totalToCategorize > 0) && (
                         <div className="w-48 h-1 bg-border rounded-full overflow-hidden mt-1">
                            <motion.div
                                className="h-full bg-accent rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(categorizationProgress / totalToCategorize) * 100}%` }}
                                transition={{ duration: 0.5, ease: "linear" }}
                            />
                         </div>
                       )}
                   </div>
                 )}

                 <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProjectCategory)} className="w-full mb-8">
                   <TabsList className="flex flex-wrap h-auto justify-center gap-1 md:gap-2 bg-muted/80">
                     {projectCategories.map(category => (
                       <TabsTrigger
                            key={category}
                            value={category}
                            className="py-1.5 px-2.5 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-md"
                        >
                         {category}
                       </TabsTrigger>
                     ))}
                   </TabsList>

                   {projectCategories.map(category => (
                     <TabsContent key={category} value={category} className="mt-8">
                         {/* Message when no projects are found in the category */}
                         {/* Show this message only if NOT loading and NOT categorizing and there are NO projects in the filtered list */}
                         {!isLoadingGithub && !isCategorizing && filteredProjects.length === 0 && category === activeTab && !error && (
                           <p className="text-center text-muted-foreground mt-8">No projects found in this category.</p>
                         )}
                          {/* Message when error prevented loading projects for this category */}
                          {!isLoadingGithub && !isCategorizing && filteredProjects.length === 0 && category === activeTab && error && !error.includes("AI categorization") && (
                              <p className="text-center text-destructive mt-8">Could not load projects for this category due to an error.</p>
                          )}


                         {/* Grid container for project cards */}
                         {/* Render grid if there are projects OR if categorization is ongoing */}
                          {(filteredProjects.length > 0 || isCategorizing) && (
                            <motion.div
                               key={activeTab} // Re-trigger animation on tab change
                               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                               initial="hidden"
                               animate="visible"
                               variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                             >
                               {/* Render actual project cards */}
                               {filteredProjects.map((project, index) => (
                                 <motion.div
                                   key={project.id}
                                   custom={index}
                                   variants={cardVariants}
                                 >
                                   <Card className="flex flex-col h-full overflow-hidden shadow-md border border-border rounded-lg bg-card hover:shadow-lg transition-shadow duration-300">
                                     <div className="relative w-full h-36">
                                       <Image
                                          src={project.imageUrl ?? `https://picsum.photos/seed/${project.name || project.id}/400/300`}
                                          alt={project.title || project.name}
                                          fill
                                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                          style={{ objectFit: 'cover' }}
                                          data-ai-hint={project.aiHint || ('language' in project && project.language ? `${project.language} code project` : 'project technology abstract')}
                                          priority={index < 4}
                                       />
                                       {project.isCategorizing && (
                                           <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                                               <Loader2 className="h-5 w-5 animate-spin text-primary"/>
                                           </div>
                                       )}
                                     </div>
                                     <div className="flex flex-col p-3 justify-between flex-grow">
                                       <div>
                                         <CardHeader className="p-0 mb-2">
                                           <CardTitle className="text-base md:text-lg font-semibold text-primary line-clamp-2">{project.title || project.name}</CardTitle>
                                           <div className="flex flex-wrap gap-1 mt-1 min-h-[18px]">
                                                {project.isCategorizing ? (
                                                    <Skeleton className="h-4 w-16 rounded-full"/>
                                                ) : (
                                                    project.categories?.filter(cat => cat !== "Featured").map(cat => (
                                                        <Badge key={cat} variant="outline" className="text-[10px] px-1.5 py-0.5">{cat}</Badge>
                                                    ))
                                                )}
                                                {/* Show 'Other' if no categories and not currently categorizing */}
                                                {!project.isCategorizing && (!project.categories || project.categories.length === 0 || (project.categories.length === 1 && project.categories[0] === "Featured")) && activeTab !== "Featured" && (
                                                     <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">Other</Badge>
                                                )}
                                           </div>
                                         </CardHeader>
                                         <CardContent className="p-0 mb-3">
                                            <CardDescription className="text-xs md:text-sm text-foreground/80 line-clamp-3 mb-2">
                                                {project.description || 'No description available.'}
                                            </CardDescription>
                                             {(project.technologies && project.technologies.length > 0) && (
                                                <>
                                                   <h4 className="font-semibold mb-1 text-[10px] text-muted-foreground uppercase tracking-wider">Tech:</h4>
                                                   <div className="flex flex-wrap gap-1">
                                                      {project.technologies.slice(0, 5).map((tech, idx) => (
                                                         <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0.5">{tech}</Badge>
                                                      ))}
                                                       {project.technologies.length > 5 && (
                                                           <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">+{project.technologies.length - 5}</Badge>
                                                       )}
                                                   </div>
                                                </>
                                             )}
                                         </CardContent>
                                       </div>
                                       <CardFooter className="p-0 mt-auto">
                                          {(project.link || ('url' in project && project.url)) && (
                                             <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary text-xs h-7 px-2"
                                                asChild
                                              >
                                                <a href={project.link || ('url' in project ? project.url : '#')} target="_blank" rel="noopener noreferrer">
                                                   {(project.link?.includes('github.com') || ('url' in project && project.url?.includes('github.com'))) ? 'GitHub' : 'Details'}
                                                    <ExternalLink className="ml-1 h-3 w-3" />
                                                </a>
                                             </Button>
                                          )}
                                       </CardFooter>
                                     </div>
                                   </Card>
                                 </motion.div>
                               ))}
                                {/* Add skeleton cards if categorizing and more projects might appear */}
                                {isCategorizing && totalToCategorize > categorizedProjects.filter(p => !p.isCategorizing).length && (
                                   [...Array(3)].map((_, i) => (
                                      <Card key={`skeleton-${i}`} className="flex flex-col h-full overflow-hidden shadow-md border border-border rounded-lg bg-card">
                                         <Skeleton className="w-full h-36" />
                                         <div className="flex flex-col p-3 justify-between flex-grow">
                                             <div>
                                                 <CardHeader className="p-0 mb-2">
                                                    <Skeleton className="h-5 w-3/4 mb-2" />
                                                    <Skeleton className="h-4 w-16 rounded-full"/>
                                                 </CardHeader>
                                                 <CardContent className="p-0 mb-3">
                                                     <Skeleton className="h-3 w-full mb-1" />
                                                     <Skeleton className="h-3 w-full mb-1" />
                                                     <Skeleton className="h-3 w-2/3 mb-2" />
                                                     <Skeleton className="h-3 w-10 mb-1"/>
                                                     <div className="flex flex-wrap gap-1">
                                                         <Skeleton className="h-4 w-10 rounded-full"/>
                                                         <Skeleton className="h-4 w-12 rounded-full"/>
                                                         <Skeleton className="h-4 w-8 rounded-full"/>
                                                     </div>
                                                 </CardContent>
                                             </div>
                                              <CardFooter className="p-0 mt-auto">
                                                 <Skeleton className="h-7 w-20" />
                                             </CardFooter>
                                         </div>
                                      </Card>
                                   ))
                                )}
                             </motion.div>
                          )}
                     </TabsContent>
                   ))}
                 </Tabs>
             </>
          )}
      </div>
    </section>
  );
};

export default ProjectsSection;
