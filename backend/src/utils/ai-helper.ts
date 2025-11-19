import { Question, Difficulty } from "@prisma/client";
import { ollamaService } from "@/services/ollama-question-service";

/**
 * Generate questions using local Ollama model
 * Falls back to mock questions if Ollama is not available
 */
export async function generateQuestionsWithAI(
  materialContent: string,
  numberOfQuestions: number,
  difficulty: Difficulty
): Promise<Partial<Question>[]> {
  try {
    // Try to use Ollama for question generation
    const questions = await ollamaService.generateQuestions(
      materialContent,
      numberOfQuestions,
      difficulty
    );

    return questions;
  } catch (error: any) {
    console.error("Ollama generation failed, using fallback:", error.message);

    // Fallback to simple mock questions if Ollama fails
    return generateMockQuestions(
      materialContent,
      numberOfQuestions,
      difficulty
    );
  }
}

/**
 * Fallback mock question generation
 * Used when Ollama is not available
 */
function generateMockQuestions(
  materialContent: string,
  numberOfQuestions: number,
  difficulty: Difficulty
): Partial<Question>[] {
  const questions: Partial<Question>[] = [];

  // Extract some keywords from content for slightly better questions
  const words = materialContent.split(/\s+/).filter((w) => w.length > 5);
  const keywords = words.slice(0, Math.min(10, words.length));

  for (let i = 1; i <= numberOfQuestions; i++) {
    const keyword = keywords[i % keywords.length] || "concept";

    questions.push({
      text: `Based on the material, what best describes "${keyword}"?`,
      type: "MCQ",
      options: [
        `Definition A related to ${keyword}`,
        `Definition B related to ${keyword}`,
        `Definition C related to ${keyword}`,
        `Definition D related to ${keyword}`,
      ],
      correctAnswer: 0, // Index of correct answer
      difficulty,
      explanation: `This question is about ${keyword}. Note: Generated without AI as Ollama is not available. ${materialContent.substring(
        0,
        100
      )}...`,
    });
  }

  return questions;
}
