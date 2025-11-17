"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { quizService } from "@/lib/api-services"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  description?: string
}

export default function CreateQuizPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timeLimit, setTimeLimit] = useState("15")
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      description: "",
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    if (parsedUser.role !== "LECTURER") {
      router.push("/")
      return
    }
  }, [router])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      description: "",
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) => (idx === optionIndex ? value : opt)),
            }
          : q,
      ),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("Please enter a quiz title")
      return
    }

    if (questions.some((q) => !q.text.trim() || q.options.some((opt) => !opt.trim()))) {
      alert("Please fill in all questions and options")
      return
    }

    setIsSubmitting(true)

    console.log(title, description, timeLimit, questions)

    try { 
      const res = await quizService.createQuiz({   
          title,
          description,
          duration: Number.parseInt(timeLimit),
          passingScore: 70,
          questions
        })

      if ((res as Response).ok) {
        router.push("/lecturer")
      }
    } catch (error) {
      console.error("Error creating quiz:", error)
      alert("Failed to create quiz")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
          <h1 className="text-3xl font-bold">Create New Quiz</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">Design your academic assessment</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Details */}
          <Card className="p-8 border-2 border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Quiz Details</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Quiz Title *</label>
                <Input
                  type="text"
                  placeholder="e.g., Biology Midterm Exam"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  placeholder="Optional description for students"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Time Limit (minutes)</label>
                <Input
                  type="number"
                  min="1"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  className="border-border"
                />
              </div>
            </div>
          </Card>

          {/* Questions */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Questions</h2>

            <div className="space-y-6">
              {questions.map((question, questionIndex) => (
                <Card key={question.id} className="p-6 border-2 border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Question {questionIndex + 1}</h3>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                        onClick={() => removeQuestion(question.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Question Text *</label>
                      <textarea
                        placeholder="Enter the question"
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, "text", e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground">Answer Options *</p>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() => updateQuestion(question.id, "correctAnswer", optionIndex)}
                            className="w-4 h-4 text-primary accent-primary"
                          />
                          <Input
                            type="text"
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            className="flex-1 border-border"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-4 border-t border-border/50">
                      <label className="text-sm font-medium text-foreground">
                        Explanation (Optional)
                        <span className="text-xs text-muted-foreground ml-2">Students will see this after answering</span>
                      </label>
                      <textarea
                        placeholder="Explain why this answer is correct (e.g., The correct answer is B because...)"
                        value={question.description || ""}
                        onChange={(e) => updateQuestion(question.id, "description", e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button
              type="button"
              onClick={addQuestion}
              variant="outline"
              className="mt-6 border-2 border-primary text-primary hover:bg-primary/5 bg-transparent"
            >
              Add Question
            </Button>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isSubmitting ? "Creating Quiz..." : "Create Quiz"}
            </Button>
            <Link href="/lecturer" className="flex-1">
              <Button type="button" variant="outline" className="w-full border-2 border-border bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
