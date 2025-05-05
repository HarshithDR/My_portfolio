'use server';
/**
 * @fileOverview Service for interacting with the GitHub API.
 */

import type { GitHubRepository } from '@/types';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USERNAME = 'HarshithDR'; // Your GitHub username

/**
 * Fetches the content of a repository's README file.
 * @param username The GitHub username.
 * @param repoName The name of the repository.
 * @param token Optional GitHub Personal Access Token.
 * @returns A promise resolving to the README content string or null if not found/error.
 */
async function getReadmeContent(username: string, repoName: string, token?: string): Promise<string | null> {
    const url = `${GITHUB_API_BASE}/repos/${username}/${repoName}/readme`;
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.raw+json', // Request raw content
        'X-GitHub-Api-Version': '2022-11-28'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        // console.log(`Fetching README for ${username}/${repoName}`);
        const response = await fetch(url, { headers, next: { revalidate: 3600 } }); // Cache for 1 hour

        if (response.ok) {
            const readmeText = await response.text();
            // console.log(`Successfully fetched README for ${username}/${repoName}`);
            return readmeText;
        }
        if (response.status === 404) {
            // console.log(`No README found for ${username}/${repoName}`);
            return null; // No README file
        }
        console.error(`Failed to fetch README for ${username}/${repoName}: ${response.status} ${response.statusText}`);
        return null;
    } catch (error) {
        console.error(`Error fetching README for ${username}/${repoName}:`, error);
        return null;
    }
}

/**
 * Fetches public GitHub repositories for a user using the GitHub API.
 * Includes README content fetching.
 *
 * @param username The GitHub username.
 * @returns A promise resolving to an array of GitHubRepository objects.
 */
export async function getGitHubRepositories(username: string): Promise<GitHubRepository[]> {
    const token = process.env.GITHUB_PAT;
    const url = `${GITHUB_API_BASE}/users/${username}/repos?sort=pushed&per_page=100`; // Fetch more repos, sorted by push date
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        console.warn("GITHUB_PAT environment variable not set. Making unauthenticated request to GitHub API, which has lower rate limits.");
    }

    console.log(`Fetching GitHub repositories for ${username} via API...`);

    try {
        const response = await fetch(url, { headers, next: { revalidate: 600 } }); // Cache repo list for 10 mins

        if (!response.ok) {
            // Provide more specific error for 403 (rate limit or bad token)
            if (response.status === 403) {
                const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
                const rateLimitReset = response.headers.get('x-ratelimit-reset');
                const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString() : 'unknown';
                console.error(`GitHub API Rate Limit Reached or PAT Invalid/Insufficient Permissions (403 Forbidden). Remaining: ${rateLimitRemaining ?? 'N/A'}, Resets at: ${resetTime}. Returning empty repo list. Check PAT validity and 'public_repo' scope.`);
                // Return empty array to prevent crashing the component, UI should handle this state
                return []; // <<< Return empty array on 403
            }
            // Throw generic error for other repo list fetch failures
           throw new Error(`GitHub API request failed for repo list: ${response.status} ${response.statusText}`);
       }

        const data: any[] = await response.json();
         console.log(`Successfully fetched ${data.length} repositories via API.`);

        // Filter out forks and map to our type, fetching READMEs in parallel
        const repoPromises = data
            .filter(repo => !repo.fork)
            .map(async (repo): Promise<GitHubRepository | null> => {
                const readmeContent = await getReadmeContent(username, repo.name, token);
                return {
                    id: repo.id.toString(), // Use API ID
                    name: repo.name,
                    title: repo.name, // Use name as title
                    description: repo.description,
                    url: repo.html_url,
                    link: repo.html_url, // Use html_url as link
                    language: repo.language,
                    technologies: repo.language ? [repo.language] : [],
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    updatedAt: repo.pushed_at, // Use pushed_at for last update
                    readmeContent: readmeContent,
                     // Generate placeholder image URL and AI hint based on language
                     imageUrl: `https://picsum.photos/seed/${repo.name}/400/300`,
                     aiHint: `${repo.language || 'code'} abstract technology`,
                };
            });

        const results = await Promise.all(repoPromises);
        const validRepos = results.filter(repo => repo !== null) as GitHubRepository[];

        console.log(`Processed ${validRepos.length} non-forked repositories.`);
        return validRepos;

    } catch (error: any) {
        console.error("Error fetching GitHub repositories via API:", error.message);
        // Return empty array on error so the UI doesn't crash
        return [];
    }
}