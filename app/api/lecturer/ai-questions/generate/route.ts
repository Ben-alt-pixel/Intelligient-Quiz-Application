import { generateObject } from "ai"
import { z } from "zod"
import { type NextRequest, NextResponse } from "next/server"

// Mock material storage - in production, fetch from database
const lecturerMaterials: any[] = []

const questionSchema = z.object({
  questions: z.array(
    z.object({
      text: z.string().describe("The question text"),
      options: z.array(z.string()).length(4).describe("Four answer options"),
      correctAnswer: z.number().min(0).max(3).describe("Index of correct option (0-3)"),
      difficulty: z.enum(["easy", "medium", "hard"]).describe("Question difficulty level"),
    })
  ),
})

export async function POST(request: NextRequest) {
  try {
    const { materialId, numQuestions, difficulty, questionType } = await request.json()

    // Mock: In production, fetch actual material from database
    const material = lecturerMaterials.find((m) => m.id === materialId) || {
      content: "Sample study material about biology, chemistry, and physics concepts.",
    }

    const prompt = `You are an expert educational question generator. Based on the following study material, generate ${numQuestions} ${difficulty} difficulty multiple-choice questions.

Study Material:
${material.content}

Requirements:
- Each question should have exactly 4 options
- Questions should test understanding of the material
- Difficulty should be: ${difficulty} (easy: basic recall, medium: application, hard: analysis/synthesis)
- Mark the correct answer index (0-3)
- Questions should be clear and unambiguous
- Options should be plausible distractors`

    const { object } = await generateObject({
      model: "groq/mixtral-8x7b-32768",
      schema: questionSchema,
      prompt,
      temperature: 0.7,
      maxOutputTokens: 4000,
    })

    return NextResponse.json({ questions: object.questions })
  } catch (error) {
    console.error("[v0] Error generating questions:", error)
    return NextResponse.json(
      { error: "Failed to generate questions", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
