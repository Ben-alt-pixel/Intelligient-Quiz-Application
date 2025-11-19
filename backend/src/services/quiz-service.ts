import { prisma } from "@/config/database";
import { randomizeArray } from "@/utils/randomization";
import { z } from "zod";

const QuestionSchema = z
  .object({
    correctAnswer: z.number().min(0),
    description: z.string().optional(),
    options: z.array(z.string()).min(1),
    explanation: z.string().optional(),
    text: z.string().min(1),
  })
  .refine((data) => data.correctAnswer < data.options.length, {
    message: "correctAnswer must reference an index in options",
  });

const CreateQuizSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().min(1),
  passingScore: z.number().min(0).max(100).default(60),
  questions: z.array(QuestionSchema),
});

const UpdateQuizSchema = CreateQuizSchema.partial();

export class QuizService {
  static async createQuiz(
    lecturerId: string,
    data: z.infer<typeof CreateQuizSchema>
  ) {
    const res = CreateQuizSchema.parse(data);
    const { questions, ...resData } = res;

    const quiz = await prisma.quiz.create({
      data: {
        ...resData,
        lecturerId,
      },
    });

    const questionsData = await prisma.question.createMany({
      data: questions.map((question) => ({
        text: question.text,
        correctAnswer: question.correctAnswer,
        options: question.options,
        explanation: question.explanation,
        quizId: quiz.id,
      })),
    });
    return quiz;
  }

  static async getQuizzes(lecturerId: string) {
    return await prisma.quiz.findMany({
      where: { lecturerId },
      include: {
        questions: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getPublishedQuizzes() {
    return await prisma.quiz.findMany({
      include: {
        questions: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async answerQuestion(
    questionId: string,
    selectedAnswer: string,
    studentId: string,
    sessionId: string
  ) {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new Error("Question not found");
    }

    const options = Array.isArray(question.options)
      ? (question.options as string[])
      : [];
    const isCorrect = options[question.correctAnswer] === selectedAnswer;

    return await prisma.studentAnswer.upsert({
      where: {
        questionId_sessionId_studentId: {
          questionId,
          sessionId,
          studentId,
        },
      },
      update: {
        selectedAnswer,
        isCorrect,
      },
      create: {
        questionId,
        sessionId,
        studentId,
        selectedAnswer,
        isCorrect,
      },
    });
  }

  static async getQuizById(id: string) {
    return await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });
  }

  static async updateQuiz(id: string, data: z.infer<typeof UpdateQuizSchema>) {
    const res = UpdateQuizSchema.parse(data);
    const { questions, ...resData } = res;

    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        ...resData,
      },
      include: {
        questions: true,
      },
    });

    return quiz;
  }

  // static async publishQuiz(id: string) {
  //   return await prisma.quiz.update({
  //     where: { id },
  //     data: { isPublished: true },
  //   });
  // }

  static async deleteQuiz(id: string) {
    return await prisma.quiz.delete({
      where: { id },
    });
  }

  static async startQuizSession(quizId: string, studentId: string) {
    const quiz = await this.getQuizById(quizId);

    const existingResult = await prisma.result.findUnique({
      where: {
        quizId_studentId: {
          quizId,
          studentId,
        },
      },
    });

    if (existingResult) {
      throw new Error("You have already taken this quiz");
    }

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Randomize questions
    const randomizedQuestions = randomizeArray(quiz.questions.map((q) => q.id));

    const session = await prisma.quizSession.create({
      data: {
        quizId,
        studentId,
        startTime: new Date(),
        questions: JSON.stringify(randomizedQuestions),
      },
    });

    return session;
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
    });
  }

  static async submitQuizSession(sessionId: string) {
    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: {
        studentAnswers: true,
        quiz: true,
      },
    });

    console.log(session);

    if (!session) {
      throw new Error("Session not found");
    }

    // Calculate score
    const correctAnswers = session.studentAnswers.filter(
      (a) => a.isCorrect
    ).length;
    const totalQuestions = session.studentAnswers.length;
    const percentage =
      totalQuestions === 0 ? 0 : (correctAnswers / totalQuestions) * 100;

    const passingStatus = percentage >= (session.quiz.passingScore || 60);

    console.log(correctAnswers, totalQuestions, percentage, passingStatus);

    // Update session status
    const updatedSession = await prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        status: "SUBMITTED",
        endTime: new Date(),
      },
    });

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
    });

    return { session: updatedSession, result };
  }

  static async saveVideoSubmission(
    sessionId: string,
    studentId: string,
    videoPath: string,
    duration: number,
    fileSize: number
  ) {
    // Verify session exists and belongs to student
    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error("Session not found");
    }

    if (session.studentId !== studentId) {
      throw new Error("Session does not belong to this student");
    }

    // Create or update video submission
    const videoSubmission = await prisma.videoSubmission.upsert({
      where: { sessionId },
      update: {
        videoUrl: videoPath,
        duration,
        fileSize,
        uploadedAt: new Date(),
      },
      create: {
        sessionId,
        studentId,
        videoUrl: videoPath,
        duration,
        fileSize,
      },
    });

    return videoSubmission;
  }
}
