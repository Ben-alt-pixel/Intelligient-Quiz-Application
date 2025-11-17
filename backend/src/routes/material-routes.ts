import { Router } from "express"
import { MaterialController } from "@/controllers/material-controller"
import { authMiddleware, roleMiddleware } from "@/middlewares/auth"
import { uploadMaterial } from "@/middlewares/multer"

const router = Router()

router.post(
  "/upload",
  authMiddleware,
  roleMiddleware(["LECTURER"]),
  uploadMaterial.single("file"),
  MaterialController.createMaterial
)
router.get("/", authMiddleware, MaterialController.getMaterials)
router.get("/:id", MaterialController.getMaterialById)
router.delete("/:id", authMiddleware, MaterialController.deleteMaterial)

export default router
