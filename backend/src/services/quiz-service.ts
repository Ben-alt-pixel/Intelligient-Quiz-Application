import { prisma } from "@/config/database"
import { randomizeArray } from "@/utils/randomization"
import { z } from "zod"

const QuestionSchema = z.object({
  correctAnswer: z.number().min(0),
  description: z.string().optional(),
  options: z.array(z.string()).min(1),
  text: z.string().min(1),
}).refine(data => data.correctAnswer < data.options.length, {
  message: "correctAnswer must reference an index in options"
});

const CreateQuizSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().min(1),
  passingScore: z.number().min(0).max(100).default(60),
  questions: z.array(QuestionSchema)
});


const UpdateQuizSchema = CreateQuizSchema.partial()

export class QuizService {
  static async createQuiz(lecturerId: string, data: z.infer<typeof CreateQuizSchema>) {
    const res = CreateQuizSchema.parse(data)
    const {questions, ...resData} = res

    const quiz = await prisma.quiz.create({
      data: {
        ...resData,
        lecturerId,
      },
    })

    const questionsData = await prisma.question.createMany({
      data: questions.map((question) => ({
        text: question.text,
        correctAnswer: question.correctAnswer,
        options: question.options,
        quizId: quiz.id
      }))
    })
    console.log(questionsData)
    return quiz
  }

  static async getQuizzes(lecturerId: string) {
    return await prisma.quiz.findMany({
      where: { lecturerId },
      include: {
        questions: true,
      },
      orderBy: { createdAt: "desc" },
    })
  }

  static async getPublishedQuizzes() {
    return await prisma.quiz.findMany({
      include: {
        questions: true,
      },
      orderBy: { createdAt: "desc" },
    })
  }

  static async getQuizById(id: string) {
    return await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    })
  }

  static async updateQuiz(id: string, data: z.infer<typeof UpdateQuizSchema>) {
   const res = UpdateQuizSchema.parse(data)
   const {questions, ...resData} = res

    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        ...resData
      },
      include: {
        questions: true,
      },
    })

    return quiz
  }

  static async publishQuiz(id: string) {
    return await prisma.quiz.update({
      where: { id },
      data: { isPublished: true },
    })
  }

  static async deleteQuiz(id: string) {
    return await prisma.quiz.delete({
      where: { id },
    })
  }

  static async startQuizSession(quizId: string, studentId: string) {
    const quiz = await this.getQuizById(quizId)

    if (!quiz) {
      throw new Error("Quiz not found")
    }

    // Randomize questions
    const randomizedQuestions = randomizeArray(quiz.questions.map((q) => q.id))

    const session = await prisma.quizSession.create({
      data: {
        quizId,
        studentId,
        startTime: new Date(),
        questions: JSON.stringify(randomizedQuestions),
      },
    })

    return session
  }

  static async getQuizSession(id: string) {
    return await prisma.quizSession.findUnique({
      where: { id },
      include: {
        quiz: {
          include: {
            questions: true,
          },
        },
        studentAnswers: true,
      },
    })
  }

  static async submitQuizSession(sessionId: string, studentId: string, studentAnswers: Record<string, string>) {
    const answers = await prisma.studentAnswer.createMany({
      data: Object.keys(studentAnswers).map(key => ({
        sessionId,
        studentId,
        questionId: key,
        selectedAnswer: studentAnswers[key],
      }))
    })
    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: {
        studentAnswers: true,
        quiz: true,
      },
    })

    console.log(session)

    if (!session) {
      throw new Error("Session not found")
    }

    // Calculate score
    const correctAnswers = session.studentAnswers.filter((a) => a.isCorrect).length
    const totalQuestions = session.studentAnswers.length
    const percentage = (correctAnswers / totalQuestions) * 100
    const passingStatus = percentage >= (session.quiz.passingScore || 60)

    // Update session status
    const updatedSession = await prisma.quizSession.update({
      where: { id },
      data: {
        status: "SUBMITTED",
        endTime: new Date(),
      },
    })

    // Create result
    const result = await prisma.result.create({
      data: {
        quizId: session.quizId,
        studentId: session.studentId,
        score: correctAnswers,
        totalQuestions,
        percentage,
        passingStatus,
      },
    })

    return { session: updatedSession, result }
  }
}
