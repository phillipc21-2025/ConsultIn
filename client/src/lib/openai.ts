import { apiRequest } from "./queryClient";
import type { SolutionResponse } from "@shared/schema";

export async function analyzeProblem(userId: number, problemText: string): Promise<SolutionResponse> {
  try {
    const response = await apiRequest('POST', '/api/analyze-problem', {
      userId,
      problem: problemText
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing problem:', error);
    throw new Error('Failed to analyze business problem');
  }
}
