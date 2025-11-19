import { Router } from "express";
import { QuizController } from "@/controllers/quiz-controller";
import { authMiddleware, roleMiddleware } from "@/middlewares/auth";
import { uploadVideo } from "@/middlewares/multer";

const router = Router();

// Lecturer routes
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["LECTURER"]),
  QuizController.createQuiz
);
router.get(
  "/my-quizzes",
  authMiddleware,
  roleMiddleware(["LECTURER"]),
  QuizController.getQuizzes
);
router.post(
  "/answer",
  authMiddleware,
  roleMiddleware(["STUDENT"]),
  QuizController.answerQuestion
);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["LECTURER"]),
  QuizController.updateQuiz
);
router.patch(
  "/:id/publish",
  authMiddleware,
  roleMiddleware(["LECTURER"]),
  QuizController.publishQuiz
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["LECTURER"]),
  QuizController.deleteQuiz
);

// Student routes
router.get("/published", QuizController.getPublishedQuizzes);
router.get("/:id", QuizController.getQuizById);

// Quiz session routes
router.post("/session/start", authMiddleware, QuizController.startQuizSession);
router.get("/session/:id", QuizController.getQuizSession);
router.post("/session/:id/submit", QuizController.submitQuizSession);
router.post(
  "/session/:sessionId/video",
  authMiddleware,
  uploadVideo.single("video"),
  QuizController.uploadSessionVideo
);

export default router;
