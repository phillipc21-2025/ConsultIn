import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { storage } from './storage';
import { 
  InsertExpert, 
  InsertConversation, 
  InsertTalent, 
  InsertTraining, 
  InsertService 
} from '@shared/schema';

// Define path to data files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, '../data/mock_brewery');

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
  
  for (const provider of providers) {
    try {
      const service: InsertService = {
        name: provider.service_name,
        description: provider.service_description,
        website: provider.website,
        category: 'Brewery Services',
        price: 'Contact for pricing'
      };
      
      await storage.createService(service);
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
  
  for (const freelancer of freelancers) {
    try {
      const expert: InsertExpert = {
        name: `${freelancer.first_name} ${freelancer.last_name}`,
        title: freelancer.job_title,
        company: freelancer.company,
        bio: freelancer.summary,
        expertise: 'Brewery Operations',
        profileImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
        connectionDegree: Math.floor(Math.random() * 3) + 1,
        mutualConnections: Math.floor(Math.random() * 15) + 1
      };
      
      await storage.createExpert(expert);
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
  
  for (const course of courses) {
    try {
      const training: InsertTraining = {
        title: course.course_name,
        provider: course.platform,
        duration: `${course.hours} hours`,
        level: course.difficulty,
        description: `A ${course.difficulty.toLowerCase()} level course on ${course.course_name.toLowerCase()}.`,
        url: course.url,
        cost: 'Included with subscription'
      };
      
      await storage.createTraining(training);
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
  
  for (const question of questions) {
    try {
      // Create conversation out of each question's comments (if any)
      if (question.comments && question.comments.length > 0) {
        for (const comment of question.comments.slice(0, 5)) { // Limit to 5 conversations
          const conversation: InsertConversation = {
            authorName: `${comment.first_name} ${comment.last_name}`,
            authorTitle: comment.job_title,
            authorCompany: comment.company,
            authorImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
            content: comment.comment_text || `Discussion about: ${question.summary}`,
            time: new Date().toISOString(),
            likes: Math.floor(Math.random() * 50) + 1,
            comments: Math.floor(Math.random() * 10)
          };
          
          await storage.createConversation(conversation);
        }
      }
    } catch (error) {
      console.error(`Error importing question ${question.id}:`, error);
    }
  }
  console.log('Imported questions for conversations');
}

// Import steps data for talents
async function importStepsForTalents() {
  console.log('Importing steps for talents...');
  const steps = readJsonFile('steps.json');
  
  // Create a pool of talents from the steps data
  const talentPool = new Set<string>();
  
  // Extract unique names from steps data
  steps.forEach(step => {
    if (step.freelancer_ids && step.freelancer_ids.length > 0) {
      step.freelancer_ids.forEach(id => talentPool.add(id));
    }
  });
  
  // Randomly generate talents from the unique IDs
  const talentNames = [
    "Sarah Johnson", "Michael Chen", "Raj Patel", "Emma Wilson", 
    "Carlos Rodriguez", "Aisha Khan", "David Kim", "Olivia Garcia",
    "James Thompson", "Maya Gupta", "Thomas Anderson", "Sophie Martin"
  ];
  
  const talentTitles = [
    "Brewery Operations Specialist", "Supply Chain Manager", "Marketing Director",
    "Sales Representative", "Process Improvement Consultant", "Quality Assurance Analyst",
    "Distribution Coordinator", "Customer Experience Manager", "Events Coordinator"
  ];
  
  let talentCount = 0;
  for (const id of talentPool) {
    try {
      const nameIndex = Math.floor(Math.random() * talentNames.length);
      const titleIndex = Math.floor(Math.random() * talentTitles.length);
      
      const talent: InsertTalent = {
        name: talentNames[nameIndex],
        title: talentTitles[titleIndex],
        skills: ["Brewery Operations", "Supply Chain", "Marketing", "Analytics"].slice(0, Math.floor(Math.random() * 3) + 1).join(", "),
        location: ["Boston, MA", "Portland, OR", "Denver, CO", "Austin, TX", "San Diego, CA"][Math.floor(Math.random() * 5)],
        profileImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
        availability: ["Full-time", "Part-time", "Contract", "Freelance"][Math.floor(Math.random() * 4)]
      };
      
      await storage.createTalent(talent);
      talentCount++;
    } catch (error) {
      console.error(`Error importing talent ${id}:`, error);
    }
  }
  console.log(`Imported ${talentCount} talents`);
}

// Main import function
async function importAllData() {
  try {
    console.log('Starting to import brewery data...');
    
    await importProviders();
    await importFreelancers();
    await importCourses();
    await importQuestions();
    await importStepsForTalents();
    
    console.log('Successfully imported all brewery data!');
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

// Execute the import
importAllData()
  .then(() => console.log('Import script completed'))
  .catch(error => console.error('Import script failed:', error));