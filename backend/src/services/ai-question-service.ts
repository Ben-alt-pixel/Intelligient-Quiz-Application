import { prisma } from "@/config/database";
import { generateQuestionsWithAI } from "@/utils/ai-helper";
import { Difficulty } from "@prisma/client";
import { z } from "zod";

const GenerateQuestionsSchema = z.object({
  materialId: z.string(),
  numberOfQuestions: z.number().min(1).max(20),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  quizId: z.string(),
});

const AutoGenerateSchema = z.object({
  materialId: z.string(),
  lecturerId: z.string(),
  numberOfQuestions: z.number().min(1).max(20).default(10),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
  duration: z.number().min(1).default(30), // Default 30 minutes
  passingScore: z.number().min(0).max(100).default(70), // Default 70%
});

export class AIQuestionService {
  /**
   * Auto-generate quiz and questions from material
   * This creates a quiz automatically and generates questions
   */
  static async autoGenerateQuizFromMaterial(
    data: z.infer<typeof AutoGenerateSchema>
  ) {
    const validatedData = AutoGenerateSchema.parse(data);

    // 1. Get the material
    const material = await prisma.material.findUnique({
      where: { id: validatedData.materialId },
    });

    if (!material) {
      throw new Error("Material not found");
    }

    if (!material.content || material.content.trim().length === 0) {
      throw new Error(
        "Material has no content. Please upload a file with text content."
      );
    }

    // 2. Create the quiz automatically
    const quiz = await prisma.quiz.create({
      data: {
        title: `Quiz: ${material.title}`,
        description: `Auto-generated quiz from material: ${material.title}`,
        duration: validatedData.duration,
        passingScore: validatedData.passingScore,
        lecturerId: validatedData.lecturerId,
      },
    });

    // 3. Generate questions using AI
    const generatedQuestions = await generateQuestionsWithAI(
      material.content,
      validatedData.numberOfQuestions,
      validatedData.difficulty as Difficulty
    );

    // 4. Save all questions to database
    const questions = await Promise.all(
      generatedQuestions.map((q) => {
        // Ensure options is properly formatted
        let optionsJson: string;
        if (typeof q.options === "string") {
          optionsJson = q.options;
        } else if (Array.isArray(q.options)) {
          optionsJson = JSON.stringify(q.options);
        } else {
          optionsJson = "[]";
        }

        // Ensure correctAnswer is a number
        let correctAnswerIndex: number;
        if (typeof q.correctAnswer === "number") {
          correctAnswerIndex = q.correctAnswer;
        } else if (typeof q.correctAnswer === "string") {
          correctAnswerIndex = parseInt(q.correctAnswer) || 0;
        } else {
          correctAnswerIndex = 0;
        }

        return prisma.question.create({
          data: {
            text: q.text || "",
            type: q.type || "MCQ",
            options: optionsJson,
            correctAnswer: correctAnswerIndex,
            difficulty: q.difficulty || validatedData.difficulty,
            explanation: q.explanation,
            quizId: quiz.id,
            materialId: validatedData.materialId,
          },
        });
      })
    );

    return {
      quiz,
      questions,
      summary: {
        totalQuestions: questions.length,
        difficulty: validatedData.difficulty,
        duration: validatedData.duration,
        passingScore: validatedData.passingScore,
      },
    };
  }
  static async generateQuestions(
    data: z.infer<typeof GenerateQuestionsSchema>
  ) {
    GenerateQuestionsSchema.parse(data);

    const material = await prisma.material.findUnique({
      where: { id: data.materialId },
    });

    if (!material) {
      throw new Error("Material not found");
    }

    const generatedQuestions = await generateQuestionsWithAI(
      material.content,
      data.numberOfQuestions,
      data.difficulty as Difficulty
    );

    // Save generated questions to database
    const questions = await Promise.all(
      generatedQuestions.map((q) => {
        // Ensure options is properly formatted
        let optionsJson: string;
        if (typeof q.options === "string") {
          optionsJson = q.options;
        } else if (Array.isArray(q.options)) {
          optionsJson = JSON.stringify(q.options);
        } else {
          optionsJson = "[]";
        }

        // Ensure correctAnswer is a number
        let correctAnswerIndex: number;
        if (typeof q.correctAnswer === "number") {
          correctAnswerIndex = q.correctAnswer;
        } else if (typeof q.correctAnswer === "string") {
          correctAnswerIndex = parseInt(q.correctAnswer) || 0;
        } else {
          correctAnswerIndex = 0;
        }

        return prisma.question.create({
          data: {
            text: q.text || "",
            type: q.type || "MCQ",
            options: optionsJson,
            correctAnswer: correctAnswerIndex,
            difficulty: q.difficulty || "MEDIUM",
            explanation: q.explanation,
            quizId: data.quizId,
            materialId: data.materialId,
          },
        });
      })
    );

    return questions;
  }

  static async getGeneratedQuestions(quizId: string, materialId: string) {
    return await prisma.question.findMany({
      where: {
        quizId,
        materialId,
      },
    });
  }
}
