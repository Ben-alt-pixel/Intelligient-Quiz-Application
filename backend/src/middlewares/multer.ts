import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "@/config/env";

// Ensure uploads directory exists
if (!fs.existsSync(env.UPLOAD_DIR)) {
  fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
}

// Ensure videos directory exists
const videosDir = path.join(env.UPLOAD_DIR, "videos");
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

// Storage configuration for files
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(env.UPLOAD_DIR, "materials"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Storage configuration for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(env.UPLOAD_DIR, "videos"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// File filter for materials
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// File filter for videos
const videoFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = ["video/mp4", "video/webm"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid video type"), false);
  }
};

export const uploadMaterial = multer({
  storage: fileStorage,
  fileFilter,
  limits: { fileSize: env.MAX_FILE_SIZE },
});

export const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for videos
});
