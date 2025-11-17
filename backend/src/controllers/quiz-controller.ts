import { Request, Response, NextFunction } from "express"
import { QuizService } from "@/services/quiz-service"
import { formatResponse, formatError } from "@/utils/response-formatter"
import { AuthRequest } from "@/middlewares/auth"

export class QuizController {
  static async createQuiz(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const quiz = await QuizService.createQuiz(req.user!.id, req.body)
      res.status(201).json(formatResponse(true, quiz, "Quiz created successfully", 201))
    } catch (error: any) {
      next(error)
    }
  }

  static async getQuizzes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const quizzes = await QuizService.getQuizzes(req.user!.id)
      res.status(200).json(formatResponse(true, quizzes))
    } catch (error: any) {
      next(error)
    }
  }

  static async getPublishedQuizzes(req: Request, res: Response, next: NextFunction) {
    try {
      const quizzes = await QuizService.getPublishedQuizzes()
      res.status(200).json(formatResponse(true, quizzes))
    } catch (error: any) {
      next(error)
    }
  }

  static async getQuizById(req: Request, res: Response, next: NextFunction) {
    try {
      const quiz = await QuizService.getQuizById(req.params.id)
      if (!quiz) {
        return res.status(404).json(formatError("Quiz not found", 404))
      }
      res.status(200).json(formatResponse(true, quiz))
    } catch (error: any) {
      next(error)
    }
  }

  static async updateQuiz(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const quiz = await QuizService.updateQuiz(req.params.id, req.body)
      res.status(200).json(formatResponse(true, quiz, "Quiz updated successfully"))
    } catch (error: any) {
      next(error)
    }
  }

  static async publishQuiz(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const quiz = await QuizService.publishQuiz(req.params.id)
      res.status(200).json(formatResponse(true, quiz, "Quiz published successfully"))
    } catch (error: any) {
      next(error)
    }
  }

  static async deleteQuiz(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await QuizService.deleteQuiz(req.params.id)
      res.status(200).json(formatResponse(true, null, "Quiz deleted successfully"))
    } catch (error: any) {
      next(error)
    }
  }

  static async startQuizSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const session = await QuizService.startQuizSession(req.body.quizId, req.user!.id)
      res.status(201).json(formatResponse(true, session, "Quiz session started", 201))
    } catch (error: any) {
      next(error)
    }
  }

  static async getQuizSession(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await QuizService.getQuizSession(req.params.id)
      if (!session) {
        return res.status(404).json(formatError("Session not found", 404))
      }
      res.status(200).json(formatResponse(true, session))
    } catch (error: any) {
      next(error)
    }
  }

  static async submitQuizSession(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await QuizService.submitQuizSession(req.params.id)
      res.status(200).json(formatResponse(true, result, "Quiz submitted successfully"))
    } catch (error: any) {
      next(error)
    }
  }
}
