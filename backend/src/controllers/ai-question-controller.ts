import { Request, Response, NextFunction } from "express"
import { AIQuestionService } from "@/services/ai-question-service"
import { formatResponse, formatError } from "@/utils/response-formatter"

export class AIQuestionController {
  static async generateQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const questions = await AIQuestionService.generateQuestions(req.body)
      res.status(201).json(formatResponse(true, questions, "Questions generated successfully", 201))
    } catch (error: any) {
      next(error)
    }
  }

  static async getGeneratedQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizId, materialId } = req.params
      const questions = await AIQuestionService.getGeneratedQuestions(quizId, materialId)
      res.status(200).json(formatResponse(true, questions))
    } catch (error: any) {
      next(error)
    }
  }
}
