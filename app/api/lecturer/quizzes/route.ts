import { type NextRequest, NextResponse } from "next/server"

const lecturerQuizzes: any[] = []

export async function GET() {
  return NextResponse.json({ quizzes: lecturerQuizzes })
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, timeLimit, questions } = await request.json()

    const newQuiz = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      timeLimit,
      questions,
      questionCount: questions.length,
      studentCount: 0,
      createdAt: new Date().toISOString(),
    }

    lecturerQuizzes.push(newQuiz)

    return NextResponse.json({ quiz: newQuiz })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
  }
}
