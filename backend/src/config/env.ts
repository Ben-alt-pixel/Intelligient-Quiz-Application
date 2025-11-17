import dotenv from "dotenv"

dotenv.config()

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  PORT: parseInt(process.env.PORT || "5000"),
  NODE_ENV: process.env.NODE_ENV || "development",
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || "10485760"),
  UPLOAD_DIR: process.env.UPLOAD_DIR || "./uploads",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
}

export default env
