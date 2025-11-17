"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { useToast } from "@/hooks/use-toast"
import { quizService } from "@/lib/api-services/quiz-service"

interface Quiz {
  id: string
  title: string
  description?: string
  duration: number
  passingScore: number
}

export default function StudentDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!storedUser || !token) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    if (parsedUser.role !== "STUDENT") {
      router.push("/")
      return
    }

    setUser(parsedUser)
    fetchQuizzes()
  }, [router])

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true)
      const data = await quizService.getPublishedQuizzes()
      setQuizzes(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load quizzes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      <AuthenticatedHeader user={user} />
      
      <main className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        {/* Header section */}
        <div className="bg-primary text-primary-foreground shadow-lg">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
            <div>
              <h1 className="text-3xl font-bold">Quiz Dashboard</h1>
              <p className="text-primary-foreground/80 text-sm mt-1">Welcome, {user?.firstName} {user?.lastName}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Available Quizzes</h2>
            <p className="text-muted-foreground">
              {quizzes.length === 0
                ? "No quizzes available yet. Check back soon!"
                : `${quizzes.length} quiz${quizzes.length !== 1 ? "zes" : ""} available`}
            </p>
          </div>

          {quizzes.length === 0 ? (
            <Card className="p-12 text-center border-2 border-dashed border-border">
              <h3 className="text-lg font-semibold text-foreground mb-2">No Quizzes Yet</h3>
              <p className="text-muted-foreground">Quizzes created by lecturers will appear here.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{quiz.title}</h3>
                    {quiz.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{quiz.description}</p>
                    )}

                    <div className="flex items-center justify-between mb-6 py-3 border-t border-b border-border/50">
                      <div className="text-center flex-1">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-lg font-semibold text-primary">{quiz.duration} min</p>
                      </div>
                      <div className="w-px h-8 bg-border/50"></div>
                      <div className="text-center flex-1">
                        <p className="text-xs text-muted-foreground">Pass Score</p>
                        <p className="text-lg font-semibold text-primary">{quiz.passingScore}%</p>
                      </div>
                    </div>

                    <Link href={`/student/quiz/${quiz.id}`} className="w-full">
                      <Button
                        size="lg"
                        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
                      >
                        Start Quiz
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Results Section */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Results</h2>
            <Link href="/student/results">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/5 bg-transparent"
              >
                View All Results
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
