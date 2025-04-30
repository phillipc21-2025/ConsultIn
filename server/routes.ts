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
  type Service,
  type NetworkComment,
  type ProcessStep,
  type ConsultInAction,
  type ConsultInEmailAction,
  type ConsultInFormAction,
  type ConsultInProductAction
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
        const getRandomSubset = <T>(array: T[], max: number = 4): T[] => {
          if (!array.length) return [];
          const shuffled = [...array].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, Math.min(max, array.length));
        };
        
        // Generate ConsultIn actions for process steps
        const generateConsultInAction = (stepTitle: string, stepDescription: string): ConsultInAction => {
          // Randomly choose an action type, with bias toward email
          const randomNum = Math.random();
          if (randomNum < 0.5) {
            // Email action (50% chance)
            const emailSubjects = [
              `Request for information regarding: ${stepTitle}`,
              `Follow-up on ${stepTitle}`,
              `Action required: ${stepTitle} implementation`,
              `Partnership opportunity for ${stepTitle} initiative`
            ];
            
            const emailBodies = [
              `Dear [Recipient],\n\nI am writing to request more information about ${stepTitle}. Based on our recent analysis, we need to ${stepDescription.toLowerCase()}\n\nCould you please provide the following details:\n\n1. Current status of our supply chain mapping\n2. List of critical suppliers and their lead times\n3. Any existing contingency plans\n\nThis information will help us implement the solution more effectively.\n\nThank you for your assistance.\n\nBest regards,\n[Your Name]\n[Your Company]`,
              
              `Dear [Recipient],\n\nFollowing our recent business analysis, we need to implement a solution to ${stepDescription.toLowerCase()}\n\nOur recommended approach is to:\n\n1. Begin with a comprehensive assessment\n2. Develop an implementation plan with specific milestones\n3. Allocate resources appropriately\n4. Set up regular progress reviews\n\nPlease let me know if you have any questions or would like to discuss this further.\n\nRegards,\n[Your Name]\n[Your Company]`,
              
              `Dear [Recipient],\n\nI hope this email finds you well. I'm reaching out regarding our upcoming initiative to address ${stepTitle.toLowerCase()}.\n\nWe've identified this as a critical area for improvement, and I'd like to schedule a meeting to discuss how we can collaborate on implementing the following solution:\n\n"${stepDescription.toLowerCase()}"\n\nPlease let me know your availability for next week.\n\nThank you,\n[Your Name]\n[Your Company]`
            ];
            
            return {
              type: 'email',
              recipient: "[Recipient Email]",
              subject: emailSubjects[Math.floor(Math.random() * emailSubjects.length)],
              body: emailBodies[Math.floor(Math.random() * emailBodies.length)],
              ccList: ["[Team Member]", "[Stakeholder]"]
            };
          } else if (randomNum < 0.8) {
            // Form action (30% chance)
            const formTitles = [
              `${stepTitle} Implementation Form`,
              `Request for ${stepTitle} Resources`,
              `${stepTitle} Approval Request`,
              `${stepTitle} Information Submission`
            ];
            
            return {
              type: 'form',
              formTitle: formTitles[Math.floor(Math.random() * formTitles.length)],
              formFields: [
                {
                  label: "Project Name",
                  type: "text",
                  required: true,
                  value: `${stepTitle} Initiative`
                },
                {
                  label: "Implementation Date",
                  type: "date",
                  required: true
                },
                {
                  label: "Budget Allocation",
                  type: "number",
                  required: true
                },
                {
                  label: "Project Description",
                  type: "text",
                  required: true,
                  value: stepDescription
                },
                {
                  label: "Department",
                  type: "select",
                  options: ["Operations", "Supply Chain", "Manufacturing", "Sales", "Marketing", "Finance", "HR"],
                  required: true
                },
                {
                  label: "I confirm all information is accurate",
                  type: "checkbox",
                  required: true
                }
              ],
              submissionEndpoint: "/api/form-submission"
            };
          } else {
            // Product action (20% chance)
            return {
              type: 'product',
              products: [
                {
                  id: 1,
                  name: `${stepTitle} Analytics Platform`,
                  description: `AI-powered software to help you implement ${stepTitle} with data-driven insights and recommendations.`,
                  price: "$499/month",
                  url: "#",
                  imageUrl: "https://randomuser.me/api/portraits/lego/1.jpg"
                },
                {
                  id: 2,
                  name: `${stepTitle} Implementation Service`,
                  description: `Professional consultants will guide you through the entire process of ${stepDescription.toLowerCase()}`,
                  price: "$3,500",
                  url: "#",
                  imageUrl: "https://randomuser.me/api/portraits/lego/2.jpg"
                },
                {
                  id: 3,
                  name: `${stepTitle} Training Program`,
                  description: `Comprehensive training for your team on how to effectively ${stepDescription.toLowerCase()}`,
                  price: "$1,200",
                  url: "#",
                  imageUrl: "https://randomuser.me/api/portraits/lego/3.jpg"
                }
              ]
            };
          }
        };
        
        // Create network comments for process steps
        const generateNetworkComments = (): NetworkComment[] => {
          // Sample images
          const profileImages = [
            "https://randomuser.me/api/portraits/men/32.jpg",
            "https://randomuser.me/api/portraits/women/44.jpg",
            "https://randomuser.me/api/portraits/men/86.jpg",
            "https://randomuser.me/api/portraits/women/63.jpg",
            "https://randomuser.me/api/portraits/men/22.jpg",
            "https://randomuser.me/api/portraits/women/54.jpg"
          ];
          
          // Sample positive comments
          const positiveComments = [
            "I fully agree with this approach. We implemented something similar at my company and saw a 35% improvement in fulfillment rates.",
            "This strategy worked wonders for us. The key was getting leadership buy-in early in the process.",
            "100% support this. We actually went further and automated parts of this process, which saved us hundreds of hours annually.",
            "Great suggestion. I'd add that documentation is critical during this step - we learned that the hard way!",
            "My team followed a similar approach last quarter. The ROI was impressive, and stakeholder satisfaction improved measurably."
          ];
          
          // Sample negative/cautionary comments
          const negativeComments = [
            "I'd be careful with this approach. We tried it and found that we needed to customize heavily for our industry specifics.",
            "This might work for larger companies, but we struggled to implement with our limited resources. Consider scaling based on team size.",
            "We had mixed results with this strategy. The upfront costs were higher than anticipated, so prepare your budget accordingly.",
            "This approach has merit, but I'd suggest a pilot program first. Full implementation created bottlenecks in our workflow.",
            "I disagree with parts of this. We found that focusing on quality first rather than quantity produced better long-term results."
          ];
          
          // Sample neutral/additional perspective comments
          const neutralComments = [
            "Consider this alternative: we focused on building relationships first, then formalized the process later with better results.",
            "An important addition: make sure to involve your legal team early in this process to avoid compliance issues down the line.",
            "In our experience, the timeline for seeing results was about 6-8 months, so set appropriate expectations with stakeholders.",
            "This works, but don't forget to establish clear metrics at the start. We had to backtrack because we weren't measuring the right things.",
            "This is a solid approach, though industry regulations may require adjustments for companies in regulated sectors."
          ];
          
          // Generate 3-5 comments with varied sentiments
          const numComments = Math.floor(Math.random() * 3) + 3; // 3-5 comments
          let comments: NetworkComment[] = [];
          
          // Ensure at least one positive and one critical comment
          comments.push({
            id: 1,
            authorName: "Michael Chen",
            authorTitle: "Operations Director",
            authorCompany: "NexGen Manufacturing",
            authorImage: profileImages[0],
            content: positiveComments[Math.floor(Math.random() * positiveComments.length)],
            sentiment: "positive",
            postedTime: "2 days ago",
            likes: Math.floor(Math.random() * 50) + 5
          });
          
          comments.push({
            id: 2,
            authorName: "Sarah Johnson",
            authorTitle: "Supply Chain Consultant",
            authorCompany: "Global Logistics Partners",
            authorImage: profileImages[1],
            content: negativeComments[Math.floor(Math.random() * negativeComments.length)],
            sentiment: "negative",
            postedTime: "1 day ago",
            likes: Math.floor(Math.random() * 20) + 3
          });
          
          // Add remaining comments randomly
          for (let i = 3; i <= numComments; i++) {
            const sentimentType = Math.random() < 0.5 ? 
              (Math.random() < 0.5 ? "positive" : "negative") : "neutral";
            
            let commentPool = positiveComments;
            if (sentimentType === "negative") commentPool = negativeComments;
            if (sentimentType === "neutral") commentPool = neutralComments;
            
            const randomIdx = Math.floor(Math.random() * commentPool.length);
            
            // List of plausible names
            const names = [
              "Emma Rodriguez", "David Kim", "Priya Patel", "James Wilson",
              "Olivia Thompson", "Wei Zhang", "Jamal Bennett", "Sofia Garcia"
            ];
            
            // List of plausible titles
            const titles = [
              "VP of Operations", "Supply Chain Manager", "Business Owner",
              "Production Lead", "Chief Strategy Officer", "Director of Procurement",
              "Inventory Specialist", "Business Analyst"
            ];
            
            // List of plausible companies
            const companies = [
              "Horizon Solutions", "BlueStream Logistics", "TechCraft Industries",
              "Pinnacle Manufacturing", "EverGreen Supply Co.", "Summit Operations",
              "InnovateNow Corp", "Elite Business Group"
            ];
            
            comments.push({
              id: i,
              authorName: names[Math.floor(Math.random() * names.length)],
              authorTitle: titles[Math.floor(Math.random() * titles.length)],
              authorCompany: companies[Math.floor(Math.random() * companies.length)],
              authorImage: profileImages[i % profileImages.length],
              content: commentPool[randomIdx],
              sentiment: sentimentType as 'positive' | 'negative' | 'neutral',
              postedTime: `${Math.floor(Math.random() * 7) + 1} days ago`,
              likes: Math.floor(Math.random() * 30) + 1
            });
          }
          
          return comments;
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
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Identify key supply chain vulnerabilities", "Conduct a thorough audit of your current supply chain to identify single points of failure, bottlenecks, and areas most vulnerable to disruption."),
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
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Diversify supplier base", "Expand your supplier network to include multiple sources for critical materials and components."),
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
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement inventory optimization strategy", "Balance inventory levels to protect against disruptions while minimizing holding costs."),
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
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Develop contingency planning", "Create detailed action plans for potential supply chain disruptions before they occur."),
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
              networkComments: generateNetworkComments(),
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
              networkComments: generateNetworkComments(),
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
              networkComments: generateNetworkComments(),
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
              networkComments: generateNetworkComments(),
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
              networkComments: generateNetworkComments(),
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
              networkComments: generateNetworkComments(),
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
              networkComments: generateNetworkComments(),
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
          experts: experts.slice(0, 4),
          conversations: conversations.slice(0, 5), // Increased to 5 for ActiveConversations
          talents: talents.slice(0, 4),
          trainings: trainings.slice(0, 4),
          services: services.slice(0, 4),
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
