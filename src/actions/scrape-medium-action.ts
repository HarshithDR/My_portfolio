
'use server';

import * as cheerio from 'cheerio';

interface ScrapedMetadata {
  imageUrl: string | null;
  date: string | null;
}

// Simple cache to avoid scraping the same URL multiple times during a request/build
// For a more robust solution, consider a proper cache store (Redis, Memcached) or Next.js Data Cache
const scrapeCache = new Map<string, ScrapedMetadata>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

/**
 * Server Action to scrape a Medium post URL for its main image and publication date.
 * Uses cheerio for HTML parsing. Includes basic caching.
 * @param url The URL of the Medium post to scrape.
 * @returns A promise resolving to an object containing the image URL and date string (ISO format), or nulls if not found/error.
 */
export async function scrapeMediumPost(url: string): Promise<ScrapedMetadata> {
  const cachedData = scrapeCache.get(url);
  if (cachedData) {
    console.log(`[Cache HIT] Returning cached metadata for ${url}`);
    return cachedData;
  }

  console.log(`[Cache MISS] Scraping metadata for ${url}`);

  try {
    const response = await fetch(url, {
      // Add headers to mimic a browser request, potentially reducing blocking
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 3600 } // Revalidate fetched HTML every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Medium post ${url}: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    let imageUrl: string | null = null;
    let date: string | null = null;

    // --- Attempt to find the main image ---
    // 1. Open Graph image meta tag (most reliable)
    imageUrl = $('meta[property="og:image"]').attr('content') || null;

    // 2. If OG image not found, try finding the first prominent image in the article body
    if (!imageUrl) {
      // Look for common Medium image structures
      const firstFigureImage = $('article figure img').first();
      if (firstFigureImage.length > 0) {
          imageUrl = firstFigureImage.attr('src') || null;
          // Sometimes Medium uses srcset, try to parse the largest image from it
          const srcset = firstFigureImage.attr('srcset');
          if (!imageUrl && srcset) {
              const sources = srcset.split(',').map(s => s.trim().split(' ')[0]);
              imageUrl = sources[sources.length - 1]; // Assume last one is largest
          }
      }
    }

    // --- Attempt to find the publication date ---
    // 1. Use the 'time' element with datetime attribute (often used for publication)
    const timeElement = $('article time[datetime]').first();
    if (timeElement.length > 0) {
      date = timeElement.attr('datetime') || null;
    }

    // 2. Fallback: Look for meta tags (less common for date on Medium directly, but worth checking)
    if (!date) {
       date = $('meta[property="article:published_time"]').attr('content') || null;
    }
     if (!date) {
        // 3. Fallback: Look for common text patterns indicating date near author info
        // This is less reliable and might need adjustments based on Medium's structure
        const dateTextElement = $('article span:contains("·")').filter((i, el) => {
            // Check if text content matches a date pattern (e.g., "MMM DD, YYYY" or "X min read")
            const text = $(el).text();
            return /\w{3}\s\d{1,2},?\s\d{4}/.test(text) || /\d+\smin\sread/.test(text);
        }).first(); // Take the first likely candidate

        if (dateTextElement.length > 0) {
             const parentText = dateTextElement.parent().text(); // Get text from parent potentially containing the date
             // Extract date-like string (this is a basic regex, might need refinement)
             const dateMatch = parentText.match(/(\w{3}\s\d{1,2},?\s\d{4})/);
             if (dateMatch && dateMatch[0]) {
                try {
                    // Attempt to parse the extracted date string
                    date = new Date(dateMatch[0]).toISOString();
                } catch (e) {
                    console.warn(`Could not parse extracted date string "${dateMatch[0]}" for ${url}`);
                    date = null;
                }
             }
        }
     }

    // Validate and potentially format the date string to ensure it's usable ISO format
    if (date) {
        try {
            date = new Date(date).toISOString();
        } catch (e) {
             console.warn(`Invalid date format found ("${date}") for ${url}. Setting date to null.`);
            date = null;
        }
    }


    const result: ScrapedMetadata = { imageUrl, date };

    // Store in cache
    scrapeCache.set(url, result);
    // Set a timer to clear the cache entry after TTL
    setTimeout(() => {
      scrapeCache.delete(url);
      console.log(`[Cache EXPIRED] Removed cached metadata for ${url}`);
    }, CACHE_TTL);


    console.log(`Successfully scraped metadata for ${url}: Image: ${!!imageUrl}, Date: ${!!date}`);
    return result;

  } catch (error: any) {
    console.error(`Error scraping Medium post ${url}:`, error.message);
    // Return nulls on error to avoid breaking the BlogSection component
    return { imageUrl: null, date: null };
  }
}
