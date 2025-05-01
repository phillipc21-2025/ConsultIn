import { 
  type ProcessStep,
  type NetworkComment,
  type ConsultInAction,
  type Expert,
  type Conversation,
  type Talent,
  type Training,
  type Service,
  type SolutionResponse
} from "@shared/schema";

// Helper to get a random subset of items from any array
export const getRandomSubset = <T>(array: T[], max: number = 4): T[] => {
  if (!array.length) return [];
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(max, array.length));
};

// Create network comments for process steps
export const generateNetworkComments = (): NetworkComment[] => {
  // Sample images
  const profileImages = [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/86.jpg",
    "https://randomuser.me/api/portraits/women/63.jpg",
    "https://randomuser.me/api/portraits/men/22.jpg",
    "https://randomuser.me/api/portraits/women/54.jpg"
  ];
  
  // Sample comments for brewery owners
  const positiveComments = [
    "I completely agree. We had the same issue at our brewery and this approach helped us improve our operations tremendously.",
    "This strategy worked well for our brewery. The key was getting our brewing staff involved in the process early on.",
    "100% support this. We implemented a similar approach at our brewpub and it really helped with consistency in our beer production.",
    "Great suggestion. We also found that documenting our brewing process with photos was incredibly helpful for training new staff.",
    "My brewery team followed a similar approach last season. The results were excellent, and our taproom customers noticed the improvement."
  ];
  
  // Sample negative/cautionary comments
  const negativeComments = [
    "I'd be careful with this approach for a small brewery. We tried it and found we needed to adapt it quite a bit for our scale.",
    "This might work for larger craft breweries, but we struggled to implement with our limited staff. Consider scaling based on your brewery size.",
    "We had mixed results with this at our microbrewery. The upfront costs were higher than expected, so budget carefully.",
    "This approach has merit, but I'd suggest testing it on one beer line first. Full implementation created bottlenecks in our brewing schedule.",
    "I disagree with parts of this. For our craft brewery, focusing on quality batch consistency rather than variety produced better results."
  ];
  
  // Sample neutral/additional perspective comments
  const neutralComments = [
    "Consider this alternative: we focused on building relationships with local malt suppliers first, which improved both quality and reliability.",
    "Don't forget to involve your head brewer early in this process to avoid issues with recipe standardization.",
    "In our experience, it took about 2-3 brewing cycles to see consistent results, so be patient with the implementation.",
    "This works, but don't forget to establish clear quality metrics. We had to redefine what success looked like for our small-batch approach.",
    "This is a solid approach, though seasonal changes in ingredient availability may require adjustments to your brewing schedule."
  ];
  
  // Generate 3-5 comments with varied sentiments
  const numComments = Math.floor(Math.random() * 3) + 3; // 3-5 comments
  let comments: NetworkComment[] = [];
  
  // Ensure at least one positive and one critical comment
  comments.push({
    id: 1,
    authorName: "Michael Brewster",
    authorTitle: "Head Brewer",
    authorCompany: "Hoptown Brewing Co.",
    authorImage: profileImages[0],
    content: positiveComments[Math.floor(Math.random() * positiveComments.length)],
    sentiment: "positive",
    postedTime: "2 days ago",
    likes: Math.floor(Math.random() * 50) + 5
  });
  
  comments.push({
    id: 2,
    authorName: "Sarah Maltz",
    authorTitle: "Brewery Owner",
    authorCompany: "Riverside Craft Ales",
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
    
    // List of brewery-related names
    const names = [
      "Emma Hopson", "David Porter", "Priya Stout", "James Lager",
      "Olivia Amber", "Wei Pilsner", "Jamal Brown", "Sofia Malt"
    ];
    
    // List of brewery-related titles
    const titles = [
      "Taproom Manager", "Brewery Owner", "Head Brewer",
      "Production Lead", "Quality Manager", "Cellar Master",
      "Brewing Consultant", "Craft Beer Bar Owner"
    ];
    
    // List of brewery-related companies
    const companies = [
      "Hops & Grain Brewing", "Riverside Ales", "Barrel House Brewing",
      "Mountain Valley Fermentations", "True Craft Brewery", "Old Town Brewpub",
      "Kettle & Mash Brewing Co.", "Five Barrels Brewery"
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

// Generate ConsultIn actions for process steps
export const generateConsultInAction = (stepTitle: string, stepDescription: string): ConsultInAction => {
  // Special case for permit-related steps
  if (stepTitle.toLowerCase().includes("permit") || 
      stepDescription.toLowerCase().includes("permit") ||
      stepTitle.toLowerCase().includes("licens") || 
      stepDescription.toLowerCase().includes("licens") ||
      stepTitle.toLowerCase().includes("legal") || 
      stepDescription.toLowerCase().includes("legal") ||
      stepTitle.toLowerCase().includes("regulat") || 
      stepDescription.toLowerCase().includes("regulat")) {
    
    return {
      type: 'form',
      formTitle: "Local Brewery Permit Application Assistant",
      formFields: [
        {
          label: "Brewery Legal Business Name",
          type: "text",
          required: true,
        },
        {
          label: "Business Address",
          type: "text",
          required: true,
        },
        {
          label: "Business Owner Name",
          type: "text",
          required: true,
        },
        {
          label: "Contact Email",
          type: "text",
          required: true,
        },
        {
          label: "Contact Phone",
          type: "text",
          required: true,
        },
        {
          label: "Federal Employer Identification Number (EIN)",
          type: "text",
          required: true,
        },
        {
          label: "Tax ID Number",
          type: "text",
          required: true,
        },
        {
          label: "Type of Permit",
          type: "select",
          options: [
            "Alcohol Beverage License", 
            "Live Music/Entertainment Permit", 
            "Food Service Permit", 
            "Outdoor Seating Permit",
            "Special Event Permit",
            "Brewery Manufacturing License"
          ],
          required: true,
        },
        {
          label: "Permit Purpose",
          type: "text",
          required: true,
          value: stepDescription
        },
        {
          label: "Expected Start Date",
          type: "date",
          required: true,
        },
        {
          label: "I certify that all information is true and accurate",
          type: "checkbox",
          required: true,
        }
      ],
      submissionEndpoint: "/api/permit-submission"
    };
  }
  
  // Special case for payment systems
  else if (stepTitle.toLowerCase().includes("payment") || 
      stepDescription.toLowerCase().includes("payment") ||
      stepTitle.toLowerCase().includes("square") || 
      stepDescription.toLowerCase().includes("square") ||
      stepTitle.toLowerCase().includes("transaction") || 
      stepDescription.toLowerCase().includes("transaction")) {
    
    return {
      type: 'product',
      products: [
        {
          id: 1,
          name: "BrewPay POS System",
          description: "Complete point-of-sale system designed specifically for craft breweries. Handles tabs, flight boards, and integrates with inventory management. Compatible with existing hardware.",
          price: "$49/month",
          url: "#",
          imageUrl: "https://randomuser.me/api/portraits/lego/1.jpg"
        },
        {
          id: 2,
          name: "TapRoom Transactions Pro",
          description: "Mobile payment system that works offline during internet outages. Includes QR code ordering for tables and contactless payment options. Seamlessly syncs when connection is restored.",
          price: "$65/month",
          url: "#",
          imageUrl: "https://randomuser.me/api/portraits/lego/2.jpg" 
        },
        {
          id: 3,
          name: "Payment System Migration Service",
          description: "Our team will handle the entire transition from your current payment system to a new one. Includes data transfer, staff training, and weekend support during the transition.",
          price: "$599 one-time",
          url: "#",
          imageUrl: "https://randomuser.me/api/portraits/lego/3.jpg"
        }
      ]
    };
  }
  
  // Special case for customer insights and marketing analytics
  else if ((stepTitle.toLowerCase().includes("customer") && stepTitle.toLowerCase().includes("insight")) || 
      (stepDescription.toLowerCase().includes("customer") && stepDescription.toLowerCase().includes("insight")) ||
      (stepTitle.toLowerCase().includes("who") && stepTitle.toLowerCase().includes("likes")) || 
      (stepDescription.toLowerCase().includes("who") && stepDescription.toLowerCase().includes("likes"))) {
    
    return {
      type: 'product',
      products: [
        {
          id: 1,
          name: "BrewFan Insight Tool",
          description: "Customer analytics platform designed for small breweries. Analyzes taproom data, online reviews, and social media mentions to create customer profiles and preference patterns.",
          price: "$39/month",
          url: "#",
          imageUrl: "https://randomuser.me/api/portraits/lego/4.jpg"
        },
        {
          id: 2,
          name: "Beer Preference Survey Kit",
          description: "Ready-to-use digital and printable survey templates to gather customer feedback. Includes QR codes for your taproom tables and analysis dashboard.",
          price: "$149 one-time",
          url: "#",
          imageUrl: "https://randomuser.me/api/portraits/lego/5.jpg"
        },
        {
          id: 3,
          name: "Craft Beer Customer Research Report",
          description: "Comprehensive market research report on craft beer consumer demographics, preferences, and trends in your region, based on surveys of over 5,000 craft beer drinkers.",
          price: "$299 one-time",
          url: "#",
          imageUrl: "https://randomuser.me/api/portraits/lego/6.jpg"
        }
      ]
    };
  }
  
  // Regular random choice for other types
  else {
    // Randomly choose an action type, with bias toward email
    const randomNum = Math.random();
    if (randomNum < 0.5) {
      // Email action (50% chance)
      const emailSubjects = [
        `Help with: ${stepTitle} for my brewery`,
        `Seeking guidance on ${stepTitle}`,
        `Need assistance with ${stepTitle} for our small brewery`,
        `Brewery consultant needed for ${stepTitle}`
      ];
      
      const emailBodies = [
        `Dear [Brewery Consultant],\n\nI own a small craft brewery and I need help with ${stepTitle}. We're trying to ${stepDescription.toLowerCase()}\n\nOur brewery produces about 1,000 barrels annually with 5 year-round beers and 4 seasonals. We have a small taproom and distribute to local restaurants and stores.\n\nCould you provide some guidance on how we should approach this issue given our size?\n\nThanks for your help,\n[Your Name]\n[Your Brewery]`,
        
        `Dear [Brewing Association],\n\nI'm reaching out about ${stepTitle} for our small brewery. We need to ${stepDescription.toLowerCase()}\n\nDo you have any resources specifically for small breweries like ours? Or could you connect me with other brewery owners who have successfully addressed this challenge?\n\nWe've been operating for 3 years and are looking to grow sustainably.\n\nThanks in advance,\n[Your Name]\n[Your Brewery]`,
        
        `Hello [Fellow Brewer],\n\nI hope your brewing operations are going well. I'm trying to figure out how to ${stepDescription.toLowerCase()} at our brewery.\n\nWe're facing challenges with ${stepTitle.toLowerCase()} and I'd appreciate any insights from your experience. Would you be open to a quick call or brewery visit to discuss how you've handled this?\n\nI'm happy to share some of our seasonal releases as thanks!\n\nCheers,\n[Your Name]\n[Your Brewery]`
      ];
      
      return {
        type: 'email',
        recipient: "[Brewery Consultant]",
        subject: emailSubjects[Math.floor(Math.random() * emailSubjects.length)],
        body: emailBodies[Math.floor(Math.random() * emailBodies.length)],
        ccList: ["[Head Brewer]", "[Taproom Manager]"]
      };
    } else if (randomNum < 0.8) {
      // Form action (30% chance)
      const formTitles = [
        `${stepTitle} Planning Form`,
        `Brewery ${stepTitle} Assessment`,
        `${stepTitle} Implementation Request`,
        `Brewery ${stepTitle} Consultation Request`
      ];
      
      return {
        type: 'form',
        formTitle: formTitles[Math.floor(Math.random() * formTitles.length)],
        formFields: [
          {
            label: "Brewery Name",
            type: "text",
            required: true
          },
          {
            label: "Annual Production (in barrels)",
            type: "number",
            required: true
          },
          {
            label: "Number of Year-Round Beers",
            type: "number",
            required: true
          },
          {
            label: "Describe your current approach to this challenge",
            type: "text",
            required: true,
            value: `We're trying to ${stepDescription.toLowerCase()} but facing difficulties with...`
          },
          {
            label: "Distribution Methods",
            type: "select",
            options: ["Self-distribution only", "Local distributor", "Regional distributor", "Taproom sales only"],
            required: true
          },
          {
            label: "I agree to share non-confidential information about my brewery",
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
            name: `Brewery ${stepTitle} Guide`,
            description: `A comprehensive guide specifically for small breweries on how to ${stepDescription.toLowerCase()}. Includes case studies from breweries of similar size.`,
            price: "$149",
            url: "#",
            imageUrl: "https://randomuser.me/api/portraits/lego/1.jpg"
          },
          {
            id: 2,
            name: `${stepTitle} Consultation Package`,
            description: `Four hours of expert consultation for your brewery team, focusing specifically on how to ${stepDescription.toLowerCase()}. Includes follow-up support.`,
            price: "$599",
            url: "#",
            imageUrl: "https://randomuser.me/api/portraits/lego/2.jpg"
          },
          {
            id: 3,
            name: `Small Brewery ${stepTitle} Software`,
            description: `Software designed specifically for craft breweries to help manage and optimize ${stepTitle.toLowerCase()}. Includes mobile app for your brewing team.`,
            price: "$29/month",
            url: "#",
            imageUrl: "https://randomuser.me/api/portraits/lego/3.jpg"
          }
        ]
      };
    }
  }
};

// 1. Brewery Ingredient Supply Chain
export const brewerySupplyChain = [
  {
    id: 1,
    title: "Map Your Brewery Ingredients Supply Chain",
    description: "Make a complete list of all your brewing ingredients, packaging materials, and their suppliers to understand where you might have supply risks.",
    solution: "Create a simple spreadsheet listing all suppliers for your malts, hops, yeast, cans/bottles, and labels. Note contact info, lead times, minimum orders, and which beers depend on which ingredients.",
  },
  {
    id: 2,
    title: "Find Backup Hop and Malt Suppliers",
    description: "Identify alternative suppliers for your most important brewing ingredients, especially specialty hops and malts that define your flagship beers.",
    solution: "For each hop variety and specialty malt in your core recipes, identify and test at least one alternative supplier. Join your local brewers guild to establish relationships for emergency ingredient sharing.",
  },
  {
    id: 3,
    title: "Create Simple Brewery Inventory System",
    description: "Set up a basic inventory tracking system to prevent ingredient shortages without having too much cash tied up in stock.",
    solution: "Use a whiteboard, spreadsheet or simple app to track usage rates of ingredients. Set reorder points that account for delivery times. Consider a small 'emergency' stock of critical ingredients like signature hops or specialty yeast strains.",
  },
  {
    id: 4,
    title: "Develop Flexible Beer Recipes",
    description: "Create alternative recipes for your popular beers that can be used when specific ingredients are unavailable.",
    solution: "For each of your core beers, work with your head brewer to develop at least one recipe variation that uses more readily available ingredients. Test these recipes in small batches and market them as special limited editions.",
  },
  {
    id: 5,
    title: "Set Up Local Distribution Backup Plans",
    description: "Create simple contingency plans for getting your beer to local customers when normal distribution methods are disrupted.",
    solution: "Make arrangements with local delivery services as backup. If you self-distribute, identify a second vehicle option. For taproom sales, prepare a simplified to-go packaging system that can be quickly implemented during disruptions.",
  }
];

export const brewerySupplyChainAnalysis = "As a local brewery owner, your ingredient supply chain faces unique challenges—specialty hops and malts can be seasonal, have long lead times, or suddenly become unavailable. By mapping your ingredients, finding backup suppliers, managing inventory smarter, creating flexible recipes, and having backup distribution plans, you'll build a more resilient brewery business that can adapt to supply challenges.";

// 2. Staffing & Hiring for Brewery
export const breweryStaffing = [
  {
    id: 1,
    title: "Identify Key Brewery Positions",
    description: "Determine which roles are essential to your brewery operations and which are causing the biggest bottlenecks when vacant.",
    solution: "List all positions at your brewery and rank them by impact on operations when unfilled. Focus your hiring efforts on the most critical roles first, like head brewer, cellar staff, and taproom manager.",
  },
  {
    id: 2,
    title: "Create Simple Brewery Job Descriptions",
    description: "Develop clear, practical job descriptions that accurately reflect the real work in a small brewery environment.",
    solution: "Write down the actual day-to-day tasks for each role, the physical requirements (like ability to lift kegs), and the brewery-specific skills needed. Be honest about working conditions, like temperature variations and weekend hours.",
  },
  {
    id: 3,
    title: "Tap Into Local Brewery Networks",
    description: "Leverage beer community connections to find experienced candidates who understand the brewing industry.",
    solution: "Post job openings with your state brewers guild, local homebrew clubs, and brewing schools. Ask your current staff for referrals—good brewers often know other good brewers. Offer a small referral bonus for successful hires.",
  },
  {
    id: 4,
    title: "Develop Basic Brewery Training Program",
    description: "Create a simple, hands-on training system to quickly bring new brewery staff up to speed.",
    solution: "Document your most important processes with simple checklists and photos. Pair new hires with experienced staff for a structured 2-week training period. Create a brewery-specific manual covering your equipment, recipes, and safety procedures.",
  },
  {
    id: 5,
    title: "Retain Good Brewery Staff",
    description: "Implement strategies to keep your best brewery employees, reducing turnover and training costs.",
    solution: "Beyond competitive pay, offer brewery-specific perks like taking home occasional unmarketable beer, tap room discounts, opportunities to develop experimental brews, and flexible scheduling. Create clear growth paths within your brewery.",
  }
];

export const breweryStaffingAnalysis = "Staffing a small brewery presents unique challenges—you need specialized knowledge for brewing roles, reliable people for the physical work, and personable staff for your taproom. By creating clear job descriptions, tapping the local beer community, providing solid training, and offering brewery-specific benefits, you can build a stable, knowledgeable team that will grow with your business.";

// 3. Marketing for Brewery
export const breweryMarketing = [
  {
    id: 1,
    title: "Identify Your Brewery's Unique Story",
    description: "Discover what makes your brewery special and different from other local craft breweries.",
    solution: "Write down your brewery's founding story, what inspired your flagship beers, any local connections, and your brewing philosophy. Look for unique elements that customers connect with—whether it's your location in a historic building, your sustainable practices, or the inspiration behind your beer names.",
  },
  {
    id: 2,
    title: "Create A Simple Brewery Social Media Plan",
    description: "Develop a basic but consistent approach to promoting your brewery on social platforms where beer enthusiasts gather.",
    solution: "Focus on Instagram and Facebook with 2-3 posts weekly. Share brewing process photos, new beer releases, behind-the-scenes content, and customer experiences. Use a free scheduling tool to plan posts during busy brewing days. Engage with local beer influencers and respond to all comments.",
  },
  {
    id: 3,
    title: "Improve Your Basic Brewery Website",
    description: "Ensure your online presence provides the essential information customers need before visiting your brewery.",
    solution: "Update your website with current tap list, accurate hours, location with parking info, food options, and upcoming events. Add high-quality photos of your space and beers. Make sure the site works well on mobile devices, as most customers will check it from their phones.",
  },
  {
    id: 4,
    title: "Leverage Local Brewery Partnerships",
    description: "Create cross-promotion opportunities with complementary local businesses to reach more potential customers.",
    solution: "Partner with nearby restaurants, food trucks, local farms that supply your ingredients, music venues, and other non-competing breweries for joint events or promotions. Create a monthly event calendar that brings in different local partners to attract their customers to your brewery.",
  },
  {
    id: 5,
    title: "Start a Simple Brewery Email Newsletter",
    description: "Build a direct communication channel with your most loyal customers to promote new beers and events.",
    solution: "Collect email addresses via a simple sign-up sheet in your taproom or a form on your website. Send a brief monthly newsletter announcing new beer releases, upcoming events, and special offers. Include a short story about one of your beers or team members in each edition to build connection.",
  }
];

export const breweryMarketingAnalysis = "Marketing a local brewery doesn't require a huge budget or sophisticated campaigns—it needs authenticity and community connection. By focusing on your unique brewery story, maintaining a simple but consistent social media presence, keeping your website updated with essential information, partnering with local businesses, and nurturing customer relationships through email, you can build strong local awareness and a loyal customer base.";

// Function to generate brewery-specific mock solutions
export function generateBrewerySolution(
  problem: string,
  experts: Expert[],
  conversations: Conversation[],
  talents: Talent[],
  trainings: Training[],
  services: Service[]
): SolutionResponse {
  
  console.log("Generating brewery-specific mock solution for:", problem);
  
  let processSteps: ProcessStep[] = [];
  let analysis = "";
  
  // Match problem text to appropriate brewery problem category
  const problemText = problem.toLowerCase();
  
  // 1. Supply Chain & Ingredients
  if (problemText.includes("supply") || 
      problemText.includes("ingredient") || 
      problemText.includes("hops") || 
      problemText.includes("malt") ||
      problemText.includes("shortages") ||
      problemText.includes("inventory")) {
    
    processSteps = brewerySupplyChain.map((step, index) => ({
      ...step,
      networkComments: generateNetworkComments(),
      consultInAction: generateConsultInAction(step.title, step.description),
      resources: {
        experts: getRandomSubset(experts),
        conversations: getRandomSubset(conversations),
        talents: getRandomSubset(talents, index % 2 === 0 ? 4 : 0), // Some steps won't have talents
        trainings: getRandomSubset(trainings),
        services: getRandomSubset(services, index === 4 ? 0 : 4) // Last step won't have services
      }
    }));
    
    analysis = brewerySupplyChainAnalysis;
  }
  
  // 2. Staffing & Hiring
  else if (problemText.includes("staff") || 
           problemText.includes("employee") || 
           problemText.includes("hiring") || 
           problemText.includes("workers") ||
           problemText.includes("brewer") ||
           problemText.includes("labor") ||
           problemText.includes("talent") ||
           problemText.includes("turnover")) {
    
    processSteps = breweryStaffing.map((step, index) => ({
      ...step,
      networkComments: generateNetworkComments(),
      consultInAction: generateConsultInAction(step.title, step.description),
      resources: {
        experts: getRandomSubset(experts),
        conversations: getRandomSubset(conversations),
        talents: getRandomSubset(talents),
        trainings: getRandomSubset(trainings, index === 0 ? 0 : 4), // First step won't have trainings
        services: getRandomSubset(services, index === 2 ? 0 : 4) // Third step won't have services
      }
    }));
    
    analysis = breweryStaffingAnalysis;
  }
  
  // 3. Marketing & Online Presence
  else if (problemText.includes("market") || 
           problemText.includes("promot") || 
           problemText.includes("advertis") || 
           problemText.includes("social media") ||
           problemText.includes("awareness") ||
           problemText.includes("customer") ||
           problemText.includes("brand") ||
           problemText.includes("website") ||
           problemText.includes("digital") ||
           problemText.includes("online")) {
    
    processSteps = breweryMarketing.map((step, index) => ({
      ...step,
      networkComments: generateNetworkComments(),
      consultInAction: generateConsultInAction(step.title, step.description),
      resources: {
        experts: getRandomSubset(experts, index === 1 ? 0 : 4), // Second step won't have experts
        conversations: getRandomSubset(conversations),
        talents: getRandomSubset(talents, index % 2 === 0 ? 4 : 0), // Alternate steps have talents
        trainings: getRandomSubset(trainings),
        services: getRandomSubset(services)
      }
    }));
    
    analysis = breweryMarketingAnalysis;
  }
  
  // Default response for any other brewery question
  else {
    // Use supply chain as default if no specific match found
    processSteps = brewerySupplyChain.map((step, index) => ({
      ...step,
      networkComments: generateNetworkComments(),
      consultInAction: generateConsultInAction(step.title, step.description),
      resources: {
        experts: getRandomSubset(experts),
        conversations: getRandomSubset(conversations),
        talents: getRandomSubset(talents),
        trainings: getRandomSubset(trainings),
        services: getRandomSubset(services)
      }
    }));
    
    analysis = "As a brewery owner, this challenge requires a structured approach to maintain your beer quality and business operations. The recommended steps will help you address this issue while keeping your brewery running smoothly.";
  }
  
  return {
    analysis,
    experts: getRandomSubset(experts, 4),
    conversations: getRandomSubset(conversations, 5), // Increased to 5 for ActiveConversations
    talents: getRandomSubset(talents, 4),
    trainings: getRandomSubset(trainings, 4),
    services: getRandomSubset(services, 4),
    processSteps
  };
}