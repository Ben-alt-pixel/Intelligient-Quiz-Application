import { Router } from "express"
import { ResultController } from "@/controllers/result-controller"
import { authMiddleware } from "@/middlewares/auth"

const router = Router()

router.get("/my-results", authMiddleware, ResultController.getStudentResults)
router.get("/quiz/:quizId", ResultController.getQuizResults)
router.get("/:quizId/:studentId", ResultController.getResultDetails)

export default router
