import { Router } from "express"
import { VideoController } from "@/controllers/video-controller"
import { authMiddleware } from "@/middlewares/auth"
import { uploadVideo } from "@/middlewares/multer"

const router = Router()

router.post(
  "/upload",
  authMiddleware,
  uploadVideo.single("video"),
  VideoController.uploadVideo
)
router.get("/:id", VideoController.getVideoSubmission)

export default router
