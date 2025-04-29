import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import ProblemInput from "./ProblemInput";
import SolutionsContainer from "./SolutionsContainer";
import SuccessStories from "./SuccessStories";
import { analyzeProblem } from "@/lib/openai";
import type { SolutionResponse } from "@shared/schema";

const SMBPage = () => {
  const [solution, setSolution] = useState<SolutionResponse | null>(null);
  const { toast } = useToast();
  
  const { mutate, isPending } = useMutation({
    mutationFn: (problem: string) => analyzeProblem(1, problem),
    onSuccess: (data) => {
      setSolution(data);
      toast({
        title: "Analysis Complete",
        description: "We've analyzed your business problem and found some potential solutions.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze your problem. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitProblem = (problem: string) => {
    mutate(problem);
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="md:flex md:gap-6">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Main Content */}
        <div className="flex-1 max-w-2xl mx-auto">
          <ProblemInput onSubmit={handleSubmitProblem} isLoading={isPending} />
          
          {solution && (
            <>
              <SolutionsContainer solution={solution} />
              <SuccessStories />
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </main>
  );
};

export default SMBPage;
