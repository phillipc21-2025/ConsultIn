import { Card } from "@/components/ui/card";
import { FaChevronRight } from "react-icons/fa";

const SuccessStories = () => {
  return (
    <Card className="mb-6 linkedin-card">
      <div className="p-4 border-b border-[#e0e0e0]">
        <h2 className="text-lg font-semibold">Success Stories</h2>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold mb-3">How other brewery owners solved supply chain challenges</h3>
        
        <div className="mb-4 pb-4 border-b border-[#e0e0e0]">
          <div className="flex items-start">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" 
              alt="James Wilson" 
              className="h-10 w-10 rounded-full object-cover" 
            />
            <div className="ml-3 flex-1">
              <h4 className="font-semibold">James Wilson</h4>
              <p className="text-sm text-[#666666]">Founder, Riverside Brewing Co.</p>
              <p className="text-sm mt-2">"Building relationships with local farmers and creating a co-op with three other breweries solved our supply issues completely. We now have reliable ingredients year-round with better pricing than we had before."</p>
            </div>
          </div>
        </div>
        
        <a href="#" className="text-[#0a66c2] hover:underline font-semibold text-sm flex items-center justify-center">
          View more stories <FaChevronRight className="ml-1" />
        </a>
      </div>
    </Card>
  );
};

export default SuccessStories;
