import { Router } from "express"
import authRoutes from "./auth-routes"
import userRoutes from "./user-routes"
import materialRoutes from "./material-routes"
import quizRoutes from "./quiz-routes"
import aiQuestionRoutes from "./ai-question-routes"
import resultRoutes from "./result-routes"
import videoRoutes from "./video-routes"

const router = Router()

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/materials", materialRoutes)
router.use("/quizzes", quizRoutes)
router.use("/ai/questions", aiQuestionRoutes)
router.use("/results", resultRoutes)
router.use("/videos", videoRoutes)

export default router
