'use server';
/**
 * @fileOverview AI flow for categorizing software projects into multiple relevant categories.
 *
 * - categorizeProject - Function to categorize a project based on its details.
 * - ProjectCategorizationInput - Input type for the categorization flow.
 * - ProjectCategorizationOutput - Output type for the categorization flow.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';
import type { ProjectCategory } from '@/types'; // Import the category type

// Define the allowed categories (excluding 'Featured')
const AllowedProjectCategories: [ProjectCategory, ...ProjectCategory[]] = ["AI", "Machine Learning", "Data Analysis", "Web/Cloud", "Robotics", "Other"];

// Input schema updated to allow null for githubUrl and readmeContent
const ProjectCategorizationInputSchema = z.object({
  name: z.string().describe('The name or title of the project.'),
  description: z.string().nullable().describe('A brief description of the project.'),
  technologies: z.array(z.string()).describe('A list of technologies, languages, or frameworks used in the project.'),
  githubUrl: z.string().nullable().optional().describe('Optional: The GitHub URL of the project for more context.'), // Changed to nullable().optional()
  readmeContent: z.string().nullable().optional().describe('Optional: The content of the project\'s README file for more context.'),
});
export type ProjectCategorizationInput = z.infer<typeof ProjectCategorizationInputSchema>;

// Output schema remains the same
const ProjectCategorizationOutputSchema = z.object({
  categories: z.array(z.enum(AllowedProjectCategories)).min(1).describe('An array of one or more determined categories for the project (AI, Machine Learning, Data Analysis, Web/Cloud, Robotics, or Other).'),
});
export type ProjectCategorizationOutput = z.infer<typeof ProjectCategorizationOutputSchema>;

// Define the prompt for categorization - updated for multiple categories and refined definitions
const categorizePrompt = ai.definePrompt({
    name: 'categorizeProjectPrompt',
    input: { schema: ProjectCategorizationInputSchema }, // Schema updated to allow null githubUrl
    output: { schema: ProjectCategorizationOutputSchema },
    prompt: `You are an expert programmer tasked with categorizing software projects based on their name, description, technologies used, GitHub URL, and README content.

Assign **one or more** relevant categories from the list: "AI", "Machine Learning", "Data Analysis", "Web/Cloud", "Robotics", "Other".

**Category Definitions & Prioritization:**
*   **Robotics:** **Highest priority.** Projects involving physical robots, controlling hardware (like Raspberry Pi, Arduino), sensor integration, IoT devices with a significant physical component or direct hardware interaction. Computer vision specifically for robotic control/navigation/interaction (e.g., body balancing, AI assistant for visually impaired using edge device). If electronics/hardware control is the primary goal, categorize as Robotics. It may also fit into AI/ML if the algorithms are complex. Keywords: robotics, ros, raspberry pi, arduino, iot (hardware focus), embedded systems, sensors, actuators, motor control, opencv (for robotics), yolo (for robotics), edge ai (for hardware), electronics.
*   **AI:** Projects focused on broader artificial intelligence concepts, Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), generative models, intelligent agents, reasoning systems, complex algorithms, or systems *not primarily focused on hardware control*. Includes complex chatbots, virtual educators, AI APIs usage (OpenAI, etc.), fine-tuning LLMs, reinforcement learning applications (unless purely theoretical/simulation). Keywords: llm, rag, gpt, openai, generative ai, intelligent systems, langchain, langgraph, virtual educator, chatbot (complex), ai assistant (if not primarily hardware), fine-tuning, reinforcement learning (applied), agentic systems, reasoning.
*   **Machine Learning:** Projects focused on predictive modeling, supervised/unsupervised learning, classical ML algorithms, deep learning model training/implementation (e.g., CNNs, RNNs) *unless* the main application is Robotics or a very broad AI system. If it involves training/implementing standard ML models for tasks like prediction or classification without being a complex AI agent or controlling hardware, categorize here. Keywords: tensorflow, pytorch, scikit-learn, regression, classification, clustering, cnn (general), rnn, lstm, predictive modeling, random forest, gradient boosting, support vector machine, model training, evaluation metrics.
*   **Data Analysis:** Projects focused on data exploration, cleaning, transformation, statistical analysis, visualization, and reporting. Usually involves libraries like Pandas, NumPy, Matplotlib, Seaborn. Keywords: pandas, numpy, matplotlib, seaborn, statistics, data visualization, etl, data cleaning, analytics, reporting, data processing, statistical modeling.
*   **Web/Cloud:** Projects involving web development (frontend/backend), APIs, cloud infrastructure (AWS, GCP, Azure), deployment pipelines (Jenkins), containerization (Docker), serverless functions, databases used in web contexts (MongoDB, SQL), web scraping. Keywords: react, nextjs, node, express, django, flask, aws, gcp, azure, docker, kubernetes, jenkins, firebase, mongodb, sql, api, http, cloud, web scraping, podcast generation (if web-based), zendesk api, pinecone (if web context).
*   **Other:** Projects that don't clearly fit into the above categories, or general utilities/libraries.

**Project Details:**
Name: {{{name}}}
Description: {{#if description}}{{{description}}}{{else}}N/A{{/if}}
Technologies: {{#if technologies}}{{#each technologies}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}N/A{{/if}}
{{#if githubUrl}}GitHub URL: {{{githubUrl}}}{{else}}GitHub URL: N/A{{/if}}

{{#if readmeContent}}
**README Content (excerpt):**
\`\`\`
{{{readmeContentExcerpt}}}
\`\`\`
{{else}}
README Content: N/A
{{/if}}

Analyze ALL the details provided, especially the README content and description.
Determine ALL applicable categories from the list ("AI", "Machine Learning", "Data Analysis", "Web/Cloud", "Robotics", "Other"). The project MUST have at least one category.
Prioritize **Robotics** if significant hardware interaction or control is involved (Raspberry Pi, Arduino, sensors etc.).
If a project uses AI/ML *for* robotics (like the body balancing or visually impaired assistant), it should be categorized as **Robotics** and potentially also **AI** or **Machine Learning** depending on the algorithm's complexity or novelty.
If a project involves fine-tuning, reinforcement learning, or using AI APIs (like OpenAI), categorize it as **AI**.
If a project uses standard ML models (like Random Forest) for prediction/classification, categorize it as **Machine Learning**.
If data processing/visualization is the main goal, categorize as **Data Analysis**.

**Important:** Do NOT categorize as "Featured".

Output the categories as an array of strings in the specified JSON format. For example: {"categories": ["Robotics", "AI"]}`,
    // Register a Handlebars helper to limit README length
    helpers: {
        readmeContentExcerpt: (str: string | null | undefined) => str ? str.substring(0, 2000) + (str.length > 2000 ? '...' : '') : 'N/A',
    }
});


// Update the flow definition's type signature
const categorizeProjectFlow = ai.defineFlow<
  typeof ProjectCategorizationInputSchema,
  typeof ProjectCategorizationOutputSchema // Output schema now expects { categories: string[] }
>(
  {
    name: 'categorizeProjectFlow',
    inputSchema: ProjectCategorizationInputSchema,
    outputSchema: ProjectCategorizationOutputSchema,
    cache: { // Keep caching enabled
        durationSeconds: 3600, // Cache for 1 hour
    }
  },
  async (input) => {
     console.log(`AI Categorizing (multi-category) for: ${input.name}`);
     try {
        const { output } = await categorizePrompt(input);
        if (!output || !output.categories || output.categories.length === 0) {
             console.error("Multi-Categorization failed, output was invalid for:", input.name, output);
             // Fallback to 'Other' if categorization fails or returns empty array
             return { categories: ["Other"] };
        }
        console.log(`Categorized "${input.name}" as: ${output.categories.join(', ')}`);
        return output; // Output is now { categories: ["Cat1", "Cat2"] }
     } catch (error) {
        console.error(`Error during AI multi-categorization for "${input.name}":`, error);
         // Fallback to 'Other' category on error
        return { categories: ["Other"] };
     }
  }
);

// Update the exported function's return type
export async function categorizeProject(input: ProjectCategorizationInput): Promise<ProjectCategorizationOutput> {
  return categorizeProjectFlow(input);
}

