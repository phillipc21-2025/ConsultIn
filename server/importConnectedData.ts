import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { storage } from './storage';
import { 
  InsertExpert, 
  InsertConversation, 
  InsertTalent, 
  InsertTraining, 
  InsertService,
  InsertBusinessProblem,
  ProcessStep,
  SolutionResponse,
  NetworkComment,
  ConsultInAction,
  Expert,
  Conversation,
  Talent,
  Training,
  Service
} from '@shared/schema';

// Define path to data files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, '../data/mock_brewery');
const replitDataPath = join(__dirname, '../data/replit_data.json');

// Maps to store the ids of created entities
const expertMap = new Map<string, number>();
const conversationMap = new Map<string, number>();
const talentMap = new Map<string, number>();
const trainingMap = new Map<string, number>();
const serviceMap = new Map<string, number>();
const stepMap = new Map<string, any>();

// Function to read JSON file
function readJsonFile(filename: string) {
  const filePath = join(dataDir, filename);
  const fileContent = readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
}

// Map provider data to services
async function importProviders() {
  console.log('Importing providers as services...');
  const providers = readJsonFile('providers.json');
  
  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i];
    try {
      const service: InsertService = {
        name: provider.service_name,
        description: provider.service_description,
        icon: null,
        usageStats: "Used by 100+ breweries",
        pricing: "Contact for pricing"
      };
      
      const createdService = await storage.createService(service);
      serviceMap.set(`service${i + 1}`, createdService.id);
    } catch (error) {
      console.error(`Error importing provider ${provider.id}:`, error);
    }
  }
  console.log(`Imported ${providers.length} providers as services`);
}

// Map freelancers to experts
async function importFreelancers() {
  console.log('Importing freelancers as experts...');
  const freelancers = readJsonFile('freelancers.json');
  
  for (let i = 0; i < freelancers.length; i++) {
    const freelancer = freelancers[i];
    try {
      const expert: InsertExpert = {
        name: `${freelancer.first_name} ${freelancer.last_name}`,
        title: freelancer.job_title,
        company: freelancer.company,
        profileImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
        connections: Math.floor(Math.random() * 1000) + 500,
        experience: freelancer.summary
      };
      
      const createdExpert = await storage.createExpert(expert);
      expertMap.set(`expert${i + 1}`, createdExpert.id);
    } catch (error) {
      console.error(`Error importing freelancer ${freelancer.id}:`, error);
    }
  }
  console.log(`Imported ${freelancers.length} freelancers as experts`);
}

// Map courses to trainings
async function importCourses() {
  console.log('Importing courses as trainings...');
  const courses = readJsonFile('courses.json');
  
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    try {
      const training: InsertTraining = {
        title: course.course_name,
        provider: course.platform,
        duration: `${course.hours} hours`,
        thumbnail: "https://placehold.co/300x200?text=Course+Thumbnail",
        description: `A ${course.difficulty.toLowerCase()} level course on ${course.course_name.toLowerCase()}.`,
        rating: `${(3.5 + Math.random() * 1.5).toFixed(1)}/5.0`,
        reviewCount: Math.floor(Math.random() * 500) + 100
      };
      
      const createdTraining = await storage.createTraining(training);
      trainingMap.set(`training${i + 1}`, createdTraining.id);
    } catch (error) {
      console.error(`Error importing course ${course.id}:`, error);
    }
  }
  console.log(`Imported ${courses.length} courses as trainings`);
}

