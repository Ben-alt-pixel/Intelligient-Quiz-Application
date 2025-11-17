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
  isPublished: boolean
  questions: any[]
  createdAt: string
}

const mockQuizzes: Quiz[]= [
  {
    id: "1",
    title: "Compiler Construction",
    description: "Cos 431 test",
    duration: 30,
    isPublished: true,
    questions: [{
      question: "Obi is a boy"
    }],
    createdAt: new Date().toISOString()
  }
]

export default function LecturerDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!storedUser || !token) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    if (parsedUser.role !== "LECTURER") {
      router.push("/")
      return
    }

    setUser(parsedUser)
    fetchQuizzes()
  }, [router])

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true)
      const data = await quizService.getMyQuizzes()
      // setQuizzes(data)
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

  const handleDeleteQuiz = async (quizId: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      try {
        await quizService.deleteQuiz(quizId)
        toast({
          title: "Success",
          description: "Quiz deleted successfully",
        })
        fetchQuizzes()
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to delete quiz",
          variant: "destructive",
        })
      }
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
            <div className="flex items-center justify-between flex-col md:flex-row gap-4">
              <div>
                <h1 className="text-3xl font-bold">Lecturer Dashboard</h1>
                <p className="text-primary-foreground/80 text-sm mt-1">Welcome, {user?.firstName} {user?.lastName}</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Link href="/lecturer/create">
                  <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
                    Create Quiz
                  </Button>
                </Link>
                <Link href="/lecturer/materials">
                  <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
                    Study Materials
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 border-2 border-border bg-card">
              <p className="text-muted-foreground text-sm font-medium">Total Quizzes</p>
              <p className="text-4xl font-bold text-primary mt-2">{quizzes.length}</p>
            </Card>
            <Card className="p-6 border-2 border-border bg-card">
              <p className="text-muted-foreground text-sm font-medium">Total Questions</p>
              <p className="text-4xl font-bold text-primary mt-2">
                {quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0)}
              </p>
            </Card>
            <Card className="p-6 border-2 border-border bg-card">
              <p className="text-muted-foreground text-sm font-medium">Published</p>
              <p className="text-4xl font-bold text-primary mt-2">
                {quizzes.filter((q) => q.isPublished).length}
              </p>
            </Card>
          </div>

          {/* Quizzes */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Quizzes</h2>

            {quizzes.length === 0 ? (
              <Card className="p-12 text-center border-2 border-dashed border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">No Quizzes Yet</h3>
                <p className="text-muted-foreground mb-6">Create your first quiz to get started.</p>
                <Link href="/lecturer/create">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Create Quiz</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                  <Card
                    key={quiz.id}
                    className="border-2 border-border hover:border-primary/50 transition-all overflow-hidden flex flex-col"
                  >
                    <div className="p-6 flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{quiz.title}</h3>
                      {quiz.description && (
                        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{quiz.description}</p>
                      )}
                      <p className="text-muted-foreground text-sm mb-4">
                        Created on {new Date(quiz.createdAt).toLocaleDateString()}
                      </p>

                      <div className="flex items-center justify-between py-3 border-t border-b border-border/50 mb-4">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Questions</p>
                          <p className="text-lg font-semibold text-primary">{quiz.questions?.length || 0}</p>
                        </div>
                        <div className="w-px h-8 bg-border/50"></div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className={`text-sm font-semibold ${quiz.isPublished ? "text-green-600" : "text-yellow-600"}`}>
                            {quiz.isPublished ? "Live" : "Draft"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-muted/30 border-t border-border space-y-2">
                      <Link href={`/lecturer/quiz/${quiz.id}`} className="w-full block">
                        <Button
                          size="sm"
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                        >
                          View Results
                        </Button>
                      </Link>
                      <Link href={`/lecturer/quiz/${quiz.id}/edit`} className="w-full block">
                        <Button size="sm" variant="outline" className="w-full border-border bg-transparent">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                        onClick={() => handleDeleteQuiz(quiz.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
