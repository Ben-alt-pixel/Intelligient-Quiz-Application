"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  description?: string
}

interface Result {
  id: string
  quizTitle: string
  score: number
  totalQuestions: number
  completedAt: string
  quizId?: string
  quizData?: {
    questions: Question[]
  }
  answers?: Record<string, number>
}

const mockQuizzes: Result[]= [
  {
   id: '1',
  quizTitle: 'Compiler Construction',
  score: 40,
  totalQuestions: 60,
  completedAt: '11.45',
  quizId: '3',
  quizData: {
    questions: [{
      id: "1",
      text: "What is a compiler",
      options: ["test1", "test2", "test3", "test4"],
      correctAnswer: 0,
    }] 
  },
  }
]

export default function StudentResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [results, setResults] = useState<Result[]>(mockQuizzes)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedResult, setSelectedResult] = useState<Result | null>(null)

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
      const res = await fetch("/api/results")
      const data = await res.json()
      // setResults(data.results || [])
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

  const getScoreBgColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return "bg-green-100 dark:bg-green-900/20"
    if (percentage >= 60) return "bg-yellow-100 dark:bg-yellow-900/20"
    return "bg-red-100 dark:bg-red-900/20"
  }

  if (selectedResult) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        {/* Header */}
        <header className="bg-primary text-primary-foreground shadow-lg">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
            <h1 className="text-3xl font-bold">{selectedResult.quizTitle}</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">Detailed Feedback</p>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
          <button
            onClick={() => setSelectedResult(null)}
            className="mb-6 flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Results
          </button>

          {/* Score Summary */}
          <Card className={`p-8 border-2 border-border mb-8 ${getScoreBgColor(selectedResult.score, selectedResult.totalQuestions)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Your Score</p>
                <h2 className="text-4xl font-bold text-foreground">
                  {selectedResult.score}/{selectedResult.totalQuestions}
                </h2>
              </div>
              <div className="text-right">
                <p className={`text-5xl font-bold ${getScoreColor(selectedResult.score, selectedResult.totalQuestions)}`}>
                  {Math.round((selectedResult.score / selectedResult.totalQuestions) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedResult.score === selectedResult.totalQuestions
                    ? "Perfect Score!"
                    : selectedResult.score > selectedResult.totalQuestions / 2
                      ? "Good Job!"
                      : "Keep Practicing!"}
                </p>
              </div>
            </div>
          </Card>

          {/* Question Feedback */}
          <h3 className="text-2xl font-bold text-foreground mb-6">Question Review</h3>
          <div className="space-y-4">
            {selectedResult.quizData?.questions.map((question, index) => {
              const userAnswer = selectedResult.answers?.[question.id]
              const isCorrect = userAnswer === question.correctAnswer
              return (
                <Card key={question.id} className={`p-6 border-2 ${isCorrect ? "border-green-500 bg-green-50 dark:bg-green-900/10" : "border-red-500 bg-red-50 dark:bg-red-900/10"}`}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${isCorrect ? "bg-green-500" : "bg-red-500"}`}>
                      {isCorrect ? "✓" : "✗"}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Question {index + 1}</p>
                      <p className="text-foreground mt-2">{question.text}</p>
                    </div>
                  </div>

                  <div className="space-y-2 ml-11">
                    <p className="text-sm font-medium text-foreground">Your Answer:</p>
                    <p className={`text-sm p-2 rounded ${isCorrect ? "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100" : "bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100"}`}>
                      {question.options[userAnswer ?? -1] || "Not answered"}
                    </p>

                    {!isCorrect && (
                      <>
                        <p className="text-sm font-medium text-foreground mt-3">Correct Answer:</p>
                        <p className="text-sm p-2 rounded bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100">
                          {question.options[question.correctAnswer]}
                        </p>
                      </>
                    )}

                    {question.description && (
                      <>
                        <p className="text-sm font-medium text-foreground mt-3">Explanation:</p>
                        <p className="text-sm p-3 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 italic">
                          {question.description}
                        </p>
                      </>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-border/50 flex gap-3">
            <Button onClick={() => setSelectedResult(null)} variant="outline" className="border-2 border-primary text-primary bg-transparent">
              Back to Results
            </Button>
            <Link href="/student">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
    )
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
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          <h1 className="text-3xl font-bold">Your Results</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">Track your quiz performance</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {results.length === 0 ? (
          <Card className="p-12 text-center border-2 border-dashed border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">No Results Yet</h3>
            <p className="text-muted-foreground mb-6">Complete some quizzes to see your results here.</p>
            <Link href="/student">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Go to Quizzes</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <Card
                key={result.id}
                className="p-6 border-2 border-border hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => setSelectedResult(result)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{result.quizTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      Completed on {new Date(result.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${getScoreColor(result.score, result.totalQuestions)}`}>
                      {result.score}/{result.totalQuestions}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((result.score / result.totalQuestions) * 100)}%
                    </p>
                  </div>
                </div>
                <p className="text-xs text-primary mt-3 font-medium">Click to view detailed feedback →</p>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-border/50">
          <Link href="/student">
            <Button variant="outline" className="border-2 border-primary text-primary bg-transparent">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
