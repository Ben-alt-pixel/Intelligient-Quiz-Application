import { prisma } from "@/config/database"
import { generateQuestionsWithAI } from "@/utils/ai-helper"
import { Difficulty } from "@prisma/client"
import { z } from "zod"

const GenerateQuestionsSchema = z.object({
  materialId: z.string(),
  numberOfQuestions: z.number().min(1).max(20),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  quizId: z.string(),
})

export class AIQuestionService {
  static async generateQuestions(data: z.infer<typeof GenerateQuestionsSchema>) {
    GenerateQuestionsSchema.parse(data)

    const material = await prisma.material.findUnique({
      where: { id: data.materialId },
    })

    if (!material) {
      throw new Error("Material not found")
    }

    const generatedQuestions = await generateQuestionsWithAI(
      material.content,
      data.numberOfQuestions,
      data.difficulty as Difficulty
    )

    // Save generated questions to database
    const questions = await Promise.all(
      generatedQuestions.map((q) =>
        prisma.question.create({
          data: {
            text: q.text || "",
            type: q.type || "MCQ",
            options: q.options || "[]",
            correctAnswer: q.correctAnswer || "",
            difficulty: q.difficulty || "MEDIUM",
            explanation: q.explanation,
            quizId: data.quizId,
            materialId: data.materialId,
          },
        })
      )
    )

    return questions
  }

  static async getGeneratedQuestions(quizId: string, materialId: string) {
    return await prisma.question.findMany({
      where: {
        quizId,
        materialId,
      },
    })
  }
}
