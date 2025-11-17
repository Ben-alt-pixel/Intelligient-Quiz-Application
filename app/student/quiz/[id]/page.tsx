"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { quizService } from "@/lib/api-services/quiz-service"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: string
  explanation?: string
}

interface Quiz {
  id: string
  title: string
  description?: string
  questions: Question[]
  duration: number
  passingScore: number
}

export default function TakeQuizPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!storedUser || !token) {
      router.push("/login")
      return
    }

    fetchQuizAndStartSession()
  }, [])

  useEffect(() => {
    if (!timeRemaining || timeRemaining === 0) return

    const timer = setInterval(() => {
      setTimeRemaining((t) => {
        if (t === 1) {
          handleSubmitQuiz()
          return 0
        }
        return t ? t - 1 : 0
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  const fetchQuizAndStartSession = async () => {
    try {
      const quizData = await quizService.getQuizById(params.id as string)
      setQuiz(quizData)
      setTimeRemaining(quizData.duration * 60)

      // Start quiz session
      const session = await quizService.startSession(params.id as string)
      setSessionId(session.id)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load quiz",
        variant: "destructive",
      })
      router.push("/student")
    }
  }

  const handleAnswerChange = (answer: string) => {
    setAnswers({
      ...answers,
      [quiz!.questions[currentQuestion].id]: answer,
    })
  }

  const handleNext = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    if (!sessionId) return

    setIsSubmitting(true)
    try {
      await quizService.submitSession(sessionId)

      toast({
        title: "Success",
        description: "Quiz submitted successfully",
      })

      router.push("/student/results")
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!quiz) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading quiz...</p>
          </div>
        </div>
      </main>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{quiz.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </p>
          </div>
          <div className="text-center bg-primary text-primary-foreground px-6 py-3 rounded-lg">
            <p className="text-sm font-medium">Time Remaining</p>
            <p className="text-2xl font-bold">
              {Math.floor(timeRemaining! / 60)}:{(timeRemaining! % 60).toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-foreground">Progress</p>
            <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
          </div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-8 border-2 border-border mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">{question.text}</h2>

          <div className="space-y-3">
            {question.options?.map((option: string, index: number) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  answers[question.id] === option
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  name="option"
                  checked={answers[question.id] === option}
                  onChange={() => handleAnswerChange(option)}
                  className="w-4 h-4 text-primary accent-primary"
                />
                <span className="ml-3 text-foreground font-medium flex-1">{option}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            size="lg"
            className="border-2 border-border bg-transparent"
          >
            Previous
          </Button>

          <div className="flex gap-2 flex-wrap justify-center">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  index === currentQuestion
                    ? "bg-primary text-primary-foreground"
                    : answers[quiz.questions[index].id] !== undefined
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-border text-foreground hover:bg-border/70"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