// Import question data for conversations
async function importQuestions() {
  console.log('Importing questions for conversations...');
  const questions = readJsonFile('questions.json');
  
  for (let qIdx = 0; qIdx < questions.length; qIdx++) {
    const question = questions[qIdx];
    try {
      // Create conversation out of each question's comments (if any)
      if (question.comments && question.comments.length > 0) {
        for (let cIdx = 0; cIdx < Math.min(5, question.comments.length); cIdx++) {
          const comment = question.comments[cIdx];
          const conversation: InsertConversation = {
            authorName: `${comment.first_name} ${comment.last_name}`,
            authorTitle: comment.job_title,
            authorImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
            content: comment.comment_text || `Discussion about: ${question.summary}`,
            postedTime: `${Math.floor(Math.random() * 8) + 1} days ago`,
            likes: Math.floor(Math.random() * 50) + 1,
            comments: Math.floor(Math.random() * 10)
          };
          
          const createdConversation = await storage.createConversation(conversation);
          conversationMap.set(`conv${qIdx * 5 + cIdx + 1}`, createdConversation.id);
        }
      }
    } catch (error) {
      console.error(`Error importing question ${question.id}:`, error);
    }
  }
  console.log('Imported questions for conversations');
}

// Import steps data for talents
async function importTalents() {
  console.log('Importing talents...');
  
  // Randomly generate talents
  const talentNames = [
    "Sarah Johnson", "Michael Chen", "Raj Patel", "Emma Wilson", 
    "Carlos Rodriguez", "Aisha Khan", "David Kim", "Olivia Garcia",
    "James Thompson", "Maya Gupta", "Thomas Anderson", "Sophie Martin",
    "John Smith", "Lisa Wang", "Alex Rivera", "Priya Sharma",
    "Nathan Lee", "Zoe Miller", "Daniel Nguyen", "Fatima Ali",
    "Ryan Park", "Isabella Martinez", "Kevin Wong", "Sophia Patel",
    "Ethan Brown", "Maria Gonzalez", "William Liu", "Aiden Johnson",
    "Ava Davis", "Mason Rodriguez", "Ella Thompson", "Noah Garcia",
    "Harper Wilson", "Lucas Martin", "Mia Nguyen", "Benjamin Kim",
    "Amelia Chen", "Jackson Ali", "Evelyn Patel", "Henry Sharma", 
    "Scarlett Wang", "Gabriel Rivera", "Abigail Miller", "Owen Lee",
    "Lily Martinez", "Logan Wong"
  ];
  
  const talentTitles = [
    "Brewery Operations Specialist", "Supply Chain Manager", "Marketing Director",
    "Sales Representative", "Process Improvement Consultant", "Quality Assurance Analyst",
    "Distribution Coordinator", "Customer Experience Manager", "Events Coordinator",
    "Taproom Manager", "Sustainability Coordinator", "Product Development Lead",
    "Operations Analyst", "Logistics Specialist", "Digital Marketing Strategist"
  ];
  
  // Generate 45 talents to match our referenced IDs
  const talentCount = 45;
  
  for (let i = 0; i < talentCount; i++) {
    try {
      // Use a name from our list
      const nameIndex = i % talentNames.length;
      const name = talentNames[nameIndex];
      // Get a random title
      const title = talentTitles[Math.floor(Math.random() * talentTitles.length)];
      
      const talent: InsertTalent = {
        name: name,
        title: title,
        profileImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
        location: ["Boston, MA", "Portland, OR", "Denver, CO", "Austin, TX", "San Diego, CA"][Math.floor(Math.random() * 5)],
        availability: ["Full-time", "Part-time", "Contract", "Freelance"][Math.floor(Math.random() * 4)]
      };
      
      const createdTalent = await storage.createTalent(talent);
      talentMap.set(`talent${i + 1}`, createdTalent.id);
    } catch (error) {
      console.error(`Error importing talent ${i}:`, error);
    }
  }
  
  console.log(`Imported ${talentCount} talents`);
}

// Import steps from steps.json
async function importSteps() {
  console.log('Importing steps...');
  const steps = readJsonFile('steps.json');
  
  for (const step of steps) {
    try {
      stepMap.set(step.step_id, step);
    } catch (error) {
      console.error(`Error importing step ${step.step_id}:`, error);
    }
  }
  
  console.log(`Imported ${steps.length} steps`);
}

