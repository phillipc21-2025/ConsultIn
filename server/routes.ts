import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { z } from "zod";
import { insertBusinessProblemSchema, type SolutionResponse } from "@shared/schema";

// Initialize OpenAI
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || 
         process.env.VITE_OPENAI_API_KEY ||
         "sk-placeholder-key-use-environment-variable" 
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_MODEL = "gpt-4o";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiPrefix = "/api";
  
  // Health check endpoint
  app.get(`${apiPrefix}/health`, (req, res) => {
    res.json({ status: "ok" });
  });
  
  // User endpoints
  app.get(`${apiPrefix}/users/:id`, async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't expose the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  // Expert endpoints
  app.get(`${apiPrefix}/experts`, async (req, res) => {
    const experts = await storage.getExperts();
    res.json(experts);
  });
  
  // Conversation endpoints
  app.get(`${apiPrefix}/conversations`, async (req, res) => {
    const conversations = await storage.getConversations();
    res.json(conversations);
  });
  
  // Talent endpoints
  app.get(`${apiPrefix}/talents`, async (req, res) => {
    const talents = await storage.getTalents();
    res.json(talents);
  });
  
  // Training endpoints
  app.get(`${apiPrefix}/trainings`, async (req, res) => {
    const trainings = await storage.getTrainings();
    res.json(trainings);
  });
  
  // Service endpoints
  app.get(`${apiPrefix}/services`, async (req, res) => {
    const services = await storage.getServices();
    res.json(services);
  });
  
  // Business problem analysis endpoint
  const businessProblemSchema = z.object({
    userId: z.number(),
    problem: z.string().min(1),
  });
  
  app.post(`${apiPrefix}/analyze-problem`, async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedBody = businessProblemSchema.parse(req.body);
      
      // Create a new business problem
      const newBusinessProblem = await storage.createBusinessProblem({
        userId: validatedBody.userId,
        problem: validatedBody.problem,
        solution: null,
        createdAt: new Date().toISOString(),
      });
      
      // Get experts, conversations, etc. from storage
      const [experts, conversations, talents, trainings, services] = await Promise.all([
        storage.getExperts(),
        storage.getConversations(),
        storage.getTalents(),
        storage.getTrainings(),
        storage.getServices(),
      ]);
      
      // Analyze the problem using OpenAI
      const prompt = `
        You are an AI assistant helping a small business owner solve a problem. 
        
        Their problem is: "${validatedBody.problem}"
        
        Based on this problem, provide a structured analysis, a detailed step-by-step process for solving the problem, and specific recommendations in the following JSON format:
        
        {
          "analysis": "A concise 2-3 sentence analysis of the problem",
          "experts": ${JSON.stringify(experts)},
          "conversations": ${JSON.stringify(conversations)},
          "talents": ${JSON.stringify(talents)},
          "trainings": ${JSON.stringify(trainings)},
          "services": ${JSON.stringify(services)},
          "processSteps": [
            {
              "id": 1,
              "title": "Step title - short and action-oriented",
              "description": "Detailed explanation of what to do in this step",
              "solution": "Specific solution or implementation guidance for this step",
              "resources": {
                "experts": [...subset of relevant experts for this specific step...],
                "conversations": [...subset of relevant conversations for this specific step...],
                "talents": [...subset of relevant talents for this specific step...],
                "trainings": [...subset of relevant trainings for this specific step...],
                "services": [...subset of relevant services for this specific step...]
              }
            },
            ...more steps...
          ]
        }
        
        Important guidelines:
        1. Create 3-5 clear, sequential process steps that address the problem comprehensively
        2. Make each step actionable with specific guidance
        3. For each step, provide a concrete solution that is immediately applicable
        4. Only include the most relevant experts, conversations, talents, trainings, and services from the provided lists that directly address each specific step
        5. Do not invent new entries that aren't in the provided data
      `;
      
      const completion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });
      
      const solution = JSON.parse(completion.choices[0].message.content || "{}") as SolutionResponse;
      
      // Update the business problem with the solution
      const updatedProblem = await storage.updateBusinessProblemSolution(newBusinessProblem.id, solution);
      
      res.json(solution);
    } catch (error) {
      console.error('Error analyzing problem:', error);
      res.status(500).json({ 
        message: "Error analyzing problem", 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
