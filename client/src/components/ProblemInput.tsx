import { useState } from "react";
import { FaBold, FaItalic, FaLink, FaPaperclip } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FaQuestionCircle } from "react-icons/fa";

interface ProblemInputProps {
  onSubmit: (problem: string) => void;
  isLoading: boolean;
}

const ProblemInput = ({ onSubmit, isLoading }: ProblemInputProps) => {
  const [problem, setProblem] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!problem.trim()) {
      toast({
        title: "Error",
        description: "Please describe your business problem first.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(problem);
  };

  return (
    <Card className="mb-6 overflow-hidden linkedin-card">
      <div className="p-4 border-b border-[#e0e0e0] flex items-center">
        <h2 className="text-lg font-semibold flex-1">Craft Brewery Solutions</h2>
        <button className="text-[#666666] hover:bg-[#f3f2ef] rounded-full h-8 w-8 flex items-center justify-center">
          <FaQuestionCircle />
        </button>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-center mb-3">What brewery challenge are you facing today?</h3>
        <p className="text-center text-[#666666] mb-4">
          Tell us your brewing business challenges, and we'll connect you with solutions tailored for your craft brewery
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          <div 
            className="text-xs py-1 px-3 bg-[#f3f2ef] text-[#666666] rounded-full cursor-pointer hover:bg-[#e3e2df]"
            onClick={() => setProblem("I'm struggling to find reliable suppliers for specialty hops for our seasonal IPAs")}
          >
            Hop supply issues
          </div>
          <div 
            className="text-xs py-1 px-3 bg-[#f3f2ef] text-[#666666] rounded-full cursor-pointer hover:bg-[#e3e2df]"
            onClick={() => setProblem("How can I retain good brewery staff when I can't compete with larger breweries on salary?")}
          >
            Staff retention
          </div>
          <div 
            className="text-xs py-1 px-3 bg-[#f3f2ef] text-[#666666] rounded-full cursor-pointer hover:bg-[#e3e2df]"
            onClick={() => setProblem("Our taproom traffic is down this quarter. What marketing strategies work best for small local breweries?")}
          >
            Brewery marketing
          </div>
        </div>
        
        <div className="mb-4">
          <div className="border border-[#e0e0e0] rounded-lg p-3 focus-within:border-[#0a66c2] focus-within:ring-1 focus-within:ring-[#0a66c2]">
            <Textarea
              placeholder="I'm having trouble with..."
              rows={4}
              className="w-full outline-none resize-none text-[#191919] border-none p-0"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            />
            
            <div className="flex justify-between items-center border-t border-[#e0e0e0] mt-2 pt-2">
              <div className="flex space-x-2">
                <button className="text-[#666666] hover:bg-[#f3f2ef] rounded p-1">
                  <FaBold />
                </button>
                <button className="text-[#666666] hover:bg-[#f3f2ef] rounded p-1">
                  <FaItalic />
                </button>
                <button className="text-[#666666] hover:bg-[#f3f2ef] rounded p-1">
                  <FaLink />
                </button>
                <button className="text-[#666666] hover:bg-[#f3f2ef] rounded p-1">
                  <FaPaperclip />
                </button>
              </div>
              <Button
                className="bg-[#0a66c2] hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-semibold"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Analyzing..." : "Find Solutions"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemInput;
