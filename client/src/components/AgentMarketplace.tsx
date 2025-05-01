import { useState } from "react";
import { 
  FaSearch, 
  FaDownload, 
  FaStar, 
  FaRegStar, 
  FaSpinner,
  FaShippingFast,
  FaEnvelope,
  FaClipboard,
  FaChartBar,
  FaDatabase,
  FaShoppingCart,
  FaRobot
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Brewery-specific AI agents for marketplace
const mockAgents = [
  {
    id: 1,
    name: "Brewery Hop Supplier Finder",
    icon: <FaShippingFast className="text-green-600" size={24} />,
    description: "Locates reliable specialty hop suppliers for seasonal and flagship craft beers. Includes lead time analysis and backup supplier recommendations.",
    category: "Brewery Supply Chain",
    rating: 4.8,
    reviews: 124,
    creator: "BreweryLink Solutions",
    actions: ["find suppliers", "compare prices", "analyze reliability"]
  },
  {
    id: 2,
    name: "Brewery Staff Scheduler",
    icon: <FaClipboard className="text-blue-500" size={24} />,
    description: "AI-powered brewery staffing tool that creates optimized schedules for taproom, brewing, and packaging staff based on production needs and peak hours.",
    category: "Brewery Staffing",
    rating: 4.7,
    reviews: 232,
    creator: "BrewStaff Pro",
    actions: ["create schedules", "analyze staff needs", "optimize shifts"]
  },
  {
    id: 3,
    name: "Local Permit Application Helper",
    icon: <FaClipboard className="text-purple-600" size={24} />,
    description: "Automatically fills brewery permit applications for your city/county and submits directly to local permitting offices. Handles live music, food service, and special events.",
    category: "Brewery Permits",
    rating: 4.9,
    reviews: 178,
    creator: "BrewPermit Technologies",
    actions: ["fill forms", "submit applications", "track status"]
  },
  {
    id: 4,
    name: "Craft Beer Customer Analyzer",
    icon: <FaChartBar className="text-amber-600" size={24} />,
    description: "Identifies who likes your beer by analyzing taproom data, social media mentions, and local check-ins. Creates detailed customer profiles for targeted marketing.",
    category: "Brewery Marketing",
    rating: 4.8,
    reviews: 159,
    creator: "CraftAnalytics",
    actions: ["analyze preferences", "identify demographics", "create profiles"]
  },
  {
    id: 5,
    name: "Brewery Inventory Manager",
    icon: <FaDatabase className="text-red-500" size={24} />,
    description: "Specialized inventory system for small breweries. Tracks ingredients, packaging materials, and finished product with minimal tech requirements.",
    category: "Brewery Operations",
    rating: 4.6,
    reviews: 144,
    creator: "BrewStock Solutions",
    actions: ["track inventory", "send alerts", "optimize ordering"]
  },
  {
    id: 6,
    name: "Brewery Payment Provider",
    icon: <FaShoppingCart className="text-blue-700" size={24} />,
    description: "Alternative payment processing system for brewery taprooms. Specializes in handling tabs, tipping, and flight boards with lower fees than Square.",
    category: "Brewery Payments",
    rating: 4.7,
    reviews: 156,
    creator: "TapTab Financial",
    actions: ["process payments", "handle tabs", "manage tipping"]
  },
  {
    id: 7,
    name: "Water Usage Optimizer",
    icon: <FaDatabase className="text-cyan-500" size={24} />,
    description: "Analyzes your brewery's water consumption and recommends equipment upgrades and process changes to reduce usage and improve sustainability.",
    category: "Brewery Sustainability",
    rating: 4.8,
    reviews: 98,
    creator: "BrewGreen Technologies",
    actions: ["analyze usage", "optimize processes", "calculate savings"]
  },
  {
    id: 8,
    name: "Craft Beer Pricing Advisor",
    icon: <FaChartBar className="text-emerald-600" size={24} />,
    description: "Specialized pricing tool for small-batch and specialty craft beers. Factors in ingredient costs, local market rates, and perceived value.",
    category: "Brewery Finance",
    rating: 4.7,
    reviews: 112,
    creator: "CraftValue Analytics",
    actions: ["analyze costs", "recommend prices", "model profit margins"]
  },
  {
    id: 9,
    name: "Brewery Food Menu Builder",
    icon: <FaClipboard className="text-yellow-700" size={24} />,
    description: "Creates simple food menus for taprooms without full kitchens. Includes food truck scheduling, local partnerships, and small-plate options.",
    category: "Brewery Food Service",
    rating: 4.5,
    reviews: 87,
    creator: "BrewBites Solutions",
    actions: ["create menus", "find partnerships", "manage scheduling"]
  },
  {
    id: 10,
    name: "Local Restaurant Partnership Agent",
    icon: <FaEnvelope className="text-orange-600" size={24} />,
    description: "Helps craft breweries get their beer on more local restaurant menus by creating personalized pitches, handling follow-ups, and managing relationships.",
    category: "Brewery Distribution",
    rating: 4.9,
    reviews: 142,
    creator: "CraftConnect Network",
    actions: ["create pitches", "schedule follow-ups", "track placements"]
  }
];

interface AgentMarketplaceProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallAgent: (agentId: number) => void;
}

