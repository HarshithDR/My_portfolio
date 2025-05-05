
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Loader2, GitBranch, Server, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Project, GitHubRepository, ProjectCategory } from '@/types';
import projectsData from '@/data/projects.json'; // Import manual projects
import { getGitHubRepositories } from '@/services/github'; // Use the GitHub API service
import { categorizeProject, ProjectCategorizationInput, ProjectCategorizationOutput } from '@/ai/flows/categorize-project-flow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const projectCategories: readonly ProjectCategory[] = ["Featured", "AI", "Machine Learning", "Data Analysis", "Web/Cloud", "Robotics", "Other"];
type CategorizedProjectItem = (Project | GitHubRepository) & { id: string; categories?: ProjectCategory[]; isCategorizing?: boolean };

const PROJECTS_CACHE_KEY = 'portfolio_projects_cache';
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

interface CachedProjects {
  timestamp: number;
  projects: CategorizedProjectItem[];
}

const ProjectsSection: React.FC = () => {
  // Initial state includes only manual projects
  const [allProjects, setAllProjects] = useState<CategorizedProjectItem[]>(() =>
    projectsData.map(p => ({
      ...p,
      id: p.id,
      // Ensure manual projects with a defined category start categorized
      categories: p.category ? [p.category] : undefined,
      isCategorizing: !p.category || p.category !== "Featured" // Only categorize if not explicitly Featured
    }))
  );
  const [isLoadingGithub, setIsLoadingGithub] = useState(true);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [categorizationProgress, setCategorizationProgress] = useState(0);
  const [totalToCategorize, setTotalToCategorize] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProjectCategory>("Featured");
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Flag for initial load vs subsequent checks
  const GITHUB_USERNAME = 'HarshithDR'; // Define GitHub username

  // Effect to load from cache and fetch GitHub data on mount
  useEffect(() => {
    let isMounted = true;
    console.log("Checking project cache and fetching GitHub data...");
    setError(null);
    setIsLoadingGithub(true);
    setIsCategorizing(false); // Reset categorization state on load

    const loadAndFetch = async () => {
      let projectsFromCache: CategorizedProjectItem[] | null = null;
      let cachedTimestamp: number | null = null;
      let currentProjectList = [...projectsData.map(p => ({ ...p, id: p.id, categories: p.category ? [p.category] : undefined, isCategorizing: !p.category || p.category !== "Featured" }))]; // Start with manual projects

      // 1. Try loading from cache
      try {
        const cachedItem = localStorage.getItem(PROJECTS_CACHE_KEY);
        if (cachedItem) {
          const cachedData: CachedProjects = JSON.parse(cachedItem);
          cachedTimestamp = cachedData.timestamp;
          const now = Date.now();
          if (now - cachedData.timestamp < CACHE_TTL) {
            console.log("Cache HIT. Using cached project data initially.");
            projectsFromCache = cachedData.projects.map(p => ({ ...p, isCategorizing: false }));
             currentProjectList = projectsFromCache; // Use cached data if valid
            if (isMounted) {
              setAllProjects(currentProjectList); // Load cached data immediately
              setIsInitialLoad(false); // No longer initial load
            }
          } else {
            console.log("Cache EXPIRED.");
            localStorage.removeItem(PROJECTS_CACHE_KEY);
          }
        } else {
          console.log("Cache MISS.");
        }
      } catch (e) {
        console.error("Error reading from project cache:", e);
        localStorage.removeItem(PROJECTS_CACHE_KEY);
      }

      // 2. Fetch from GitHub API regardless of cache status (to check for updates)
      console.log(`Fetching latest projects from GitHub API for ${GITHUB_USERNAME}...`);
      let fetchedRepos: GitHubRepository[] = [];
      try {
        fetchedRepos = await getGitHubRepositories(GITHUB_USERNAME);
        console.log(`GitHub API fetch complete. Found ${fetchedRepos.length} repos.`);

      } catch (err: any) {
        console.error("Error fetching GitHub repositories via API:", err);
        if (isMounted) setError(prev => prev ? `${prev}\n${err.message}` : err.message || "An error occurred while loading GitHub projects.");
        // Continue with potentially cached or manual data
      } finally {
         if (isMounted) {
           setIsLoadingGithub(false); // Mark GitHub fetch as complete
         }
      }

      // 3. Merge and identify new projects
      if (isMounted) {
        const projectsToCategorize: CategorizedProjectItem[] = [];
        const updatedProjectList = [...currentProjectList]; // Start with current state (manual or cached)
        const currentProjectIds = new Set(updatedProjectList.map(p => p.id));

        fetchedRepos.forEach(repo => {
          const repoItem: CategorizedProjectItem = {
            ...repo,
            id: repo.id.toString(), // Use API ID as string
            isCategorizing: false // Default to not needing categorization
          };

          const existingIndex = updatedProjectList.findIndex(p => p.id === repoItem.id);

          if (existingIndex === -1) {
            // New repo found
            console.log(`New project found: ${repoItem.name}`);
            repoItem.isCategorizing = true; // Mark for categorization
            projectsToCategorize.push(repoItem);
            updatedProjectList.push(repoItem);
          } else {
             // Existing repo, update data but only mark for categorization if categories are missing
             const existingProject = updatedProjectList[existingIndex];
             updatedProjectList[existingIndex] = {
                 ...existingProject, // Keep existing data
                 ...repoItem, // Overwrite with latest API data (name, desc, etc.)
                 categories: existingProject.categories, // Keep existing categories
                 isCategorizing: !existingProject.categories, // Mark if categories are missing
             };
             if (updatedProjectList[existingIndex].isCategorizing && !projectsToCategorize.some(p => p.id === repoItem.id)) {
                  projectsToCategorize.push(updatedProjectList[existingIndex]);
             }
          }
        });

        // Add manual projects that might need initial categorization (if not loaded from cache)
         projectsData.forEach(manualProj => { // Use projectsData here
             const existingIndex = updatedProjectList.findIndex(p => p.id === manualProj.id);
             if (existingIndex !== -1 && updatedProjectList[existingIndex].isCategorizing) {
                 // Ensure manual projects needing categorization are included
                  if (!projectsToCategorize.some(p => p.id === manualProj.id)) {
                     projectsToCategorize.push(updatedProjectList[existingIndex]);
                  }
             } else if (existingIndex === -1) {
                  // Add manual project if it's somehow missing (shouldn't happen often with initial state)
                  const manualItem = { ...manualProj, id: manualProj.id, categories: manualProj.category ? [manualProj.category] : undefined, isCategorizing: !manualProj.category || manualProj.category !== "Featured" };
                  updatedProjectList.push(manualItem);
                   if (manualItem.isCategorizing) {
                       projectsToCategorize.push(manualItem);
                   }
                  console.warn(`Manual project ${manualProj.title} added as it was missing.`);
             }
         });

        // Update the main project list state immediately with merged list
        setAllProjects(updatedProjectList);

        // 4. Trigger categorization only for new/uncategorized projects
        if (projectsToCategorize.length > 0) {
            console.log(`Triggering categorization for ${projectsToCategorize.length} projects.`);
            runAICategorizationParallel(projectsToCategorize);
        } else {
             console.log("No new projects need categorization.");
             // If nothing needed categorization, save the current state to cache
             if (!projectsFromCache) { // Save only if not loaded from a valid cache initially
                updateCache(updatedProjectList);
             }
        }
      }
    };

    loadAndFetch();

    return () => {
      isMounted = false; // Cleanup flag
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount


  // Function to update a single project's category in the state
  const updateProjectInState = useCallback((projectId: string, newCategories: ProjectCategory[]) => {
    setAllProjects(prevProjects =>
      prevProjects.map(proj =>
        proj.id === projectId
          ? { ...proj, categories: newCategories, isCategorizing: false }
          : proj
      )
    );
    setCategorizationProgress(prev => prev + 1);
  }, []);

  // Function to save current project state to cache
   const updateCache = (projectsToCache: CategorizedProjectItem[]) => {
     try {
       const finalProjectsToCache = projectsToCache.map(({ isCategorizing, ...rest }) => rest); // Remove isCategorizing flag
       const cacheData: CachedProjects = {
         timestamp: Date.now(),
         projects: finalProjectsToCache,
       };
       localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(cacheData));
       console.log(`Project cache updated with ${finalProjectsToCache.length} projects.`);
     } catch (e) {
       console.error("Error writing to project cache:", e);
       // Optionally clear cache if writing fails due to size limits etc.
       // localStorage.removeItem(PROJECTS_CACHE_KEY);
     }
   };


  // Function to run AI categorization in parallel
  const runAICategorizationParallel = useCallback(async (projectsToCategorize: CategorizedProjectItem[]) => {
    if (projectsToCategorize.length === 0) return;

    console.log(`Starting parallel AI categorization for ${projectsToCategorize.length} projects...`);
    setIsCategorizing(true);
    setCategorizationProgress(0);
    setTotalToCategorize(projectsToCategorize.length);

    const categorizationTasks = projectsToCategorize.map(async (project) => {
      const input: ProjectCategorizationInput = {
        name: project.title || project.name,
        description: project.description ?? null,
        technologies: 'technologies' in project ? project.technologies : (project.language ? [project.language] : []),
        githubUrl: ('url' in project ? project.url : project.link) ?? null, // Use null if undefined
        readmeContent: project.readmeContent ?? null,
      };
      try {
        const result: ProjectCategorizationOutput = await categorizeProject(input);
        const validCategories = (result?.categories && result.categories.length > 0) ? result.categories : ["Other"];
        updateProjectInState(project.id, validCategories);
        return { id: project.id, success: true };
      } catch (err: any) {
        console.error(`Error categorizing project "${project.title || project.name}":`, err);
        updateProjectInState(project.id, ["Other"]); // Default to "Other" on error
        setError(prev => prev ? `${prev}\nError categorizing "${project.title || project.name}".` : `Error during AI categorization. Some projects defaulted to 'Other'.`);
        return { id: project.id, success: false };
      }
    });

    try {
      await Promise.all(categorizationTasks);
      console.log("Parallel AI categorization tasks finished processing.");
      // Save the final, updated state to cache
      setAllProjects(currentProjects => {
          updateCache(currentProjects); // Update cache with the latest state
          return currentProjects;
      });
    } catch (overallError: any) {
      console.error("An unexpected error occurred during parallel categorization:", overallError);
      setError(prev => prev ? `${prev}\nCategorization Error: ${overallError.message || 'Unknown'}` : `An error occurred during project categorization.`);
    } finally {
      setIsCategorizing(false);
      console.log("Categorization process complete.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateProjectInState]); // Dependencies


  // Filter projects based on the active tab
  const filteredProjects = useMemo(() => {
    return allProjects.filter(project => {
       const currentCategories = project.categories?.length ? project.categories : (project.isCategorizing ? [] : ["Other"]);

       if (activeTab === "Featured") {
         return currentCategories.includes("Featured");
       }
       return currentCategories.includes(activeTab) && !currentCategories.includes("Featured");
    });
  }, [allProjects, activeTab]);

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

  // Determine loading states
  const showInitialLoadingSkeleton = isInitialLoad && isLoadingGithub;
  const showCategorizationIndicator = isCategorizing;
  const showNoProjectsMessage = !isLoadingGithub && !isCategorizing && filteredProjects.length === 0;

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
                    Fetching latest project details from GitHub...
                </p>
                <p className="text-sm text-muted-foreground text-center">
                    Checking for new repositories and updates. Please wait...
                </p>
                <Skeleton className="h-2 w-64 rounded-full mt-2" />
            </div>
        )}

        {/* General Error Message */}
        {error && (
            <Card className="text-center p-8 bg-destructive/10 border border-destructive rounded-xl shadow-md my-8">
                <div className="flex justify-center items-center mb-3">
                    <AlertCircle className="h-8 w-8 text-destructive mr-3" />
                    <CardTitle className="text-xl text-destructive">Error Loading Projects</CardTitle>
                </div>
                <CardDescription className="mt-2 text-destructive/90 whitespace-pre-line">
                    {error}
                </CardDescription>
                 {error.includes("GitHub API") && <p className="text-xs text-destructive/80 mt-2">Some projects might be missing or outdated.</p>}
                 {error.includes("AI categorization") && <p className="text-xs text-destructive/80 mt-2">Project categorization might be incomplete.</p>}
            </Card>
        )}

        {/* Tabs and Content - Show once initial loading is done */}
        {!isLoadingGithub && (
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
                     <p className="text-xs text-muted-foreground">Categorizing new or updated projects.</p>
                       {(totalToCategorize > 0) && (
                         <div className="w-48 h-1 bg-border rounded-full overflow-hidden mt-1">
                            <motion.div
                                className="h-full bg-accent rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${totalToCategorize > 0 ? (categorizationProgress / totalToCategorize) * 100 : 0}%` }}
                                transition={{ duration: 0.5, ease: "linear" }}
                            />
                         </div>
                       )}
                   </div>
                 )}

                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProjectCategory)} className="w-full mb-8">
                    <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap h-auto justify-center gap-1 md:gap-2 bg-muted/80 p-1 rounded-lg">
                        {projectCategories.map(category => (
                            <TabsTrigger
                                key={category}
                                value={category}
                                className="py-1.5 px-2.5 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-md flex-1 lg:flex-initial text-center whitespace-nowrap rounded-md"
                            >
                                {category}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {projectCategories.map(category => (
                        <TabsContent key={category} value={category} className="mt-8">
                            {/* Message when no projects are found for the tab */}
                            {showNoProjectsMessage && category === activeTab && !error && (
                                <p className="text-center text-muted-foreground mt-8">No projects found in this category.</p>
                            )}
                            {/* Message when error might prevent loading projects for the tab */}
                            {showNoProjectsMessage && category === activeTab && error && !error.includes("AI categorization") && (
                                <p className="text-center text-destructive mt-8">Could not fully load projects for this category due to an error.</p>
                            )}

                            {/* Grid container */}
                            <motion.div
                                key={activeTab} // Re-trigger animation on tab change
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                                initial="hidden"
                                animate="visible"
                                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                            >
                                {/* Render project cards */}
                                {filteredProjects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        custom={index}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
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
                                                    onError={(e) => {
                                                        e.currentTarget.src = `https://picsum.photos/seed/${project.id}/400/300`;
                                                        e.currentTarget.srcset = "";
                                                    }}
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
                                                                (project.categories || ["Other"])
                                                                    .filter(cat => {
                                                                        if (activeTab === "Featured") return cat === "Featured";
                                                                        return cat !== "Featured";
                                                                    })
                                                                    .map(cat => (
                                                                        <Badge key={cat} variant="outline" className="text-[10px] px-1.5 py-0.5">{cat}</Badge>
                                                                    ))
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
                                {/* Skeletons for projects being categorized (visual placeholder) */}
                                {isCategorizing && Array.from({ length: totalToCategorize - categorizationProgress }).map((_, i) => (
                                     category === activeTab && // Only show skeletons on the active tab
                                     !filteredProjects.some(p => p.isCategorizing) && // Don't show if real categorizing items are already visible
                                     i < 4 && // Limit number of skeletons shown
                                     <Card key={`skeleton-${i}`} className="flex flex-col h-full overflow-hidden shadow-md border border-border rounded-lg bg-card opacity-50">
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
                                ))}
                            </motion.div>
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


    