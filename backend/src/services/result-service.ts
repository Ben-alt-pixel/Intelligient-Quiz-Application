import { prisma } from "@/config/database";

export class ResultService {
  static async getStudentResults(studentId: string) {
    return await prisma.result.findMany({
      where: { studentId },
      include: {
        quiz: {
          include: {
            questions: {
              include: {
                studentAnswers: {
                  where: {
                    studentId,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });
  }

  static async getQuizResults(quizId: string) {
    const results = await prisma.result.findMany({
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
    });

    // Get video submissions for each result
    const resultsWithVideos = await Promise.all(
      results.map(async (result) => {
        // Find the quiz session for this result
        const session = await prisma.quizSession.findFirst({
          where: {
            quizId,
            studentId: result.studentId,
            status: "SUBMITTED",
          },
          include: {
            videoSubmission: true,
          },
        });

        return {
          studentName: `${result.student.firstName} ${result.student.lastName}`,
          studentId: result.studentId,
          score: result.score,
          totalQuestions: result.totalQuestions,
          percentage: result.percentage,
          passingStatus: result.passingStatus,
          completedAt: result.submittedAt,
          videoUrl: session?.videoSubmission?.videoUrl || null,
          sessionId: session?.id || null,
        };
      })
    );

    return resultsWithVideos;
  }

  static async getResultDetails(quizId: string, studentId: string) {
    const result = await prisma.result.findUnique({
      where: {
        quizId_studentId: {
          quizId,
          studentId,
        },
      },
    });

    if (!result) {
      throw new Error("Result not found");
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
    });

    return { result, session };
  }
}
