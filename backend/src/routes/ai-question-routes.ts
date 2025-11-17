import { Router } from "express"
import { AIQuestionController } from "@/controllers/ai-question-controller"
import { authMiddleware, roleMiddleware } from "@/middlewares/auth"

const router = Router()

router.post(
  "/generate",
  authMiddleware,
  roleMiddleware(["LECTURER"]),
  AIQuestionController.generateQuestions
)
router.get(
  "/:quizId/:materialId",
  authMiddleware,
  AIQuestionController.getGeneratedQuestions
)

export default router
