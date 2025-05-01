// Brewery-specific mock data for each problem type

// 1. Ingredient Supply Chain
export const brewerySupplyChain = {
  processSteps: [
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
  ],
  analysis: "As a local brewery owner, your ingredient supply chain faces unique challenges—specialty hops and malts can be seasonal, have long lead times, or suddenly become unavailable. By mapping your ingredients, finding backup suppliers, managing inventory smarter, creating flexible recipes, and having backup distribution plans, you'll build a more resilient brewery business that can adapt to supply challenges."
};

// 2. Staffing & Hiring 
export const breweryStaffing = {
  processSteps: [
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
  ],
  analysis: "Staffing a small brewery presents unique challenges—you need specialized knowledge for brewing roles, reliable people for the physical work, and personable staff for your taproom. By creating clear job descriptions, tapping the local beer community, providing solid training, and offering brewery-specific benefits, you can build a stable, knowledgeable team that will grow with your business."
};

// 3. Marketing & Online Presence
export const breweryMarketing = {
  processSteps: [
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
  ],
  analysis: "Marketing a local brewery doesn't require a huge budget or sophisticated campaigns—it needs authenticity and community connection. By focusing on your unique brewery story, maintaining a simple but consistent social media presence, keeping your website updated with essential information, partnering with local businesses, and nurturing customer relationships through email, you can build strong local awareness and a loyal customer base."
};

// 4. Financial Planning
export const breweryFinancial = {
  processSteps: [
    {
      id: 1,
      title: "Track Your Brewery's Cash Flow",
      description: "Set up a simple system to monitor money coming in and going out of your brewery on a weekly basis.",
      solution: "Create a basic spreadsheet tracking weekly revenue (taproom sales, distribution, merchandise) and expenses (ingredients, payroll, utilities, rent). Update it every Monday to maintain awareness of your cash position and identify potential shortfalls before they become crises.",
    },
    {
      id: 2,
      title: "Calculate Actual Beer Production Costs",
      description: "Determine exactly how much it costs to produce each batch of your different beer styles.",
      solution: "For each of your regular beers, document all costs: raw ingredients, packaging, labor hours, utilities, equipment maintenance, and waste. Calculate a per-keg and per-pint cost to ensure your pricing creates adequate margins. Review quarterly as ingredient costs change.",
    },
    {
      id: 3,
      title: "Balance Taproom vs. Distribution Sales",
      description: "Determine the most profitable sales channels for your brewery and adjust your business model accordingly.",
      solution: "Compare profit margins between taproom sales (highest margins but limited volume) and distribution (lower margins but potentially higher volume). Based on your findings, consider adjusting hours, staffing, marketing, or even brewery layout to emphasize your most profitable channel.",
    },
    {
      id: 4,
      title: "Manage Seasonal Cash Flow Fluctuations",
      description: "Prepare for predictable seasonal changes in brewery revenue and expenses.",
      solution: "Analyze last year's monthly sales data to identify slow seasons. Create a 12-month cash flow projection. During high-season months, set aside a percentage of profits in a separate account to cover expenses during predictable slow periods. Consider seasonal-specific beers or events to boost revenue during typically slow times.",
    },
    {
      id: 5,
      title: "Plan for Equipment Repairs and Upgrades",
      description: "Create a financial strategy for handling brewing equipment maintenance and eventual replacement.",
      solution: "List all major equipment with estimated lifespan and replacement cost. Create a dedicated maintenance fund with monthly contributions based on anticipated needs. For major upgrades, explore equipment leasing options, SBA loans, or local economic development programs specifically for small manufacturers.",
    }
  ],
  analysis: "Managing finances for a small brewery requires balancing immediate operational needs with longer-term stability. By tracking cash flow weekly, understanding your true production costs, optimizing your sales channels, preparing for seasonal fluctuations, and planning for equipment needs, you'll create the financial foundation needed to weather challenges and grow sustainably."
};

