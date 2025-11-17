"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface StudentResult {
  studentName: string
  score: number
  totalQuestions: number
  completedAt: string
}

export default function QuizResultsPage() {
  const router = useRouter()
  const params = useParams()
  const [results, setResults] = useState<StudentResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      const res = await fetch(`/api/lecturer/quiz/${params.id}/results`)
      const data = await res.json()
      setResults(data.results || [])
    } catch (error) {
      console.error("Error fetching results:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getAverageScore = () => {
    if (results.length === 0) return 0
    const total = results.reduce((sum, r) => sum + r.score, 0)
    return Math.round((total / results.length / results[0].totalQuestions) * 100)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
          <h1 className="text-3xl font-bold">Quiz Results</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">View student performance and analytics</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 border-2 border-border">
            <p className="text-muted-foreground text-sm font-medium">Total Responses</p>
            <p className="text-4xl font-bold text-primary mt-2">{results.length}</p>
          </Card>
          <Card className="p-6 border-2 border-border">
            <p className="text-muted-foreground text-sm font-medium">Average Score</p>
            <p className="text-4xl font-bold text-primary mt-2">{getAverageScore()}%</p>
          </Card>
          <Card className="p-6 border-2 border-border">
            <p className="text-muted-foreground text-sm font-medium">Completion Rate</p>
            <p className="text-4xl font-bold text-primary mt-2">100%</p>
          </Card>
        </div>

        {/* Results Table */}
        <Card className="border-2 border-border overflow-hidden">
          <div className="p-6">
            {results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No student results yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Student Name</th>
                      <th className="text-center py-3 px-4 font-semibold text-foreground">Score</th>
                      <th className="text-center py-3 px-4 font-semibold text-foreground">Percentage</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => {
                      const percentage = Math.round((result.score / result.totalQuestions) * 100)
                      return (
                        <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 text-foreground">{result.studentName}</td>
                          <td className="py-3 px-4 text-center text-foreground font-semibold">
                            {result.score}/{result.totalQuestions}
                          </td>
                          <td
                            className={`py-3 px-4 text-center font-semibold ${getScoreColor(
                              result.score,
                              result.totalQuestions,
                            )}`}
                          >
                            {percentage}%
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-sm">
                            {new Date(result.completedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>

        {/* Navigation */}
        <div className="mt-8">
          <Link href="/lecturer">
            <Button variant="outline" className="border-2 border-primary text-primary bg-transparent">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
