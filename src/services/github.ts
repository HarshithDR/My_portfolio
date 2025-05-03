
import type { GitHubRepository } from '@/types';

// Helper function to fetch README content
async function getReadmeContent(username: string, repoName: string, token?: string): Promise<string | null> {
    const readmeUrl = `https://api.github.com/repos/${username}/${repoName}/readme`;
    try {
        const response = await fetch(readmeUrl, {
            headers: {
                Accept: 'application/vnd.github.raw+json', // Fetch raw content
                ...(token && { Authorization: `Bearer ${token}` }), // Use Bearer token
                'X-GitHub-Api-Version': '2022-11-28'
            },
            next: { revalidate: 3600 } // Cache README content as well
        });

        if (response.ok) {
            return await response.text();
        }

        // Log specific errors for debugging
        if (response.status === 404) {
            // console.log(`No README found for ${username}/${repoName} (404).`); // Reduce noise
        } else if (response.status === 403) {
            // 403 Forbidden often indicates rate limiting or permission issues
            console.warn(`Failed to fetch README for ${username}/${repoName}: ${response.status} ${response.statusText}. Check GITHUB_PAT validity, permissions, and rate limits.`);
        } else {
            // Log other non-OK statuses as errors
            console.error(`Failed to fetch README for ${username}/${repoName}: ${response.status} ${response.statusText}`);
        }
        return null; // Return null for any non-OK response

    } catch (error) {
        console.error(`Network or other error fetching README for ${username}/${repoName}:`, error);
        return null;
    }
}


/**
 * Asynchronously retrieves a list of public GitHub repositories for a given username, including README content.
 * Uses a Personal Access Token (PAT) for potentially higher rate limits.
 *
 * @param username The GitHub username.
 * @returns A promise that resolves to an array of GitHubRepository objects. Returns an empty array if the initial repo list fetch fails due to rate limits or other errors.
 * @throws {Error} Only if the GitHub PAT is explicitly required but not configured (optional, depending on policy).
 */
export async function getGitHubRepositories(username: string): Promise<GitHubRepository[]> {
  const token = process.env.GITHUB_PAT;

  // Decide if PAT is strictly required. If so, uncomment the error throw.
  // if (!token) {
  //   throw new Error('GITHUB_PAT environment variable is not set. Cannot fetch GitHub repositories.');
  // }

  if (!token) {
    console.warn('GITHUB_PAT environment variable is not set. GitHub API requests will be unauthenticated and may hit rate limits faster, potentially causing 403 errors.');
  }


  const reposUrl = `https://api.github.com/users/${username}/repos?type=owner&sort=updated&per_page=100`; // Fetch more repos, sort by update

  let repositories: GitHubRepository[] = [];

  try {
    console.log("Fetching GitHub repositories list...");
    const response = await fetch(reposUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(token && { Authorization: `Bearer ${token}` }), // Use Bearer token
        'X-GitHub-Api-Version': '2022-11-28'
      },
      next: { revalidate: 3600 } // Revalidate repo list cache
    });

    if (!response.ok) {
         // Handle 403 rate limit specifically by logging and returning empty
         if (response.status === 403) {
            const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
            const rateLimitReset = response.headers.get('x-ratelimit-reset');
            const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString() : 'unknown';
            console.error(`GitHub API Rate Limit Reached (403 Forbidden). Remaining: ${rateLimitRemaining ?? 'N/A'}, Resets at: ${resetTime}. Returning empty repo list.`);
             // Instead of throwing, return empty array and let the component handle the error state
             return []; // <<< Return empty array on rate limit
         }
         // Log other errors but also return empty to prevent stopping the page
         console.error(`GitHub API request failed for repo list: ${response.status} ${response.statusText}. Returning empty repo list.`);
         return []; // <<< Return empty array on other fetch errors
    }

    const data: any[] = await response.json();
    console.log(`Fetched ${data.length} repositories. Filtering forks and fetching READMEs...`);

    const repoPromises = data
      .filter(repo => !repo.fork) // Exclude forks
      .map(async (repo: any) => {
          const readmeContent = await getReadmeContent(username, repo.name, token);
          return {
            id: repo.id.toString(),
            name: repo.name,
            description: repo.description || 'No description available.',
            url: repo.html_url,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updatedAt: repo.updated_at,
            readmeContent: readmeContent,
          };
      });

    console.log("Waiting for all README fetches to complete...");
    repositories = await Promise.all(repoPromises);
    console.log("All README fetches complete.");

    repositories.sort((a, b) => b.stars - a.stars);

    console.log(`Returning ${repositories.length} non-fork repositories with READMEs.`);
    return repositories;

  } catch (error: any) { // Catch any unexpected errors during the process
    console.error("Unexpected error during GitHub repositories fetch process:", error);
    // Re-throw or return empty array based on desired behavior for unexpected issues
    // Returning empty here allows the page to potentially still render manual projects
    return [];
  }
}