// Generate a sample ConsultIn action based on step content
function generateConsultInAction(stepTitle: string, stepDescription: string): ConsultInAction {
  // Randomly choose an action type, with bias toward email
  const randomNum = Math.random();
  if (randomNum < 0.5) {
    // Email action (50% chance)
    return {
      type: 'email',
      recipient: "[Recipient Email]",
      subject: `Action required: ${stepTitle} implementation`,
      body: `Dear [Recipient],\n\nFollowing our recent business analysis, we need to implement a solution to ${stepDescription.toLowerCase()}\n\nOur recommended approach is to:\n\n1. Begin with a comprehensive assessment\n2. Develop an implementation plan with specific milestones\n3. Allocate resources appropriately\n4. Set up regular progress reviews\n\nPlease let me know if you have any questions or would like to discuss this further.\n\nRegards,\n[Your Name]\n[Your Company]`,
      ccList: ["[Team Member]", "[Stakeholder]"]
    };
  } else if (randomNum < 0.8) {
    // Form action (30% chance)
    return {
      type: 'form',
      formTitle: `${stepTitle} Implementation Form`,
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
}

// Create network comments for process steps based on actual comments
function generateNetworkComments(questionId: number): NetworkComment[] {
  const questions = readJsonFile('questions.json');
  const question = questions.find(q => q.id === questionId);
  
  if (!question || !question.comments) {
    return [];
  }
  
  return question.comments.slice(0, 5).map((comment, idx) => {
    return {
      id: idx + 1,
      authorName: `${comment.first_name} ${comment.last_name}`,
      authorTitle: comment.job_title,
      authorCompany: comment.company,
      authorImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
      content: comment.comment_text,
      sentiment: comment.sentiment as 'positive' | 'negative' | 'neutral',
      postedTime: `${comment.days_ago} days ago`,
      likes: comment.likes
    };
  });
}

// Create connected business problems and solutions from replit_data.json
async function importConnectedProblems() {
  console.log('Importing connected business problems...');
  const replitData = JSON.parse(readFileSync(replitDataPath, 'utf8'));
  const { questions } = replitData;
  
  for (const question of questions) {
    try {
      const questionData = {
        id: question.id,
        text: question.text,
        steps: question.steps,
        related_experts: question.related_experts,
        related_conversations: question.related_conversations,
        related_talents: question.related_talents,
        related_trainings: question.related_trainings,
        related_services: question.related_services
      };
      
      // Create a business problem for this question
      const businessProblem: InsertBusinessProblem = {
        userId: 1, // Default user
        problem: questionData.text,
        solution: null, // We'll update this after creating it
        createdAt: new Date().toISOString()
      };
      
      const createdProblem = await storage.createBusinessProblem(businessProblem);
      
      // Create process steps
      const processSteps: ProcessStep[] = [];
      
      // Add each step from the steps file
      for (const stepId of questionData.steps) {
        const stepData = stepMap.get(stepId);
        
        if (stepData) {
          const questionNumber = parseInt(stepData.question_id);

          // Get the ids for resources
          const expertIds = stepData.freelancer_ids.map(id => expertMap.get(id) || expertMap.get('expert1')).filter(Boolean);
          const serviceIds = stepData.service_provider_ids.map(id => serviceMap.get(id) || serviceMap.get('service1')).filter(Boolean);
          const trainingIds = stepData.course_ids.map(id => trainingMap.get(id) || trainingMap.get('training1')).filter(Boolean);
          
          // Get the resources
          const experts = await Promise.all(expertIds.map(id => storage.getExpertById(id)));
          const services = await Promise.all(serviceIds.map(id => storage.getServiceById(id)));
          const trainings = await Promise.all(trainingIds.map(id => storage.getTrainingById(id)));
          
          // Get related conversations and talents
          const talentKeys = questionData.related_talents.slice(0, 4);
          const conversationKeys = questionData.related_conversations.slice(0, 4);
          
          const talentIds = talentKeys.map(key => talentMap.get(key) || talentMap.get('talent1')).filter(Boolean);
          const conversationIds = conversationKeys.map(key => conversationMap.get(key) || conversationMap.get('conv1')).filter(Boolean);
          
          const talents = await Promise.all(talentIds.map(id => storage.getTalentById(id)));
          const conversations = await Promise.all(conversationIds.map(id => storage.getConversationById(id)));
          
          processSteps.push({
            id: processSteps.length + 1,
            title: stepData.step_name,
            description: stepData.description,
            solution: stepData.rationale,
            networkComments: generateNetworkComments(questionNumber),
            consultInAction: generateConsultInAction(stepData.step_name, stepData.description),
            resources: {
              experts: experts.filter(Boolean),
              conversations: conversations.filter(Boolean),
              talents: talents.filter(Boolean),
              trainings: trainings.filter(Boolean),
              services: services.filter(Boolean)
            }
          });
        }
      }
      
      // Create a solution
      const expertIds = questionData.related_experts.map(key => talentMap.get(key) || talentMap.get('talent1')).filter(Boolean);
      const experts = await Promise.all(expertIds.map(id => storage.getTalentById(id)));
      
      const conversationIds = questionData.related_conversations.map(key => conversationMap.get(key) || conversationMap.get('conv1')).filter(Boolean);
      const conversations = await Promise.all(conversationIds.map(id => storage.getConversationById(id)));
      
      const talentIds = questionData.related_talents.slice(0, 8).map(key => talentMap.get(key) || talentMap.get('talent1')).filter(Boolean);
      const talents = await Promise.all(talentIds.map(id => storage.getTalentById(id)));
      
      const trainingIds = questionData.related_trainings.slice(0, 8).map(key => trainingMap.get(key) || trainingMap.get('training1')).filter(Boolean);
      const trainings = await Promise.all(trainingIds.map(id => storage.getTrainingById(id)));
      
      const serviceIds = questionData.related_services.slice(0, 8).map(key => serviceMap.get(key) || serviceMap.get('service1')).filter(Boolean);
      const services = await Promise.all(serviceIds.map(id => storage.getServiceById(id)));
      
      const solution: SolutionResponse = {
        analysis: `Analysis of problem: ${questionData.text}`,
        experts: experts.filter(Boolean),
        conversations: conversations.filter(Boolean),
        talents: talents.filter(Boolean),
        trainings: trainings.filter(Boolean),
        services: services.filter(Boolean),
        processSteps
      };
      
      // Update the business problem with the solution
      await storage.updateBusinessProblemSolution(createdProblem.id, solution);
      
      console.log(`Created business problem and solution for: ${questionData.text.substring(0, 50)}...`);
    } catch (error) {
      console.error(`Error importing question ${question.id}:`, error);
    }
  }
  
  console.log(`Imported ${questions.length} connected business problems`);
}

// Main import function
async function importAllData() {
  try {
    console.log('Starting to import connected brewery data...');
    
    await importProviders();
    await importFreelancers();
    await importCourses();
    await importQuestions();
    await importTalents();
    await importSteps();
    await importConnectedProblems();
    
    console.log('Successfully imported all connected brewery data!');
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

// Add necessary functions to storage.ts interface
// These are needed for our import script
declare module './storage' {
  interface IStorage {
    getExpertById(id: number): Promise<Expert | undefined>;
    getServiceById(id: number): Promise<Service | undefined>;
    getTrainingById(id: number): Promise<Training | undefined>;
    getTalentById(id: number): Promise<Talent | undefined>;
    getConversationById(id: number): Promise<Conversation | undefined>;
  }
}

// Execute the import
importAllData()
  .then(() => console.log('Import script completed'))
  .catch(error => console.error('Import script failed:', error));