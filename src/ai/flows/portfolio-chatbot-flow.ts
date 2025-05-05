'use server';
/**
 * @fileOverview A portfolio chatbot AI agent.
 *
 * - portfolioChatbot - A function that handles chatbot interaction.
 * - PortfolioChatbotInput - The input type for the portfolioChatbot function.
 * - PortfolioChatbotOutput - The return type for the portfolioChatbot function.
 */

import {ai} from '@/ai/ai-instance';
// Update the import to use the GitHub API service
import { getGitHubRepositories } from '@/services/github';
import {getLinkedInProfile} from '@/services/linkedin';
import {generateSystemPrompt} from '@/ai/prompts/chatbot-system-prompt';
import {z} from 'genkit';

// Define the structure for a single message in the conversation history
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']).describe('The role of the message sender (user or AI model).'),
  text: z.string().describe('The text content of the message.'),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// Define the input schema for the chatbot flow
const PortfolioChatbotInputSchema = z.object({
  context: z.object({
    resumeText: z.string().describe("The full text content of Harshith's resume."),
    githubUsername: z.string().optional().describe("Harshith's GitHub username."),
    linkedinProfileUrl: z.string().optional().describe("The URL to Harshith's LinkedIn profile."),
  }).describe("Static context information about Harshith."),
  history: z.array(ChatMessageSchema).describe('The conversation history between the user and the AI.'),
  question: z.string().describe("The user's latest question."),
});
export type PortfolioChatbotInput = z.infer<typeof PortfolioChatbotInputSchema>;

// Define the output schema for the chatbot flow
const PortfolioChatbotOutputSchema = z.object({
  answer: z.string().describe("The AI's response to the user's question."),
});
export type PortfolioChatbotOutput = z.infer<typeof PortfolioChatbotOutputSchema>;

// Exported async function that wraps the Genkit flow
export async function portfolioChatbot(input: PortfolioChatbotInput): Promise<PortfolioChatbotOutput> {
  return portfolioChatbotFlow(input);
}

// Genkit flow definition
const portfolioChatbotFlow = ai.defineFlow<
  typeof PortfolioChatbotInputSchema,
  typeof PortfolioChatbotOutputSchema
>(
  {
    name: 'portfolioChatbotFlow',
    inputSchema: PortfolioChatbotInputSchema,
    outputSchema: PortfolioChatbotOutputSchema,
  },
  async (input) => {
    const { context, history, question } = input;
    const { resumeText, githubUsername, linkedinProfileUrl } = context;

    // Fetch dynamic context (optional, could be pre-fetched and passed in context if preferred)
    let githubReposSummary = 'GitHub information not available.';
    if (githubUsername) {
      try {
        // Use the imported API function
        const repos = await getGitHubRepositories(githubUsername);
        // Create a concise summary using data available from the API
        githubReposSummary = `Key Repositories (${repos.length} found):\n${repos
            .slice(0, 5) // Limit to top 5 for brevity
            .map(repo => `- ${repo.name}: ${repo.description?.substring(0, 100) || ''}... (${repo.language || 'N/A'}) - ⭐${repo.stars}`)
            .join('\n')}`;
      } catch (e) {
        console.error('Error fetching GitHub repos via API for chatbot:', e);
      }
    }

    let linkedinProfileSummary = 'LinkedIn information not available.';
    if (linkedinProfileUrl) {
      try {
        const profile = await getLinkedInProfile(linkedinProfileUrl);
        // Create a concise summary
        linkedinProfileSummary = `LinkedIn Profile:\n- Name: ${profile.fullName}\n- Headline: ${profile.headline}\n- Summary Snippet: ${profile.summary.substring(0, 200)}...`;
      } catch (e) {
        console.error('Error fetching LinkedIn profile for chatbot:', e);
      }
    }

    // Generate the system prompt using the helper function and context
    const systemPrompt = generateSystemPrompt({
      resumeText,
      githubSummary: githubReposSummary,
      linkedinSummary: linkedinProfileSummary,
    });

    // Prepare messages for the AI model, including system prompt, history, and the new question
    const messages = [
      { role: 'system' as const, text: systemPrompt }, // Add system prompt first
      ...history.map(msg => ({ role: msg.role, text: msg.text })), // Spread existing history
      { role: 'user' as const, text: question }, // Add the latest user question
    ];

    // Call the AI model
    const response = await ai.generate({
      prompt: messages,
      // model: 'googleai/gemini-1.5-flash', // Can specify a different model if needed
      config: {
        // Optional: Adjust temperature for creativity vs. factuality
        // temperature: 0.5,
      },
      output: { // Define expected output format
         format: 'text'
      }
    });

    const answer = response.text;

    // Return the AI's answer
    return { answer };
  }
);