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
        
        // Create sample process steps based on problem keywords - expanded with more business scenarios
        let processSteps = [];
        let analysis = "";
        
        // 1. Supply Chain Management
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
          analysis = "Your supply chain challenges stem from over-reliance on limited suppliers and lack of contingency planning. Implementing a diversified supplier strategy and optimized inventory management will significantly improve resilience and operational continuity.";
        } 
        
        // 2. Staffing/Hiring
        else if (problem.toLowerCase().includes("staffing") || problem.toLowerCase().includes("hiring")) {
          processSteps = [
            {
              id: 1,
              title: "Define clear job requirements",
              description: "Create detailed job descriptions that accurately reflect the skills, experience, and qualities needed for each position.",
              solution: "Conduct a job analysis by interviewing current successful employees and their managers. Identify the key skills and attributes that drive success in the role.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Define clear job requirements", "Create detailed job descriptions that accurately reflect the skills, experience, and qualities needed for each position."),
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
              consultInAction: generateConsultInAction("Expand recruitment channels", "Diversify your recruitment sources to reach a wider pool of qualified candidates."),
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
              consultInAction: generateConsultInAction("Implement structured interview process", "Create a standardized interview framework to evaluate candidates consistently and reduce bias."),
              resources: {
                talents: getRandomSubset(talents),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 4,
              title: "Implement onboarding program",
              description: "Develop a comprehensive onboarding process to quickly integrate new hires into your organization.",
              solution: "Create a 30-60-90 day plan for each new hire. Include role-specific training, meetings with key stakeholders, and regular check-ins with managers to ensure alignment and address any concerns.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement onboarding program", "Develop a comprehensive onboarding process to quickly integrate new hires into your organization."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            }
          ];
          analysis = "Your staffing difficulties are primarily caused by narrow recruitment channels and an unstructured hiring process. Expanding your talent acquisition approaches and implementing standardized evaluation methods will help attract and identify the right candidates more efficiently.";
        }
        
        // 3. Digital Marketing
        else if (problem.toLowerCase().includes("marketing") || problem.toLowerCase().includes("digital marketing") || problem.toLowerCase().includes("online presence")) {
          processSteps = [
            {
              id: 1,
              title: "Define your digital marketing strategy",
              description: "Create a comprehensive digital marketing plan aligned with your business objectives and target audience.",
              solution: "Conduct market research to identify your audience's online behavior. Set SMART goals for your digital marketing efforts and allocate budget across appropriate channels based on ROI potential.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Define digital marketing strategy", "Create a comprehensive digital marketing plan aligned with your business objectives and target audience."),
              resources: {
                experts: getRandomSubset(experts),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 2,
              title: "Optimize website for conversions",
              description: "Improve your website's structure and content to increase visitor engagement and conversion rates.",
              solution: "Implement A/B testing on key landing pages. Improve page load speeds, simplify navigation, and create clear calls-to-action. Use heat mapping tools to identify user behavior patterns.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Optimize website for conversions", "Improve your website's structure and content to increase visitor engagement and conversion rates."),
              resources: {
                services: getRandomSubset(services),
                conversations: getRandomSubset(conversations)
              }
            },
            {
              id: 3,
              title: "Implement content marketing strategy",
              description: "Develop valuable content that attracts and engages your target audience.",
              solution: "Create a content calendar with topics relevant to your audience. Develop a mix of blog posts, videos, infographics, and case studies. Focus on solving customer problems rather than promotional content.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement content marketing strategy", "Develop valuable content that attracts and engages your target audience."),
              resources: {
                talents: getRandomSubset(talents),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 4,
              title: "Leverage social media platforms",
              description: "Build a strategic presence on social media channels where your target audience is active.",
              solution: "Choose 2-3 platforms most relevant to your audience. Create platform-specific content strategies and posting schedules. Allocate resources for community management and paid social advertising.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Leverage social media platforms", "Build a strategic presence on social media channels where your target audience is active."),
              resources: {
                services: getRandomSubset(services),
                conversations: getRandomSubset(conversations)
              }
            }
          ];
          analysis = "Your digital marketing challenges stem from a fragmented approach and lack of strategic focus. By developing a cohesive strategy, optimizing your website, creating valuable content, and strategically using social media, you can significantly improve your online presence and customer acquisition.";
        }
        
        // 4. Financial Management
        else if (problem.toLowerCase().includes("finance") || problem.toLowerCase().includes("financial") || problem.toLowerCase().includes("cash flow")) {
          processSteps = [
            {
              id: 1,
              title: "Implement cash flow forecasting",
              description: "Develop a system to predict and monitor your business's cash inflows and outflows.",
              solution: "Create a 13-week rolling cash flow forecast that identifies major receipts and disbursements. Update it weekly and compare projections to actuals to improve accuracy over time.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement cash flow forecasting", "Develop a system to predict and monitor your business's cash inflows and outflows."),
              resources: {
                experts: getRandomSubset(experts),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 2,
              title: "Optimize accounts receivable process",
              description: "Improve your billing and collection procedures to accelerate cash inflows.",
              solution: "Implement electronic invoicing and payment options. Offer early payment discounts. Contact late-paying customers proactively and consider factoring for large invoices to improve cash position.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Optimize accounts receivable process", "Improve your billing and collection procedures to accelerate cash inflows."),
              resources: {
                services: getRandomSubset(services),
                conversations: getRandomSubset(conversations)
              }
            },
            {
              id: 3,
              title: "Manage accounts payable strategically",
              description: "Time your payments to vendors to maximize cash flow while maintaining good supplier relationships.",
              solution: "Negotiate favorable payment terms with suppliers. Consider corporate credit cards with rewards for regular expenses. Stagger payment dates across the month to smooth cash outflows.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Manage accounts payable strategically", "Time your payments to vendors to maximize cash flow while maintaining good supplier relationships."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            },
            {
              id: 4,
              title: "Implement regular financial reviews",
              description: "Establish a cadence for reviewing financial performance against key metrics.",
              solution: "Conduct monthly financial reviews examining P&L, balance sheet, cash flow, and key performance indicators. Create dashboards to visualize trends and identify issues early.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement regular financial reviews", "Establish a cadence for reviewing financial performance against key metrics."),
              resources: {
                trainings: getRandomSubset(trainings),
                services: getRandomSubset(services)
              }
            }
          ];
          analysis = "Your financial challenges are primarily related to cash flow management and lack of proactive financial planning. By implementing systematic forecasting, optimizing your accounts receivable and payable processes, and conducting regular financial reviews, you can significantly improve your business's financial health.";
        }
        
        // 5. Customer Acquisition
        else if (problem.toLowerCase().includes("customer acquisition") || problem.toLowerCase().includes("lead generation") || problem.toLowerCase().includes("finding customers")) {
          processSteps = [
            {
              id: 1,
              title: "Define ideal customer profile",
              description: "Create detailed profiles of your most valuable potential customers to focus acquisition efforts.",
              solution: "Analyze your current top customers to identify common characteristics. Develop detailed buyer personas including demographics, pain points, goals, and buying behaviors.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Define ideal customer profile", "Create detailed profiles of your most valuable potential customers to focus acquisition efforts."),
              resources: {
                experts: getRandomSubset(experts),
                conversations: getRandomSubset(conversations)
              }
            },
            {
              id: 2,
              title: "Develop multi-channel acquisition strategy",
              description: "Create an integrated approach to reaching potential customers across multiple touchpoints.",
              solution: "Select channels based on where your ideal customers spend time. Coordinate messaging across paid advertising, content marketing, social media, and direct outreach for maximum impact.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Develop multi-channel acquisition strategy", "Create an integrated approach to reaching potential customers across multiple touchpoints."),
              resources: {
                services: getRandomSubset(services),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 3,
              title: "Implement lead nurturing system",
              description: "Develop processes to engage prospects who aren't ready to buy immediately.",
              solution: "Create automated email sequences providing valuable information related to prospects' pain points. Implement lead scoring to identify when prospects are ready for sales conversation.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement lead nurturing system", "Develop processes to engage prospects who aren't ready to buy immediately."),
              resources: {
                services: getRandomSubset(services),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 4,
              title: "Optimize sales conversion process",
              description: "Refine your sales process to convert more qualified leads into customers.",
              solution: "Map the current sales process and identify conversion bottlenecks. Create standardized proposals and objection handling guidelines. Implement CRM system to track and analyze prospect interactions.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Optimize sales conversion process", "Refine your sales process to convert more qualified leads into customers."),
              resources: {
                experts: getRandomSubset(experts),
                talents: getRandomSubset(talents)
              }
            }
          ];
          analysis = "Your customer acquisition challenges stem from insufficiently targeted prospecting and an unstructured approach to lead generation. By clearly defining your ideal customers, developing a multi-channel strategy, implementing lead nurturing, and optimizing your sales process, you'll significantly improve both the quantity and quality of new customers.";
        }
        
        // 6. Product Development
        else if (problem.toLowerCase().includes("product development") || problem.toLowerCase().includes("innovation") || problem.toLowerCase().includes("new products")) {
          processSteps = [
            {
              id: 1,
              title: "Implement customer-centric research",
              description: "Gather deep insights into customer needs, pain points, and desires to drive product development.",
              solution: "Conduct customer interviews, surveys, and observational research. Create detailed user personas and journey maps to identify unmet needs and opportunity areas.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement customer-centric research", "Gather deep insights into customer needs, pain points, and desires to drive product development."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            },
            {
              id: 2,
              title: "Establish idea validation process",
              description: "Create a systematic approach to evaluating product ideas before significant investment.",
              solution: "Develop a standardized framework that assesses market opportunity, technical feasibility, and alignment with business strategy. Create rapid prototyping capabilities to test concepts with minimal resources.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Establish idea validation process", "Create a systematic approach to evaluating product ideas before significant investment."),
              resources: {
                trainings: getRandomSubset(trainings),
                conversations: getRandomSubset(conversations)
              }
            },
            {
              id: 3,
              title: "Implement agile development methodology",
              description: "Adopt an iterative approach to product development that allows for faster learning and adaptation.",
              solution: "Organize cross-functional teams around specific product initiatives. Implement Scrum or Kanban methodology with 1-2 week sprints. Prioritize backlog items based on customer value and strategic alignment.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement agile development methodology", "Adopt an iterative approach to product development that allows for faster learning and adaptation."),
              resources: {
                experts: getRandomSubset(experts),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 4,
              title: "Create go-to-market strategy",
              description: "Develop a comprehensive plan for successfully introducing new products to the market.",
              solution: "Define target segments and positioning for each new product. Create integrated marketing, sales, and customer success plans. Establish metrics to evaluate launch performance and inform rapid iterations.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Create go-to-market strategy", "Develop a comprehensive plan for successfully introducing new products to the market."),
              resources: {
                talents: getRandomSubset(talents),
                services: getRandomSubset(services)
              }
            }
          ];
          analysis = "Your product development challenges stem from insufficient customer insight and a linear rather than iterative approach. By implementing customer-centric research, establishing robust idea validation, adopting agile methodologies, and creating comprehensive go-to-market strategies, you'll significantly improve both the speed and success rate of new product initiatives.";
        }
        
        // 7. Customer Retention
        else if (problem.toLowerCase().includes("customer retention") || problem.toLowerCase().includes("customer loyalty") || problem.toLowerCase().includes("churn")) {
          processSteps = [
            {
              id: 1,
              title: "Implement customer feedback system",
              description: "Create systematic processes to collect, analyze, and act on customer feedback.",
              solution: "Deploy regular NPS surveys with follow-up questions. Implement periodic in-depth interviews with representative customers. Create a closed-loop feedback process to address individual concerns.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement customer feedback system", "Create systematic processes to collect, analyze, and act on customer feedback."),
              resources: {
                services: getRandomSubset(services),
                conversations: getRandomSubset(conversations)
              }
            },
            {
              id: 2,
              title: "Develop customer success program",
              description: "Create proactive processes to ensure customers achieve their desired outcomes with your product/service.",
              solution: "Map ideal customer journey and establish success milestones. Create educational content and training to accelerate time-to-value. Implement regular success check-ins with high-value customers.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Develop customer success program", "Create proactive processes to ensure customers achieve their desired outcomes with your product/service."),
              resources: {
                talents: getRandomSubset(talents),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 3,
              title: "Implement retention analytics",
              description: "Develop data-driven insights to predict and prevent customer churn.",
              solution: "Identify leading indicators of churn based on usage patterns and customer characteristics. Create early warning system to flag at-risk accounts. Develop targeted intervention strategies for different churn risk profiles.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement retention analytics", "Develop data-driven insights to predict and prevent customer churn."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            },
            {
              id: 4,
              title: "Create loyalty and advocacy program",
              description: "Develop structured initiatives to recognize and reward your most loyal customers.",
              solution: "Implement tiered loyalty program with meaningful benefits at each level. Create exclusive community for top customers. Develop formal referral program with appropriate incentives.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Create loyalty and advocacy program", "Develop structured initiatives to recognize and reward your most loyal customers."),
              resources: {
                services: getRandomSubset(services),
                conversations: getRandomSubset(conversations)
              }
            }
          ];
          analysis = "Your customer retention challenges stem from reactive rather than proactive customer management and insufficient insights into churn risk factors. By implementing robust feedback systems, developing a customer success program, leveraging retention analytics, and creating loyalty initiatives, you'll significantly reduce churn and increase customer lifetime value.";
        }
        
        // 8. E-commerce Optimization
        else if (problem.toLowerCase().includes("e-commerce") || problem.toLowerCase().includes("online store") || problem.toLowerCase().includes("online sales")) {
          processSteps = [
            {
              id: 1,
              title: "Optimize product discovery",
              description: "Improve how customers find and explore your products online.",
              solution: "Implement advanced search functionality with filters and autocomplete. Create intuitive category structure and navigation. Use AI-powered product recommendations based on browsing behavior.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Optimize product discovery", "Improve how customers find and explore your products online."),
              resources: {
                services: getRandomSubset(services),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 2,
              title: "Enhance product presentation",
              description: "Improve how products are showcased to increase conversion rates.",
              solution: "Create high-quality, zoomable product images from multiple angles. Add product videos and 360° views for complex products. Write detailed, benefit-focused product descriptions. Include customer reviews and ratings.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Enhance product presentation", "Improve how products are showcased to increase conversion rates."),
              resources: {
                talents: getRandomSubset(talents),
                services: getRandomSubset(services)
              }
            },
            {
              id: 3,
              title: "Streamline checkout process",
              description: "Reduce friction in the purchasing process to minimize cart abandonment.",
              solution: "Implement guest checkout option. Minimize form fields and steps. Add multiple payment methods including digital wallets. Use address validation to prevent errors. Create automated cart abandonment recovery emails.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Streamline checkout process", "Reduce friction in the purchasing process to minimize cart abandonment."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            },
            {
              id: 4,
              title: "Optimize mobile shopping experience",
              description: "Ensure your e-commerce platform delivers an excellent experience on mobile devices.",
              solution: "Implement responsive design that adapts to different screen sizes. Optimize page load speed for mobile networks. Create mobile-specific navigation and UI elements. Test thoroughly on various devices and browsers.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Optimize mobile shopping experience", "Ensure your e-commerce platform delivers an excellent experience on mobile devices."),
              resources: {
                trainings: getRandomSubset(trainings),
                services: getRandomSubset(services)
              }
            }
          ];
          analysis = "Your e-commerce challenges stem from friction in the online shopping experience and inadequate product presentation. By optimizing product discovery, enhancing product presentation, streamlining checkout, and improving mobile experience, you'll significantly increase conversion rates and average order value.";
        }
        
        // 9. Business Process Automation
        else if (problem.toLowerCase().includes("automation") || problem.toLowerCase().includes("efficiency") || problem.toLowerCase().includes("streamline operations")) {
          processSteps = [
            {
              id: 1,
              title: "Identify automation opportunities",
              description: "Systematically evaluate business processes to identify high-impact automation candidates.",
              solution: "Document current processes with detailed flowcharts. Prioritize processes based on volume, error rates, and strategic importance. Calculate potential ROI for automating each candidate process.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Identify automation opportunities", "Systematically evaluate business processes to identify high-impact automation candidates."),
              resources: {
                experts: getRandomSubset(experts),
                conversations: getRandomSubset(conversations)
              }
            },
            {
              id: 2,
              title: "Select appropriate automation tools",
              description: "Choose the right technology solutions for your specific automation needs.",
              solution: "Evaluate no-code/low-code platforms for citizen developers. Assess API availability for systems integration. Consider RPA tools for legacy system automation. Ensure scalability and security requirements are met.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Select appropriate automation tools", "Choose the right technology solutions for your specific automation needs."),
              resources: {
                services: getRandomSubset(services),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 3,
              title: "Implement process automation",
              description: "Deploy automation solutions with minimal disruption to ongoing operations.",
              solution: "Start with pilot implementation on non-critical processes. Create detailed documentation for automated workflows. Establish error handling and exception management protocols. Provide training for affected team members.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement process automation", "Deploy automation solutions with minimal disruption to ongoing operations."),
              resources: {
                experts: getRandomSubset(experts),
                talents: getRandomSubset(talents)
              }
            },
            {
              id: 4,
              title: "Monitor and optimize automated processes",
              description: "Ensure automated processes deliver expected results and continuously improve them.",
              solution: "Implement dashboards tracking automation performance metrics. Conduct regular reviews to identify optimization opportunities. Create feedback loops for users to report issues or suggest improvements.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Monitor and optimize automated processes", "Ensure automated processes deliver expected results and continuously improve them."),
              resources: {
                services: getRandomSubset(services),
                trainings: getRandomSubset(trainings)
              }
            }
          ];
          analysis = "Your operational efficiency challenges stem from manual, time-consuming processes that create bottlenecks and inconsistent results. By systematically identifying automation opportunities, selecting appropriate tools, implementing solutions strategically, and continuously monitoring results, you'll significantly increase productivity while reducing errors and costs.";
        }
        
        // 10. International Expansion
        else if (problem.toLowerCase().includes("international") || problem.toLowerCase().includes("global expansion") || problem.toLowerCase().includes("new markets")) {
          processSteps = [
            {
              id: 1,
              title: "Conduct international market assessment",
              description: "Evaluate potential international markets to identify the most promising expansion opportunities.",
              solution: "Analyze market size, growth trends, competitive landscape, and entry barriers for candidate countries. Assess cultural fit and adaptability of your offering. Create weighted scoring model to prioritize markets.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Conduct international market assessment", "Evaluate potential international markets to identify the most promising expansion opportunities."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            },
            {
              id: 2,
              title: "Develop market entry strategy",
              description: "Create a detailed plan for how to enter selected international markets.",
              solution: "Evaluate entry options (export, licensing, partnership, direct investment). Adapt product/service offering for local market needs. Develop localized pricing and positioning. Create detailed market entry timeline and milestones.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Develop market entry strategy", "Create a detailed plan for how to enter selected international markets."),
              resources: {
                trainings: getRandomSubset(trainings),
                conversations: getRandomSubset(conversations)
              }
            },
            {
              id: 3,
              title: "Establish international operations",
              description: "Build the operational infrastructure to support your international presence.",
              solution: "Address legal, tax, and regulatory requirements. Set up appropriate business entities. Establish banking, payment processing, and currency management. Develop supply chain and distribution networks for physical products.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Establish international operations", "Build the operational infrastructure to support your international presence."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            },
            {
              id: 4,
              title: "Build local team and partnerships",
              description: "Develop the relationships and human resources needed for successful market penetration.",
              solution: "Identify key roles requiring local expertise. Create hiring plan balancing expatriates and local talent. Develop partnerships with local distributors, agencies, or service providers. Implement cross-cultural training programs.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Build local team and partnerships", "Develop the relationships and human resources needed for successful market penetration."),
              resources: {
                talents: getRandomSubset(talents),
                trainings: getRandomSubset(trainings)
              }
            }
          ];
          analysis = "Your international expansion challenges stem from insufficient market intelligence and underestimation of operational complexity in new markets. By conducting thorough market assessment, developing targeted entry strategies, establishing robust operations, and building strong local teams and partnerships, you'll significantly increase your chances of international success.";
        }
        
        // 11. Strategic Planning
        else if (problem.toLowerCase().includes("strategic planning") || problem.toLowerCase().includes("business strategy") || problem.toLowerCase().includes("growth strategy")) {
          processSteps = [
            {
              id: 1,
              title: "Conduct strategic assessment",
              description: "Evaluate your current position and external environment to inform strategy development.",
              solution: "Analyze industry trends, competitive landscape, and market opportunities. Conduct internal capability assessment. Identify core strengths and vulnerabilities. Engage key stakeholders in SWOT analysis workshops.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Conduct strategic assessment", "Evaluate your current position and external environment to inform strategy development."),
              resources: {
                experts: getRandomSubset(experts),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 2,
              title: "Define strategic direction",
              description: "Establish clear vision, mission, and strategic priorities for your organization.",
              solution: "Facilitate executive workshops to align on vision and mission. Identify 3-5 key strategic priorities that will drive competitive advantage. Define measurable objectives for each priority. Create compelling narrative for communicating strategy.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Define strategic direction", "Establish clear vision, mission, and strategic priorities for your organization."),
              resources: {
                services: getRandomSubset(services),
                conversations: getRandomSubset(conversations)
              }
            },
            {
              id: 3,
              title: "Develop implementation roadmap",
              description: "Create actionable plans to translate strategy into operational reality.",
              solution: "Break strategic priorities into specific initiatives with clear ownership. Establish resource requirements and timelines for each initiative. Create dependencies map and critical path analysis. Develop risk mitigation strategies.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Develop implementation roadmap", "Create actionable plans to translate strategy into operational reality."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            },
            {
              id: 4,
              title: "Implement strategy management system",
              description: "Establish processes to monitor progress and ensure strategic alignment.",
              solution: "Create balanced scorecard with leading and lagging indicators for each priority. Implement regular strategy review meetings with standardized reporting. Establish process for refining strategy based on new information or changing conditions.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement strategy management system", "Establish processes to monitor progress and ensure strategic alignment."),
              resources: {
                trainings: getRandomSubset(trainings),
                services: getRandomSubset(services)
              }
            }
          ];
          analysis = "Your strategic challenges stem from unclear priorities and insufficient translation of strategy into actionable plans. By conducting thorough assessment, defining clear direction, developing detailed implementation roadmaps, and implementing robust management systems, you'll significantly improve strategic focus and execution.";
        }
        
        // 12. Operational Excellence
        else if (problem.toLowerCase().includes("operations") || problem.toLowerCase().includes("operational excellence") || problem.toLowerCase().includes("quality")) {
          processSteps = [
            {
              id: 1,
              title: "Implement process mapping and analysis",
              description: "Document and analyze current operational processes to identify improvement opportunities.",
              solution: "Create detailed process maps for key operational workflows. Identify non-value-added activities, bottlenecks, and quality issues. Calculate process cycle efficiency and prioritize improvement opportunities.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement process mapping and analysis", "Document and analyze current operational processes to identify improvement opportunities."),
              resources: {
                experts: getRandomSubset(experts),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 2,
              title: "Develop standard operating procedures",
              description: "Create clear documentation and training for consistent execution of operational processes.",
              solution: "Document best practices for critical processes. Create visual work instructions with clear steps and quality standards. Implement training program to ensure consistent execution. Establish process for continuous refinement of standards.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Develop standard operating procedures", "Create clear documentation and training for consistent execution of operational processes."),
              resources: {
                services: getRandomSubset(services),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 3,
              title: "Implement performance management system",
              description: "Create metrics and accountability for operational excellence.",
              solution: "Develop balanced set of operational KPIs covering quality, speed, cost, and safety. Create visual management dashboards visible to all employees. Implement daily performance dialogues to drive continuous improvement.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement performance management system", "Create metrics and accountability for operational excellence."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            },
            {
              id: 4,
              title: "Establish continuous improvement culture",
              description: "Build organizational capabilities and mindsets for ongoing operational excellence.",
              solution: "Train employees in problem-solving methodologies like PDCA or DMAIC. Implement structured process for capturing and implementing improvement ideas. Recognize and reward contributions to operational excellence.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Establish continuous improvement culture", "Build organizational capabilities and mindsets for ongoing operational excellence."),
              resources: {
                trainings: getRandomSubset(trainings),
                conversations: getRandomSubset(conversations)
              }
            }
          ];
          analysis = "Your operational challenges stem from inconsistent processes, unclear performance standards, and reactive problem-solving. By implementing systematic process analysis, developing clear standard operating procedures, creating robust performance management, and establishing a continuous improvement culture, you'll significantly enhance operational efficiency and quality.";
        }
        
        // 13. Customer Experience
        else if (problem.toLowerCase().includes("customer experience") || problem.toLowerCase().includes("customer satisfaction") || problem.toLowerCase().includes("customer service")) {
          processSteps = [
            {
              id: 1,
              title: "Map customer journey",
              description: "Document the end-to-end customer experience across all touchpoints with your business.",
              solution: "Create detailed journey maps for key customer segments. Identify moments of truth and pain points. Collect qualitative and quantitative data at each touchpoint. Benchmark against competitors and best practices.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Map customer journey", "Document the end-to-end customer experience across all touchpoints with your business."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            },
            {
              id: 2,
              title: "Redesign critical touchpoints",
              description: "Transform high-impact customer interactions to deliver exceptional experiences.",
              solution: "Prioritize touchpoints based on customer importance and current performance gaps. Redesign experiences using human-centered design methods. Implement changes in phases, starting with quick wins for momentum.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Redesign critical touchpoints", "Transform high-impact customer interactions to deliver exceptional experiences."),
              resources: {
                talents: getRandomSubset(talents),
                services: getRandomSubset(services)
              }
            },
            {
              id: 3,
              title: "Implement CX measurement system",
              description: "Create a comprehensive approach to measuring and improving customer experience.",
              solution: "Implement real-time feedback collection at key touchpoints. Deploy relationship surveys (NPS, CSAT) to measure overall experience. Create CX dashboard connecting experience metrics to business outcomes. Establish clear ownership for improvements.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement CX measurement system", "Create a comprehensive approach to measuring and improving customer experience."),
              resources: {
                services: getRandomSubset(services),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 4,
              title: "Develop customer-centric culture",
              description: "Build organizational capabilities and mindsets that prioritize customer experience.",
              solution: "Create customer experience vision and principles. Incorporate CX metrics into performance management and incentives. Implement customer immersion programs for all employees. Share customer stories in company communications.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Develop customer-centric culture", "Build organizational capabilities and mindsets that prioritize customer experience."),
              resources: {
                trainings: getRandomSubset(trainings),
                conversations: getRandomSubset(conversations)
              }
            }
          ];
          analysis = "Your customer experience challenges stem from fragmented touchpoints and insufficient understanding of customer needs and expectations. By mapping the customer journey, redesigning critical touchpoints, implementing robust measurement systems, and developing a customer-centric culture, you'll significantly enhance customer satisfaction and loyalty.";
        }
        
        // 14. Data-Driven Decision Making
        else if (problem.toLowerCase().includes("data") || problem.toLowerCase().includes("analytics") || problem.toLowerCase().includes("business intelligence")) {
          processSteps = [
            {
              id: 1,
              title: "Define data strategy and governance",
              description: "Establish clear framework for how data will be managed and utilized in your organization.",
              solution: "Define critical business questions that data should answer. Establish data ownership, quality standards, and governance policies. Create data dictionary and metadata repository. Develop data privacy and security protocols.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Define data strategy and governance", "Establish clear framework for how data will be managed and utilized in your organization."),
              resources: {
                experts: getRandomSubset(experts),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 2,
              title: "Implement data infrastructure",
              description: "Build the technical foundation for collecting, storing, and accessing business data.",
              solution: "Evaluate data warehouse vs. lake architecture based on needs. Implement data integration and ETL processes. Ensure scalability for growing data volumes. Establish backup, recovery, and business continuity protocols.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement data infrastructure", "Build the technical foundation for collecting, storing, and accessing business data."),
              resources: {
                talents: getRandomSubset(talents),
                services: getRandomSubset(services)
              }
            },
            {
              id: 3,
              title: "Develop analytics capabilities",
              description: "Create tools and processes for generating actionable insights from data.",
              solution: "Implement self-service BI tools for business users. Develop standardized reports and dashboards for key metrics. Build advanced analytics capabilities for predictive insights. Create insight-to-action processes for key decisions.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Develop analytics capabilities", "Create tools and processes for generating actionable insights from data."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            },
            {
              id: 4,
              title: "Build data-driven culture",
              description: "Develop organizational capabilities and mindsets for data-based decision making.",
              solution: "Provide data literacy training for all employees. Incorporate data-driven decision making into leadership behaviors and expectations. Create data champions in each business unit. Celebrate wins from data-driven decisions.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Build data-driven culture", "Develop organizational capabilities and mindsets for data-based decision making."),
              resources: {
                trainings: getRandomSubset(trainings),
                conversations: getRandomSubset(conversations)
              }
            }
          ];
          analysis = "Your data challenges stem from fragmented information systems, inconsistent data quality, and insufficient analytical capabilities. By establishing clear data strategy and governance, implementing robust infrastructure, developing analytics capabilities, and building a data-driven culture, you'll significantly enhance your ability to make informed, effective business decisions.";
        }
        
        // 15. Talent Development
        else if (problem.toLowerCase().includes("talent development") || problem.toLowerCase().includes("employee development") || problem.toLowerCase().includes("training")) {
          processSteps = [
            {
              id: 1,
              title: "Conduct skills gap analysis",
              description: "Identify critical capability gaps that impact business performance.",
              solution: "Define current and future capability requirements for key roles. Assess current capabilities through skills assessments and performance data. Prioritize development needs based on business impact and urgency.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Conduct skills gap analysis", "Identify critical capability gaps that impact business performance."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            },
            {
              id: 2,
              title: "Develop learning architecture",
              description: "Create integrated framework for delivering diverse learning experiences.",
              solution: "Implement 70-20-10 development model (experiential, social, formal). Create blended learning journeys for key roles combining digital, classroom, and on-the-job components. Leverage microlearning for just-in-time knowledge.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Develop learning architecture", "Create integrated framework for delivering diverse learning experiences."),
              resources: {
                trainings: getRandomSubset(trainings),
                services: getRandomSubset(services)
              }
            },
            {
              id: 3,
              title: "Implement career development framework",
              description: "Create structured approach to employee growth and advancement.",
              solution: "Define clear career paths within and across functions. Create competency models for key roles. Implement regular career conversations and individual development planning. Provide career self-assessment tools.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement career development framework", "Create structured approach to employee growth and advancement."),
              resources: {
                experts: getRandomSubset(experts),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 4,
              title: "Build continuous learning culture",
              description: "Foster organizational environment that encourages ongoing development.",
              solution: "Incorporate learning objectives into performance management. Recognize and reward continuous improvement. Create peer learning communities and mentoring programs. Provide leaders with coaching skills training.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Build continuous learning culture", "Foster organizational environment that encourages ongoing development."),
              resources: {
                talents: getRandomSubset(talents),
                conversations: getRandomSubset(conversations)
              }
            }
          ];
          analysis = "Your talent development challenges stem from reactive approach to training and insufficient connection between development activities and business outcomes. By conducting thorough skills gap analysis, implementing integrated learning architecture, creating clear career frameworks, and building a continuous learning culture, you'll significantly enhance employee capabilities and engagement.";
        }
        
        // 16. Change Management
        else if (problem.toLowerCase().includes("change management") || problem.toLowerCase().includes("transformation") || problem.toLowerCase().includes("organizational change")) {
          processSteps = [
            {
              id: 1,
              title: "Develop change vision and strategy",
              description: "Create compelling narrative for why change is necessary and what it will achieve.",
              solution: "Articulate clear case for change linking organizational challenges to proposed solutions. Define desired future state in concrete terms. Create messaging that connects change to organizational purpose and individual motivations.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Develop change vision and strategy", "Create compelling narrative for why change is necessary and what it will achieve."),
              resources: {
                experts: getRandomSubset(experts),
                conversations: getRandomSubset(conversations)
              }
            },
            {
              id: 2,
              title: "Build change leadership coalition",
              description: "Engage key stakeholders and influencers to drive change throughout the organization.",
              solution: "Identify formal and informal leaders across all levels. Provide coalition members with change leadership training and tools. Create regular forums for alignment and coordinated action. Empower change agents with decision-making authority.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Build change leadership coalition", "Engage key stakeholders and influencers to drive change throughout the organization."),
              resources: {
                talents: getRandomSubset(talents),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 3,
              title: "Implement structured change process",
              description: "Create systematic approach to planning and executing change initiatives.",
              solution: "Conduct stakeholder analysis and impact assessment for all affected groups. Develop detailed implementation plans with clear milestones. Create two-way communication channels for feedback. Provide necessary training and support resources.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement structured change process", "Create systematic approach to planning and executing change initiatives."),
              resources: {
                services: getRandomSubset(services),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 4,
              title: "Sustain and embed changes",
              description: "Ensure changes become part of normal operations and don't revert to previous state.",
              solution: "Align performance management, recognition, and reward systems with desired behaviors. Provide ongoing coaching and feedback to reinforce changes. Monitor adoption metrics and address backsliding quickly. Celebrate and publicize successes.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Sustain and embed changes", "Ensure changes become part of normal operations and don't revert to previous state."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            }
          ];
          analysis = "Your change management challenges stem from insufficient stakeholder engagement and inadequate implementation planning. By developing a compelling change vision, building a strong leadership coalition, implementing structured change processes, and creating sustainability mechanisms, you'll significantly increase the success rate of your transformation initiatives.";
        }
        
        // 17. Team Collaboration
        else if (problem.toLowerCase().includes("team") || problem.toLowerCase().includes("collaboration") || problem.toLowerCase().includes("teamwork")) {
          processSteps = [
            {
              id: 1,
              title: "Establish team purpose and goals",
              description: "Create clarity about why the team exists and what it needs to achieve.",
              solution: "Facilitate workshop to define team purpose and link to organizational objectives. Develop SMART team goals with clear metrics and milestones. Create team charter documenting purpose, goals, roles, and working agreements.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Establish team purpose and goals", "Create clarity about why the team exists and what it needs to achieve."),
              resources: {
                experts: getRandomSubset(experts),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 2,
              title: "Implement effective meeting practices",
              description: "Transform team meetings into productive, engaging collaboration sessions.",
              solution: "Create different meeting formats optimized for different purposes (decision-making, problem-solving, information sharing). Implement meeting preparation and follow-up disciplines. Establish effective facilitation practices and rotate facilitator role.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement effective meeting practices", "Transform team meetings into productive, engaging collaboration sessions."),
              resources: {
                trainings: getRandomSubset(trainings),
                services: getRandomSubset(services)
              }
            },
            {
              id: 3,
              title: "Adopt collaboration tools and practices",
              description: "Implement technologies and processes that enhance team coordination and knowledge sharing.",
              solution: "Select collaboration platforms aligned with team workflows. Create clear conventions for tool usage and information organization. Establish asynchronous communication practices that respect focus time. Document key decisions and action items.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Adopt collaboration tools and practices", "Implement technologies and processes that enhance team coordination and knowledge sharing."),
              resources: {
                services: getRandomSubset(services),
                conversations: getRandomSubset(conversations)
              }
            },
            {
              id: 4,
              title: "Develop team feedback and learning practices",
              description: "Build capabilities for continuous team improvement and adaptation.",
              solution: "Implement regular team retrospectives to reflect on performance and identify improvements. Create psychological safety through leader modeling and reinforcement. Establish peer feedback processes. Celebrate team learning and improvement.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Develop team feedback and learning practices", "Build capabilities for continuous team improvement and adaptation."),
              resources: {
                experts: getRandomSubset(experts),
                trainings: getRandomSubset(trainings)
              }
            }
          ];
          analysis = "Your team collaboration challenges stem from unclear shared purpose and ineffective communication practices. By establishing clear team purpose and goals, implementing effective meeting practices, adopting appropriate collaboration tools, and developing feedback and learning capabilities, you'll significantly enhance team productivity and engagement.";
        }
        
        // 18. Digital Transformation
        else if (problem.toLowerCase().includes("digital transformation") || problem.toLowerCase().includes("digitalization") || problem.toLowerCase().includes("technology transformation")) {
          processSteps = [
            {
              id: 1,
              title: "Develop digital vision and roadmap",
              description: "Create clear direction for how digital technologies will transform your business.",
              solution: "Assess digital maturity across business dimensions. Identify high-impact digital opportunities aligned with business strategy. Prioritize initiatives based on business value and implementation complexity. Create phased implementation roadmap.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Develop digital vision and roadmap", "Create clear direction for how digital technologies will transform your business."),
              resources: {
                experts: getRandomSubset(experts),
                conversations: getRandomSubset(conversations)
              }
            },
            {
              id: 2,
              title: "Establish digital governance",
              description: "Create structure and processes for managing digital initiatives effectively.",
              solution: "Define roles and decision rights for digital initiatives. Implement agile governance balancing autonomy with alignment. Establish technology standards and architectural principles. Create innovation funding mechanisms separate from operational budgets.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Establish digital governance", "Create structure and processes for managing digital initiatives effectively."),
              resources: {
                services: getRandomSubset(services),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 3,
              title: "Build digital capabilities",
              description: "Develop the technical skills and resources needed for digital initiatives.",
              solution: "Assess capability gaps across technical and business roles. Implement targeted upskilling programs for existing staff. Develop talent acquisition strategy for critical digital roles. Create strategic partnerships for specialized capabilities.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Build digital capabilities", "Develop the technical skills and resources needed for digital initiatives."),
              resources: {
                talents: getRandomSubset(talents),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 4,
              title: "Foster digital culture and ways of working",
              description: "Transform organizational mindsets and behaviors to enable digital success.",
              solution: "Implement agile methodologies across digital initiatives. Establish cross-functional teams with end-to-end ownership. Create innovation lab or digital accelerator for rapid experimentation. Recognize and reward digital behaviors like experimentation and collaboration.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Foster digital culture and ways of working", "Transform organizational mindsets and behaviors to enable digital success."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            }
          ];
          analysis = "Your digital transformation challenges stem from fragmented initiatives and insufficient alignment between technology and business strategy. By developing a clear digital vision and roadmap, establishing effective governance, building critical capabilities, and fostering a digital culture, you'll significantly increase the business impact of your digital investments.";
        }
        
        // 19. Pricing Strategy
        else if (problem.toLowerCase().includes("pricing") || problem.toLowerCase().includes("price strategy") || problem.toLowerCase().includes("monetization")) {
          processSteps = [
            {
              id: 1,
              title: "Conduct pricing analysis",
              description: "Gather data and insights to inform pricing decisions.",
              solution: "Analyze price elasticity and customer willingness to pay. Conduct competitive pricing assessment across segments. Calculate cost-to-serve for different customer types. Identify value drivers from customer perspective.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Conduct pricing analysis", "Gather data and insights to inform pricing decisions."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            },
            {
              id: 2,
              title: "Develop value-based pricing strategy",
              description: "Create pricing approach aligned with customer value perception and business objectives.",
              solution: "Segment customers based on value perception and price sensitivity. Define pricing metrics aligned with customer value (e.g., outcome-based, consumption-based). Design optimal price structure and levels for each segment.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Develop value-based pricing strategy", "Create pricing approach aligned with customer value perception and business objectives."),
              resources: {
                trainings: getRandomSubset(trainings),
                conversations: getRandomSubset(conversations)
              }
            },
            {
              id: 3,
              title: "Implement price execution capabilities",
              description: "Build organizational processes and tools to execute pricing strategy effectively.",
              solution: "Create pricing tools and analytics dashboards. Develop clear discount policies and approval workflows. Implement sales enablement to communicate value and justify pricing. Establish win/loss analysis for pricing-related decisions.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement price execution capabilities", "Build organizational processes and tools to execute pricing strategy effectively."),
              resources: {
                talents: getRandomSubset(talents),
                services: getRandomSubset(services)
              }
            },
            {
              id: 4,
              title: "Establish continuous pricing optimization",
              description: "Create processes for monitoring and refining pricing approach over time.",
              solution: "Implement price realization tracking and analysis. Conduct regular price sensitivity testing. Develop competitive intelligence capabilities. Create cross-functional pricing council for ongoing governance.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Establish continuous pricing optimization", "Create processes for monitoring and refining pricing approach over time."),
              resources: {
                experts: getRandomSubset(experts),
                trainings: getRandomSubset(trainings)
              }
            }
          ];
          analysis = "Your pricing challenges stem from cost-based rather than value-based approaches and inconsistent execution across the organization. By conducting thorough pricing analysis, developing value-based strategies, implementing robust execution capabilities, and establishing continuous optimization processes, you'll significantly enhance pricing effectiveness and profitability.";
        }
        
        // 20. Leadership Development
        else if (problem.toLowerCase().includes("leadership") || problem.toLowerCase().includes("management development") || problem.toLowerCase().includes("executive development")) {
          processSteps = [
            {
              id: 1,
              title: "Define leadership competency model",
              description: "Establish clear expectations for leadership behaviors and capabilities.",
              solution: "Define leadership competencies aligned with business strategy and values. Create progression framework showing how competencies evolve at different levels. Incorporate diverse perspectives in competency development.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Define leadership competency model", "Establish clear expectations for leadership behaviors and capabilities."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            },
            {
              id: 2,
              title: "Implement leadership assessment process",
              description: "Create comprehensive approach to evaluating leadership effectiveness.",
              solution: "Implement 360-degree feedback for all leaders. Use valid psychometric assessments for deeper insights. Create assessment centers for high-potential identification. Provide structured coaching to process feedback and create development plans.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Implement leadership assessment process", "Create comprehensive approach to evaluating leadership effectiveness."),
              resources: {
                trainings: getRandomSubset(trainings),
                services: getRandomSubset(services)
              }
            },
            {
              id: 3,
              title: "Develop leadership academy",
              description: "Create structured development experiences for leaders at all levels.",
              solution: "Design modular curriculum addressing different leadership levels and competencies. Implement blended learning approach combining cohort-based programs, coaching, and applied projects. Create peer learning communities for ongoing development.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Develop leadership academy", "Create structured development experiences for leaders at all levels."),
              resources: {
                talents: getRandomSubset(talents),
                trainings: getRandomSubset(trainings)
              }
            },
            {
              id: 4,
              title: "Establish succession planning process",
              description: "Create systematic approach to identifying and developing future leaders.",
              solution: "Implement talent review process to identify high-potential leaders. Create targeted development experiences for succession candidates. Establish emergency succession plans for critical roles. Measure and improve diversity in leadership pipeline.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Establish succession planning process", "Create systematic approach to identifying and developing future leaders."),
              resources: {
                experts: getRandomSubset(experts),
                conversations: getRandomSubset(conversations)
              }
            }
          ];
          analysis = "Your leadership development challenges stem from inconsistent expectations and fragmented development approaches. By defining clear competency models, implementing robust assessment processes, creating comprehensive development programs, and establishing effective succession planning, you'll significantly enhance leadership quality and bench strength across your organization.";
        }
        
        // Default case for any other type of problem
        else {
          processSteps = [
            {
              id: 1,
              title: "Analyze current situation",
              description: "Gather relevant data and assess the current state of your business to understand the root causes of the problem.",
              solution: "Conduct a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) focused specifically on the problem area. Identify key metrics to measure the current situation and track improvement.",
              networkComments: generateNetworkComments(),
              consultInAction: generateConsultInAction("Analyze current situation", "Gather relevant data and assess the current state of your business to understand the root causes of the problem."),
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
              consultInAction: generateConsultInAction("Develop an action plan", "Create a detailed strategy with specific, measurable goals and timeline for implementation."),
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
              consultInAction: generateConsultInAction("Implement solution", "Execute your action plan methodically while monitoring progress and making adjustments as needed."),
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
              consultInAction: generateConsultInAction("Measure results and refine approach", "Evaluate the effectiveness of your solution and make necessary adjustments for continuous improvement."),
              resources: {
                experts: getRandomSubset(experts),
                services: getRandomSubset(services)
              }
            }
          ];
          
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
