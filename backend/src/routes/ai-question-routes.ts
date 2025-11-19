import { Router } from "express";
import { AIQuestionController } from "@/controllers/ai-question-controller";
import { authMiddleware, roleMiddleware } from "@/middlewares/auth";

const router = Router();

// Test endpoint - check if Ollama is working
router.get("/test-ollama", AIQuestionController.testOllama);

router.post(
  "/generate",
  authMiddleware,
  roleMiddleware(["LECTURER"]),
  AIQuestionController.generateQuestions
);

router.get(
  "/:quizId/:materialId",
  authMiddleware,
  AIQuestionController.getGeneratedQuestions
);

export default router;
