import { type NextRequest, NextResponse } from "next/server"

// Mock results database
const results: any[] = []

export async function GET() {
  return NextResponse.json({ results })
}

export async function POST(request: NextRequest) {
  try {
    const { quizId, answers, quizData } = await request.json()

    // Mock scoring - count correct answers
    let score = 0
    const correctAnswers: Record<string, number> = {
      q1: 1,
      q2: 1,
      q3: 1,
      q4: 3,
      q5: 1,
      q6: 0,
      q7: 1,
      q8: 1,
      q9: 1,
      q10: 1,
    }

    if (quizData && quizData.questions) {
      score = quizData.questions.filter((q: any) => {
        return answers[q.id] === q.correctAnswer
      }).length
    } else {
      Object.entries(answers).forEach(([questionId, selectedOption]) => {
        if (correctAnswers[questionId] === selectedOption) {
          score++
        }
      })
    }

    const quizTitles: Record<string, string> = {
      "1": "Introduction to Biology",
      "2": "World History - 20th Century",
      "3": "Mathematics - Calculus Basics",
    }

    const result = {
      id: Math.random().toString(36).substr(2, 9),
      quizId,
      quizTitle: quizData?.title || quizTitles[quizId] || "Quiz",
      score,
      totalQuestions: quizData?.questions?.length || Object.keys(answers).length,
      completedAt: new Date().toISOString(),
      quizData,
      answers,
    }

    results.push(result)

    return NextResponse.json({ result })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 })
  }
}
