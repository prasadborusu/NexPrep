export interface AICompletionOptions {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface AIProvider {
  name: string;
  generateText(prompt: string, options?: AICompletionOptions): Promise<string>;
  isAvailable(): boolean;
}

export interface AISuggestionResponse {
  original: string;
  suggested: string;
  explanation: string;
}

export interface JobMatchResult {
  matchedSkills: string[];
  missingSkills: string[];
  needsReviewSkills: string[];
  roleRelevanceScore: number;
  recommendations: string[];
}
