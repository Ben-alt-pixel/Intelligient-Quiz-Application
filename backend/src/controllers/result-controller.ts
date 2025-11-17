import { Request, Response, NextFunction } from "express"
import { ResultService } from "@/services/result-service"
import { formatResponse, formatError } from "@/utils/response-formatter"
import { AuthRequest } from "@/middlewares/auth"

export class ResultController {
  static async getStudentResults(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const results = await ResultService.getStudentResults(req.user!.id)
      res.status(200).json(formatResponse(true, results))
    } catch (error: any) {
      next(error)
    }
  }

  static async getQuizResults(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await ResultService.getQuizResults(req.params.quizId)
      res.status(200).json(formatResponse(true, results))
    } catch (error: any) {
      next(error)
    }
  }

  static async getResultDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizId, studentId } = req.params
      const details = await ResultService.getResultDetails(quizId, studentId)
      res.status(200).json(formatResponse(true, details))
    } catch (error: any) {
      next(error)
    }
  }
}
