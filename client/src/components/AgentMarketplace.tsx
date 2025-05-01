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

// Mock AI agents for marketplace
const mockAgents = [
  {
    id: 1,
    name: "Supply Chain Optimizer",
    icon: <FaShippingFast className="text-blue-500" size={24} />,
    description: "AI-powered assistant that analyzes your supply chain and recommends optimization strategies.",
    category: "Supply Chain",
    rating: 4.8,
    reviews: 124,
    creator: "LinkedIn Business Solutions",
    actions: ["analyze", "optimize", "report"]
  },
  {
    id: 2,
    name: "Email Composer Pro",
    icon: <FaEnvelope className="text-green-500" size={24} />,
    description: "Creates professional business emails with perfect tone and formatting for any business need.",
    category: "Communication",
    rating: 4.7,
    reviews: 356,
    creator: "ProWrite AI",
    actions: ["draft", "edit", "schedule"]
  },
  {
    id: 3,
    name: "Form Builder AI",
    icon: <FaClipboard className="text-purple-500" size={24} />,
    description: "Generate custom forms for data collection, surveys, and business processes with smart validation.",
    category: "Process Automation",
    rating: 4.6,
    reviews: 89,
    creator: "FormForge Technologies",
    actions: ["create", "validate", "analyze"]
  },
  {
    id: 4,
    name: "Market Analyst",
    icon: <FaChartBar className="text-orange-500" size={24} />,
    description: "Real-time market analysis and competitor insights for strategic business decisions.",
    category: "Business Intelligence",
    rating: 4.9,
    reviews: 212,
    creator: "DataSense AI",
    actions: ["research", "compare", "visualize"]
  },
  {
    id: 5,
    name: "Inventory Manager",
    icon: <FaDatabase className="text-red-500" size={24} />,
    description: "Optimize inventory levels, predict stock needs, and prevent overstock or stockouts.",
    category: "Supply Chain",
    rating: 4.5,
    reviews: 78,
    creator: "SupplyAI Solutions",
    actions: ["track", "forecast", "optimize"]
  },
  {
    id: 6,
    name: "Product Recommender",
    icon: <FaShoppingCart className="text-indigo-500" size={24} />,
    description: "Recommend the perfect products and services for specific business needs and constraints.",
    category: "Sales",
    rating: 4.7,
    reviews: 156,
    creator: "RecoSystems Inc.",
    actions: ["analyze", "recommend", "compare"]
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
    
    // Simulate installation and then close dialog and show action
    setTimeout(() => {
      setInstallingAgent(null);
      onInstallAgent(agentId);
    }, 2000);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FaRobot className="text-[#0a66c2] mr-2" />
            <span>ConsultIn Agent Marketplace</span>
          </DialogTitle>
          <DialogDescription>
            Browse and install AI agents to help you complete this step. Agents work alongside ConsultIn to provide specialized capabilities.
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