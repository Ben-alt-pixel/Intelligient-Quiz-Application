import express from "express"
import cors from "cors"
import path from "path"
import { env } from "@/config/env"
import { errorHandler } from "@/middlewares/error-handler"
import routes from "@/routes"

const app = express()

// Middleware
app.use(cors({ origin: env.FRONTEND_URL }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files
app.use("/uploads", express.static(path.join(env.UPLOAD_DIR)))

// Routes
app.use("/api", routes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() })
})

// Error handler
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found", statusCode: 404 })
})

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`)
  console.log(`Environment: ${env.NODE_ENV}`)
})