// 5. Customer Acquisition
export const breweryCustomerAcquisition = {
  processSteps: [
    {
      id: 1,
      title: "Define Your Ideal Brewery Customers",
      description: "Identify the types of beer drinkers most likely to become regular patrons of your brewery.",
      solution: "Observe your current customers and note patterns in age, neighborhood residence, beer preferences, visit frequency, and spending habits. Create 2-3 customer profiles (like 'Local Beer Enthusiasts,' 'After-Work Professionals,' or 'Weekend Social Groups') to guide your acquisition efforts.",
    },
    {
      id: 2,
      title: "Optimize Local Search Presence",
      description: "Make it easy for people searching for breweries in your area to find your business online.",
      solution: "Claim and complete your Google Business Profile with accurate hours, photos, and tap list links. Ensure your brewery is listed on Untappd, BeerAdvocate, and brewery finder apps. Ask satisfied customers to leave Google or Yelp reviews, as search visibility increases with more reviews.",
    },
    {
      id: 3,
      title: "Create a First-Time Visitor Program",
      description: "Develop a simple system to welcome new customers and encourage them to return.",
      solution: "Train staff to identify and welcome first-time visitors. Offer a small sample flight at a reduced price for first-timers. Create a simple 'brewery passport' where customers get a stamp for each visit or beer style tried, with a reward after completing the passport.",
    },
    {
      id: 4,
      title: "Establish Community Brewery Events",
      description: "Host regular events that attract new customers while building a sense of community.",
      solution: "Schedule consistent events like Trivia Tuesday, weekly food truck nights, monthly beer releases, or brewing education sessions. Partner with local groups (running clubs, book clubs, networking groups) to host their meetings. Create a simple calendar and promote these events on social media and through local event listings.",
    },
    {
      id: 5,
      title: "Develop Local Business Relationships",
      description: "Build connections with nearby businesses to tap into their customer base.",
      solution: "Create a brewery 'neighbor discount' for employees of businesses within walking distance. Offer to host company happy hours or team-building events. Develop co-branded beers with popular local businesses (coffee shop stout, bakery pastry beer) that create cross-promotion opportunities and bring their customers to your taproom.",
    }
  ],
  analysis: "Attracting new customers to your local brewery is about community connection more than traditional advertising. By understanding exactly who your best customers are, ensuring they can find you online, creating a welcoming first experience, hosting engaging events, and building local business relationships, you'll create a steady stream of new visitors who can become regular customers."
};

// 6. Product Development
export const breweryProductDevelopment = {
  processSteps: [
    {
      id: 1,
      title: "Analyze Your Beer Portfolio",
      description: "Evaluate your current beer offerings to identify gaps and opportunities for new products.",
      solution: "Review sales data to identify your best and worst-selling beers. Map your current offerings across beer styles, flavor profiles, and ABV ranges. Look for gaps in your lineup that might appeal to your target customers, like approachable lower-ABV options or seasonal specialties.",
    },
    {
      id: 2,
      title: "Create a Structured Recipe Development Process",
      description: "Establish a systematic approach to creating and testing new beer recipes.",
      solution: "Set up a small pilot brewing system for recipe testing. Create a standard evaluation form covering appearance, aroma, flavor, mouthfeel, and overall impression. Organize regular tasting panels with staff and trusted customers. Document all recipes, process variations, and tasting notes in a centralized brewing log.",
    },
    {
      id: 3,
      title: "Plan a Strategic Release Calendar",
      description: "Develop a schedule of new beer releases that balances innovation with production constraints.",
      solution: "Create a 12-month calendar planning core beers and seasonal specialties, accounting for ingredient availability, fermentation tank capacity, and market demand patterns. Schedule special releases during typically slower business periods to drive traffic and balance out seasonal fluctuations.",
    },
    {
      id: 4,
      title: "Gather Structured Customer Feedback",
      description: "Collect and analyze customer input to guide your beer development decisions.",
      solution: "Implement a simple voting system in your taproom for experimental batches. Create a feedback card for limited releases asking specific questions about the beer's attributes. Monitor Untappd check-ins and ratings. Hold quarterly focus groups with loyal customers to discuss potential new styles.",
    },
    {
      id: 5,
      title: "Develop Brewery-Exclusive Offerings",
      description: "Create special beers available only at your taproom to drive visits and create excitement.",
      solution: "Reserve tank space for small-batch, taproom-only experimental beers released bi-weekly. Create a 'brewer's choice' series where your brewing team can try innovative ideas. Consider a small barrel program that produces limited special releases. Use these exclusive offerings to draw customers directly to your taproom.",
    }
  ],
  analysis: "As a local brewery owner, your product development strategy should balance innovation with practicality. By analyzing your current offerings, creating a structured development process, planning strategic releases, gathering customer feedback, and offering taproom exclusives, you'll keep your beer portfolio fresh and exciting while making efficient use of your limited production capacity."
};

// 7. Additional problem types would continue in the same pattern...