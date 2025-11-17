import { prisma } from "@/config/database"

export class ResultService {
  static async getStudentResults(studentId: string) {
    return await prisma.result.findMany({
      where: { studentId },
      include: {
        quiz: true,
      },
      orderBy: { submittedAt: "desc" },
    })
  }

  static async getQuizResults(quizId: string) {
    return await prisma.result.findMany({
      where: { quizId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    })
  }

  static async getResultDetails(quizId: string, studentId: string) {
    const result = await prisma.result.findUnique({
      where: {
        quizId_studentId: {
          quizId,
          studentId,
        },
      },
    })

    if (!result) {
      throw new Error("Result not found")
    }

    const session = await prisma.quizSession.findFirst({
      where: {
        quizId,
        studentId,
        status: "SUBMITTED",
      },
      include: {
        studentAnswers: {
          include: {
            question: true,
          },
        },
      },
    })

    return { result, session }
  }
}
