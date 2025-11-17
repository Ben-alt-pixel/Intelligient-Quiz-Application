import { NextResponse } from "next/server"

// Mock quiz database
const quizzes = [
  {
    id: "1",
    title: "Introduction to Biology",
    description: "Test your knowledge of basic biological concepts and cell structure.",
    questionCount: 10,
    timeLimit: 15,
    createdBy: "Dr. Smith",
  },
  {
    id: "2",
    title: "World History - 20th Century",
    description: "Assess your understanding of major events from 1900-2000.",
    questionCount: 15,
    timeLimit: 20,
    createdBy: "Prof. Johnson",
  },
  {
    id: "3",
    title: "Mathematics - Calculus Basics",
    description: "Foundation concepts in calculus including limits and derivatives.",
    questionCount: 12,
    timeLimit: 18,
    createdBy: "Dr. Williams",
  },
]

export async function GET() {
  return NextResponse.json({ quizzes })
}
