import { Request, Response, NextFunction } from "express";
import { AIQuestionService } from "@/services/ai-question-service";
import { formatResponse, formatError } from "@/utils/response-formatter";
import { ollamaService } from "@/services/ollama-question-service";

export class AIQuestionController {
  static async generateQuestions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const questions = await AIQuestionService.generateQuestions(req.body);
      res
        .status(201)
        .json(
          formatResponse(
            true,
            questions,
            "Questions generated successfully",
            201
          )
        );
    } catch (error: any) {
      next(error);
    }
  }

  static async getGeneratedQuestions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { quizId, materialId } = req.params;
      const questions = await AIQuestionService.getGeneratedQuestions(
        quizId,
        materialId
      );
      res.status(200).json(formatResponse(true, questions));
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Test endpoint to check if Ollama is properly configured
   * GET /api/ai/questions/test-ollama
   */
  static async testOllama(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ollamaService.testConnection();

      if (result.success) {
        res
          .status(200)
          .json(
            formatResponse(true, result, "Ollama is working correctly! 🎉")
          );
      } else {
        res
          .status(503)
          .json(formatResponse(false, result, result.message, 503));
      }
    } catch (error: any) {
      next(error);
    }
  }
}
