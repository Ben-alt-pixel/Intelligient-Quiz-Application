import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Mock results data
  const mockResults = [
    {
      studentName: "Alice Johnson",
      score: 8,
      totalQuestions: 10,
      completedAt: "2024-11-10T14:30:00Z",
    },
    {
      studentName: "Bob Smith",
      score: 7,
      totalQuestions: 10,
      completedAt: "2024-11-11T09:15:00Z",
    },
    {
      studentName: "Carol Williams",
      score: 9,
      totalQuestions: 10,
      completedAt: "2024-11-11T16:45:00Z",
    },
  ]

  return NextResponse.json({ results: mockResults })
}
