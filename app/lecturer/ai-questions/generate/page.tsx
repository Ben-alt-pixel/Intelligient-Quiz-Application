"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface GeneratedQuestion {
  text: string
  options: string[]
  correctAnswer: number
  difficulty: "easy" | "medium" | "hard"
}

const DIFFICULTY_LEVELS = ["easy", "medium", "hard"] as const

export default function GenerateQuestionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const materialId = searchParams.get("materialId")

  const [materialTitle, setMaterialTitle] = useState("")
  const [numQuestions, setNumQuestions] = useState("5")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [questionType, setQuestionType] = useState("multiple-choice")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    if (parsedUser.role !== "lecturer") {
      router.push("/")
      return
    }

    if (materialId) {
      fetchMaterialTitle()
    }
  }, [router, materialId])

  const fetchMaterialTitle = async () => {
    try {
      const res = await fetch(`/api/lecturer/materials/${materialId}`)
      const data = await res.json()
      setMaterialTitle(data.material?.title || "Study Material")
    } catch (error) {
      console.error("Error fetching material:", error)
    }
  }

  const handleGenerateQuestions = async () => {
    if (!materialId) {
      alert("Please select a study material first")
      return
    }

    setIsGenerating(true)
    setGeneratedQuestions([])
    setSelectedQuestions([])

    try {
      const res = await fetch("/api/lecturer/ai-questions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materialId,
          numQuestions: parseInt(numQuestions),
          difficulty,
          questionType,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setGeneratedQuestions(data.questions || [])
        // Pre-select all generated questions
        setSelectedQuestions(Array.from({ length: data.questions?.length || 0 }, (_, i) => i))
      } else {
        alert("Failed to generate questions")
      }
    } catch (error) {
      console.error("Error generating questions:", error)
      alert("Error generating questions. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleQuestionSelection = (index: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const handleAddToQuiz = async () => {
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question")
      return
    }

    const questionsToAdd = selectedQuestions.map((i) => ({
      id: Math.random().toString(36).substr(2, 9),
      text: generatedQuestions[i].text,
      options: generatedQuestions[i].options,
      correctAnswer: generatedQuestions[i].correctAnswer,
    }))

    // Store questions in session for use in quiz creation
    sessionStorage.setItem("aiGeneratedQuestions", JSON.stringify(questionsToAdd))
    router.push("/lecturer/create")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          <h1 className="text-3xl font-bold">Generate AI Questions</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">
            From: {materialTitle || "Study Material"}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Generation Settings */}
        <Card className="p-8 border-2 border-border mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Generation Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Number of Questions</label>
              <Input
                type="number"
                min="1"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="border-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Question Type</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="multiple-choice">Multiple Choice</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleGenerateQuestions}
                disabled={isGenerating}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Generated Questions */}
        {generatedQuestions.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Generated Questions ({selectedQuestions.length} selected)
            </h2>

            <div className="space-y-4 mb-8">
              {generatedQuestions.map((question, index) => (
                <Card key={index} className="border-2 border-border p-6">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(index)}
                      onChange={() => toggleQuestionSelection(index)}
                      className="w-5 h-5 mt-1 text-primary accent-primary cursor-pointer rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground">Question {index + 1}</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          question.difficulty === "easy" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100" :
                          question.difficulty === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100" :
                          "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
                        }`}>
                          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                        </span>
                      </div>

                      <p className="text-foreground mb-4 font-medium">{question.text}</p>

                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className={`p-3 rounded border-2 ${
                            optionIndex === question.correctAnswer
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                              : "border-border bg-muted/30"
                          }`}>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                disabled
                                checked={optionIndex === question.correctAnswer}
                                className="w-4 h-4"
                              />
                              <span className="text-sm text-foreground">{option}</span>
                              {optionIndex === question.correctAnswer && (
                                <span className="ml-auto text-xs font-semibold text-green-600 dark:text-green-400">Correct</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToQuiz}
                disabled={selectedQuestions.length === 0}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Add Selected Questions to Quiz ({selectedQuestions.length})
              </Button>
              <Link href="/lecturer/materials" className="flex-1">
                <Button type="button" variant="outline" className="w-full border-2 border-border bg-transparent">
                  Back
                </Button>
              </Link>
            </div>
          </>
        )}

        {!isGenerating && generatedQuestions.length === 0 && (
          <Card className="p-12 text-center border-2 border-dashed border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">No Questions Generated Yet</h3>
            <p className="text-muted-foreground">Configure your settings above and click "Generate" to create AI questions from your study material.</p>
          </Card>
        )}
      </div>
    </main>
  )
}
