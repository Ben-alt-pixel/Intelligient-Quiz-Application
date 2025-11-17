import { type NextRequest, NextResponse } from "next/server"

let lecturerQuizzes: any[] = []

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const quiz = lecturerQuizzes.find((q) => q.id === id)

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
  }

  return NextResponse.json({ quiz })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { title, description, timeLimit, questions } = await request.json()

  const quizIndex = lecturerQuizzes.findIndex((q) => q.id === id)
  if (quizIndex === -1) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
  }

  lecturerQuizzes[quizIndex] = {
    ...lecturerQuizzes[quizIndex],
    title,
    description,
    timeLimit,
    questions,
    questionCount: questions.length,
  }

  return NextResponse.json({ quiz: lecturerQuizzes[quizIndex] })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  lecturerQuizzes = lecturerQuizzes.filter((q) => q.id !== id)
  return NextResponse.json({ success: true })
}
