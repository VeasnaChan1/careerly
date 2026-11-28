import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createResume,
  deleteResume,
  duplicateResume,
  getPublicResumeById,
  getResumeById,
  getUserResumes,
  updateResume
} from "../controllers/resumeController.js";
import { upload } from "../config/multer.js";

export const resumeRouter = express.Router();

resumeRouter.get("/", protect, getUserResumes);
resumeRouter.get("/my-cvs", protect, getUserResumes);
resumeRouter.get("/my-resumes", protect, getUserResumes);
resumeRouter.post("/create", protect, createResume);
resumeRouter.post("/duplicate/:resumeId", protect, duplicateResume);
resumeRouter.put("/update", upload.single("image"), protect, updateResume);
resumeRouter.delete("/delete/:resumeId", protect, deleteResume);
resumeRouter.get("/get/:resumeId", protect, getResumeById);
resumeRouter.get("/public/:resumeId", getPublicResumeById);

export default resumeRouter;
