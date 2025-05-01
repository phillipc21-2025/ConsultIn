import { 
  users, type User, type InsertUser,
  businessProblems, type BusinessProblem, type InsertBusinessProblem,
  experts, type Expert, type InsertExpert,
  conversations, type Conversation, type InsertConversation,
  talents, type Talent, type InsertTalent,
  trainings, type Training, type InsertTraining,
  services, type Service, type InsertService,
  type SolutionResponse
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Business problem operations
  createBusinessProblem(problem: InsertBusinessProblem): Promise<BusinessProblem>;
  getBusinessProblemsByUserId(userId: number): Promise<BusinessProblem[]>;
  updateBusinessProblemSolution(id: number, solution: SolutionResponse): Promise<BusinessProblem>;
  
  // Expert operations
  getExperts(): Promise<Expert[]>;
  createExpert(expert: InsertExpert): Promise<Expert>;
  getExpertById(id: number): Promise<Expert | undefined>;
  
  // Conversation operations
  getConversations(): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  
  // Talent operations
  getTalents(): Promise<Talent[]>;
  createTalent(talent: InsertTalent): Promise<Talent>;
  
  // Training operations
  getTrainings(): Promise<Training[]>;
  createTraining(training: InsertTraining): Promise<Training>;
  
  // Service operations
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private businessProblems: Map<number, BusinessProblem>;
  private experts: Map<number, Expert>;
  private conversations: Map<number, Conversation>;
  private talents: Map<number, Talent>;
  private trainings: Map<number, Training>;
  private services: Map<number, Service>;
  
  currentUserId: number;
  currentBusinessProblemId: number;
  currentExpertId: number;
  currentConversationId: number;
  currentTalentId: number;
  currentTrainingId: number;
  currentServiceId: number;

  constructor() {
    this.users = new Map();
    this.businessProblems = new Map();
    this.experts = new Map();
    this.conversations = new Map();
    this.talents = new Map();
    this.trainings = new Map();
    this.services = new Map();
    
    this.currentUserId = 1;
    this.currentBusinessProblemId = 1;
    this.currentExpertId = 1;
    this.currentConversationId = 1;
    this.currentTalentId = 1;
    this.currentTrainingId = 1;
    this.currentServiceId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Business problem operations
  async createBusinessProblem(insertProblem: InsertBusinessProblem): Promise<BusinessProblem> {
    const id = this.currentBusinessProblemId++;
    const problem: BusinessProblem = { ...insertProblem, id };
    this.businessProblems.set(id, problem);
    return problem;
  }
  
  async getBusinessProblemsByUserId(userId: number): Promise<BusinessProblem[]> {
    return Array.from(this.businessProblems.values()).filter(
      (problem) => problem.userId === userId
    );
  }
  
  async updateBusinessProblemSolution(id: number, solution: SolutionResponse): Promise<BusinessProblem> {
    const problem = this.businessProblems.get(id);
    if (!problem) {
      throw new Error(`Business problem with id ${id} not found`);
    }
    
    const updatedProblem = { ...problem, solution };
    this.businessProblems.set(id, updatedProblem);
    return updatedProblem;
  }
  
  // Expert operations
  async getExperts(): Promise<Expert[]> {
    return Array.from(this.experts.values());
  }
  
  async createExpert(insertExpert: InsertExpert): Promise<Expert> {
    const id = this.currentExpertId++;
    const expert: Expert = { ...insertExpert, id };
    this.experts.set(id, expert);
    return expert;
  }
  
  async getExpertById(id: number): Promise<Expert | undefined> {
    return this.experts.get(id);
  }
  
  // Conversation operations
  async getConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values());
  }
  
  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const conversation: Conversation = { ...insertConversation, id };
    this.conversations.set(id, conversation);
    return conversation;
  }
  
  // Talent operations
  async getTalents(): Promise<Talent[]> {
    return Array.from(this.talents.values());
  }
  
  async createTalent(insertTalent: InsertTalent): Promise<Talent> {
    const id = this.currentTalentId++;
    const talent: Talent = { ...insertTalent, id };
    this.talents.set(id, talent);
    return talent;
  }
  
  // Training operations
  async getTrainings(): Promise<Training[]> {
    return Array.from(this.trainings.values());
  }
  
  async createTraining(insertTraining: InsertTraining): Promise<Training> {
    const id = this.currentTrainingId++;
    const training: Training = { ...insertTraining, id };
    this.trainings.set(id, training);
    return training;
  }
  
  // Service operations
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }
  
  // Initialize with sample data
  private initializeSampleData() {
    // Create default user
    const user: InsertUser = {
      username: "alexmorgan",
      password: "password",
      name: "Alex Morgan",
      title: "Small Business Owner",
      company: "Morgan Craft Brewery",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    };
    this.createUser(user);
    
    // Create experts
    const expertsData: InsertExpert[] = [
      {
        name: "Sarah Johnson",
        title: "Supply Chain Director",
        company: "Craft Beverage Partners",
        profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
        connections: 500,
        experience: "10+ years in beverage logistics"
      },
      {
        name: "Michael Reeves",
        title: "Procurement Manager",
        company: "Regional Brewing Co-op",
        profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
        connections: 412,
        experience: "Expert in brewery ingredients"
      },
      {
        name: "Tina Rodriguez",
        title: "Logistics Consultant for Small Breweries",
        company: "Rodriguez Consulting",
        profileImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
        connections: 328,
        experience: "Former Brewery Owner"
      }
    ];
    
    expertsData.forEach(expert => this.createExpert(expert));
    
    // Create conversations
    const conversationsData: InsertConversation[] = [
      {
        authorName: "Jennifer Craft",
        authorTitle: "Owner at Urban Brew Co.",
        authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        content: "We solved our hop shortage by partnering with 3 different suppliers and using a shared inventory system. Happy to share our setup with fellow brewers facing the same issues!",
        postedTime: "2d",
        likes: 47,
        comments: 18
      }
    ];
    
    conversationsData.forEach(conversation => this.createConversation(conversation));
    
    // Create talents
    const talentsData: InsertTalent[] = [
      {
        name: "David Chen",
        title: "Procurement Specialist • Brewery Experience",
        profileImage: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57",
        location: "Portland, OR",
        availability: "Open to Part-time"
      }
    ];
    
    talentsData.forEach(talent => this.createTalent(talent));
    
    // Create trainings
    const trainingsData: InsertTraining[] = [
      {
        title: "Supply Chain Management for Small Breweries",
        provider: "LinkedIn Learning",
        duration: "3.5 hours",
        thumbnail: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66",
        description: "Learn inventory management, supplier relationships, and quality control specifically for brewery operations.",
        rating: "4.8",
        reviewCount: 142
      }
    ];
    
    trainingsData.forEach(training => this.createTraining(training));
    
    // Create services
    const servicesData: InsertService[] = [
      {
        name: "BreweryConnect Supply Chain Platform",
        description: "Supply chain management software designed for craft breweries",
        icon: "cubes",
        usageStats: "Used by 130+ craft breweries • Streamlines ingredient ordering and tracking",
        pricing: "From $89/month • Free trial available"
      }
    ];
    
    servicesData.forEach(service => this.createService(service));
  }
}

// Export the storage singleton
export const storage = new MemStorage();
