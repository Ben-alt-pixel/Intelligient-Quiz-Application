import { Router } from "express"
import { UserController } from "@/controllers/user-controller"
import { authMiddleware } from "@/middlewares/auth"

const router = Router()

router.get("/me", authMiddleware, UserController.getCurrentUser)
router.get("/", UserController.getUsers)
router.patch("/:id", authMiddleware, UserController.updateUser)

export default router
