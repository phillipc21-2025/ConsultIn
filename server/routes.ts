import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { z } from "zod";
import { 
  insertBusinessProblemSchema, 
  type SolutionResponse, 
  type Expert,
  type Conversation,
  type Talent,
  type Training,
  type Service
} from "@shared/schema";

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
      
      // Function to generate mock solution based on the problem
      const generateMockSolution = (problem: string, 
        experts: Expert[], 
        conversations: Conversation[],
        talents: Talent[],
        trainings: Training[],
        services: Service[]): SolutionResponse => {
        
        console.log("Generating mock solution for:", problem);

        // Helper to get a random subset of items from any array
        const getRandomSubset = <T>(array: T[], max: number = 2): T[] => {
          if (!array.length) return [];
          const shuffled = [...array].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, Math.min(max, array.length));
        };
        
        // Create some sample process steps based on problem keywords
        let processSteps = [];
        
        if (problem.toLowerCase().includes("supply chain")) {
          processSteps = [
            {
              id: 1,
              title: "Identify key supply chain vulnerabilities",
              description: "Conduct a thorough audit of your current supply chain to identify single points of failure, bottlenecks, and areas most vulnerable to disruption.",
              solution: "Use a supply chain mapping tool to create a visual representation of your entire supply network. Highlight suppliers with the longest lead times and those providing critical components.",
              resources: {
                experts: getRandomSubset(experts),
                conversations: getRandomSubset(conversations),
                trainings: getRandomSubset(trainings),
                services: getRandomSubset(services)
              }
            },
            {
              id: 2,
              title: "Diversify supplier base",
              description: "Expand your supplier network to include multiple sources for critical materials and components.",
              solution: "Create a secondary supplier list with at least two backup options for each critical component. Initiate relationships with these suppliers even if you're not immediately placing orders.",
              resources: {
                experts: getRandomSubset(experts),
                conversations: getRandomSubset(conversations),
                talents: getRandomSubset(talents)
              }
            },
            {
              id: 3,
              title: "Implement inventory optimization strategy",
              description: "Balance inventory levels to protect against disruptions while minimizing holding costs.",
              solution: "Adopt a hybrid inventory model with safety stock for critical items and just-in-time principles for others. Use historical data to calculate optimal safety stock levels based on supplier lead time variability.",
              resources: {
                trainings: getRandomSubset(trainings),
                services: getRandomSubset(services)
              }
            },
            {
              id: 4,
              title: "Develop contingency planning",
              description: "Create detailed action plans for potential supply chain disruptions before they occur.",
              solution: "Document step-by-step response procedures for common disruption scenarios. Include emergency contact information, decision trees, and communication templates.",
              resources: {
                experts: getRandomSubset(experts),
                trainings: getRandomSubset(trainings)
              }
            }
          ];
        } else if (problem.toLowerCase().includes("staffing") || problem.toLowerCase().includes("hiring")) {
          processSteps = [
            {
              id: 1,
              title: "Define clear job requirements",
              description: "Create detailed job descriptions that accurately reflect the skills, experience, and qualities needed for each position.",
              solution: "Conduct a job analysis by interviewing current successful employees and their managers. Identify the key skills and attributes that drive success in the role.",
              resources: {
                experts: getRandomSubset(experts),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 2,
              title: "Expand recruitment channels",
              description: "Diversify your recruitment sources to reach a wider pool of qualified candidates.",
              solution: "In addition to job boards, leverage industry-specific forums, professional associations, and employee referral programs. Attend industry events and partner with relevant educational institutions.",
              resources: {
                services: getRandomSubset(services),
                conversations: getRandomSubset(conversations)
              }
            },
            {
              id: 3,
              title: "Implement structured interview process",
              description: "Create a standardized interview framework to evaluate candidates consistently and reduce bias.",
              solution: "Develop role-specific interview questions that assess both technical skills and cultural fit. Use scoring rubrics for each question and involve multiple team members in the interview process.",
              resources: {
                talents: getRandomSubset(talents),
                trainings: getRandomSubset(trainings)
              }
            }
          ];
        } else {
          // Default steps for any other type of problem
          processSteps = [
            {
              id: 1,
              title: "Analyze current situation",
              description: "Gather relevant data and assess the current state of your business to understand the root causes of the problem.",
              solution: "Conduct a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) focused specifically on the problem area. Identify key metrics to measure the current situation and track improvement.",
              resources: {
                experts: getRandomSubset(experts),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 2,
              title: "Develop an action plan",
              description: "Create a detailed strategy with specific, measurable goals and timeline for implementation.",
              solution: "Use the SMART framework (Specific, Measurable, Achievable, Relevant, Time-bound) to set clear objectives. Break down the plan into weekly milestones with assigned responsibilities.",
              resources: {
                services: getRandomSubset(services),
                conversations: getRandomSubset(conversations)
              }
            },
            {
              id: 3,
              title: "Implement solution",
              description: "Execute your action plan methodically while monitoring progress and making adjustments as needed.",
              solution: "Start with a pilot implementation to test effectiveness. Schedule regular check-ins to review progress and address any obstacles quickly. Document lessons learned throughout the process.",
              resources: {
                talents: getRandomSubset(talents),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 4,
              title: "Measure results and refine approach",
              description: "Evaluate the effectiveness of your solution and make necessary adjustments for continuous improvement.",
              solution: "Compare key metrics before and after implementation. Gather feedback from team members and stakeholders. Create a system for ongoing monitoring and regular reviews.",
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            }
          ];
        }

        // Generate a business-appropriate analysis based on the problem
        let analysis = "";
        if (problem.toLowerCase().includes("supply chain")) {
          analysis = "Your supply chain challenges stem from over-reliance on limited suppliers and lack of contingency planning. Implementing a diversified supplier strategy and optimized inventory management will significantly improve resilience and operational continuity.";
        } else if (problem.toLowerCase().includes("staffing") || problem.toLowerCase().includes("hiring")) {
          analysis = "Your staffing difficulties are primarily caused by narrow recruitment channels and an unstructured hiring process. Expanding your talent acquisition approaches and implementing standardized evaluation methods will help attract and identify the right candidates more efficiently.";
        } else {
          analysis = "This business challenge requires a methodical approach beginning with thorough analysis of the current situation. A structured plan with clear metrics, regular implementation reviews, and continuous refinement will lead to sustainable improvement.";
        }

        return {
          analysis,
          experts: experts.slice(0, 3),
          conversations: conversations.slice(0, 3),
          talents: talents.slice(0, 3),
          trainings: trainings.slice(0, 3),
          services: services.slice(0, 3),
          processSteps
        };
      };
      
      // Generate mock solution instead of calling OpenAI
      const solution = generateMockSolution(
        validatedBody.problem,
        experts,
        conversations,
        talents,
        trainings,
        services
      );
      
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
