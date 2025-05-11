import type { Express } from "express";
import { createServer, type Server } from "http";
import { MongoStorage } from "./mongoStorage";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { generateOpenAIArticle } from "./ai/openai";
import { generateAnthropicArticle } from "./ai/anthropic";
import { generateXAIArticle } from "./ai/xai";
import { z } from "zod";

dotenv.config();

// Initialize MongoDB storage for articles
export const mongoStorage = new MongoStorage();

// Load prompts from files
async function loadPrompt(promptName: string): Promise<string> {
  try {
    const promptPath = path.join(process.cwd(), 'prompts', `${promptName}.txt`);
    return await fs.readFile(promptPath, 'utf-8');
  } catch (error) {
    console.error(`Error loading prompt ${promptName}:`, error);
    throw new Error(`Failed to load ${promptName} prompt`);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Load prompts on startup
  const articlePromptPromise = loadPrompt('article');
  const humanizePromptPromise = loadPrompt('humanize');
  
  // Reference to storage
  const storage = mongoStorage;

  // API endpoint for generating articles
  app.post('/api/articles/generate', async (req, res) => {
    try {
      const articleSchema = z.object({
        primaryKeyword: z.string().min(1),
        secondaryKeywords: z.string().optional(),
        wordCount: z.number().min(100).max(5000).default(200),
        tone: z.string(),
        pov: z.string(),
        model: z.string(),
        targetAudience: z.string().optional(),
        humanize: z.boolean().default(false)
      });

      const validatedData = articleSchema.parse(req.body);
      
      // Get the article prompt template
      const articlePrompt = await articlePromptPromise;
      let humanizePrompt = "";
      
      if (validatedData.humanize) {
        humanizePrompt = await humanizePromptPromise;
      }

      // Process the request based on the selected AI model
      let articleContent: string;

      switch (validatedData.model) {
        case 'chatgpt':
          articleContent = await generateOpenAIArticle(articlePrompt, humanizePrompt, validatedData);
          break;
        case 'claude':
          articleContent = await generateAnthropicArticle(articlePrompt, humanizePrompt, validatedData);
          break;
        case 'xai':
          articleContent = await generateXAIArticle(articlePrompt, humanizePrompt, validatedData);
          break;
        default:
          throw new Error('Invalid AI model selected');
      }

      // Extract title from the content (first h1 tag)
      const titleMatch = articleContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const title = titleMatch ? titleMatch[1] : validatedData.primaryKeyword;

      // Count words in the content (strip HTML tags first)
      const contentWithoutTags = articleContent.replace(/<[^>]*>/g, ' ');
      const wordCount = contentWithoutTags.split(/\s+/).filter(Boolean).length;

      // Store the article in MongoDB
      const article = await storage.createArticle({
        title,
        content: articleContent,
        date: new Date().toISOString(),
        wordCount,
        primaryKeyword: validatedData.primaryKeyword,
        secondaryKeywords: validatedData.secondaryKeywords || "",
        tone: validatedData.tone,
        model: validatedData.model,
        pov: validatedData.pov,
        targetAudience: validatedData.targetAudience,
      });

      res.status(201).json({ 
        id: article.id,
        message: 'Article generated successfully' 
      });

    } catch (error: any) {
      console.error('Error generating article:', error);
      res.status(500).json({ 
        message: error.message || 'Failed to generate article' 
      });
    }
  });

  // API endpoint for retrieving an article by ID
  app.get('/api/articles/:id', async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const article = await storage.getArticle(articleId);
      
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      
      res.json(article);
    } catch (error: any) {
      console.error('Error retrieving article:', error);
      res.status(500).json({ 
        message: error.message || 'Failed to retrieve article' 
      });
    }
  });

  // API endpoint for retrieving API keys
  app.get('/api/admin/keys', async (_req, res) => {
    try {
      const apiKeys = {
        chatgpt: process.env.CHATGPT_API_KEY || "",
        anthropic: process.env.ANTHROPIC_API_KEY || "",
        xai: process.env.XAI_API_KEY || ""
      };
      
      res.json(apiKeys);
    } catch (error: any) {
      console.error('Error retrieving API keys:', error);
      res.status(500).json({ 
        message: error.message || 'Failed to retrieve API keys' 
      });
    }
  });

  // API endpoint for updating API keys
  app.post('/api/admin/keys', async (req, res) => {
    try {
      const keysSchema = z.object({
        chatgpt: z.string().optional(),
        anthropic: z.string().optional(),
        xai: z.string().optional()
      });

      const { chatgpt, anthropic, xai } = keysSchema.parse(req.body);
      
      // Update the environment variables
      process.env.CHATGPT_API_KEY = chatgpt;
      process.env.ANTHROPIC_API_KEY = anthropic;
      process.env.XAI_API_KEY = xai;
      
      // In a real application, you would save these to a .env file
      // For this demo, we'll just update the in-memory process.env
      
      res.json({ message: 'API keys updated successfully' });
    } catch (error: any) {
      console.error('Error updating API keys:', error);
      res.status(500).json({ 
        message: error.message || 'Failed to update API keys' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