const AgentMarketplace = ({ isOpen, onClose, onInstallAgent }: AgentMarketplaceProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [installingAgent, setInstallingAgent] = useState<number | null>(null);
  
  // Filter agents by category and search query
  const filteredAgents = mockAgents.filter(agent => {
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || agent.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Get unique categories
  const categories = Array.from(new Set(mockAgents.map(agent => agent.category)));
  
  // Handle agent installation
  const handleInstallAgent = (agentId: number) => {
    setInstallingAgent(agentId);
    
    // Simulate installation
    setTimeout(() => {
      setInstallingAgent(null);
      
      // Pass the selected agent ID to the parent component for execution
      onInstallAgent(agentId);
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FaRobot className="text-[#0a66c2] mr-2" />
            <span>Brewery Solutions Marketplace</span>
          </DialogTitle>
          <DialogDescription>
            Browse and install specialized brewery AI tools to help you solve this challenge. These agents work alongside ConsultIn to provide brewery-specific capabilities.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-1">
          {/* Search and filter */}
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search agents..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory || 'all'} onValueChange={(val) => setSelectedCategory(val)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Agent grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {filteredAgents.map((agent) => (
              <div key={agent.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow p-4">
                <div className="flex items-start">
                  <div className="p-2 rounded-md bg-[#f3f2ef] flex-shrink-0">
                    {agent.icon}
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-semibold">{agent.name}</h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <div className="flex items-center">
                        {Array(5).fill(0).map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(agent.rating) ? (
                              <FaStar className="text-yellow-400" size={12} />
                            ) : (
                              <FaRegStar className="text-yellow-400" size={12} />
                            )}
                          </span>
                        ))}
                      </div>
                      <span className="ml-1">{agent.rating}</span>
                      <span className="mx-1">•</span>
                      <span>{agent.reviews} reviews</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 mb-2">{agent.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {agent.actions.map((action, idx) => (
                        <span key={idx} className="inline-block bg-[#f3f2ef] text-xs px-2 py-0.5 rounded-full">
                          {action}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">By {agent.creator}</span>
                      <Button
                        onClick={() => handleInstallAgent(agent.id)}
                        disabled={installingAgent === agent.id}
                        size="sm"
                        className={`text-xs ${
                          installingAgent === agent.id
                            ? 'bg-[#e8f3ff] text-[#0a66c2]'
                            : 'bg-[#0a66c2] hover:bg-blue-700 text-white'
                        }`}
                      >
                        {installingAgent === agent.id ? (
                          <>
                            <FaSpinner className="mr-1 animate-spin" />
                            Installing...
                          </>
                        ) : (
                          <>
                            <FaDownload className="mr-1" />
                            Install
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredAgents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No agents match your search or filter criteria.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentMarketplace;