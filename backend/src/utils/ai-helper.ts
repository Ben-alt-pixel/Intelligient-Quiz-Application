import { Question, Difficulty } from "@prisma/client"

// Mock AI question generation
// Replace with actual OpenAI API call if needed
export async function generateQuestionsWithAI(
  materialContent: string,
  numberOfQuestions: number,
  difficulty: Difficulty
): Promise<Partial<Question>[]> {
  // Simulated AI response
  const questions: Partial<Question>[] = []

  for (let i = 1; i <= numberOfQuestions; i++) {
    questions.push({
      text: `AI Generated Question ${i}: Based on the material, what is concept ${i}?`,
      type: "MCQ",
      options: JSON.stringify([
        `Option A for question ${i}`,
        `Option B for question ${i}`,
        `Option C for question ${i}`,
        `Option D for question ${i}`,
      ]),
      correctAnswer: "Option A for question " + i,
      difficulty,
      explanation: `This is the explanation for question ${i}. ${materialContent.substring(0, 50)}...`,
    })
  }

  return questions
}

// Alternative: Real OpenAI integration
export async function generateQuestionsWithOpenAI(
  materialContent: string,
  numberOfQuestions: number,
  difficulty: Difficulty
): Promise<Partial<Question>[]> {
  // This would require actual OpenAI API integration
  // Placeholder for now
  return generateQuestionsWithAI(materialContent, numberOfQuestions, difficulty)
}
