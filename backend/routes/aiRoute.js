import express from "express";
import { protect, optionalProtect } from "../middleware/authMiddleware.js";
import {
  enhanceJobDescription,
  enhanceProfessionalSumary,
  suggestProfessionalSummary,
  rewriteText,
  checkGrammar,
  uploadResume
} from "../controllers/aiController.js";
import { upload } from "../config/multer.js";

export const aiRouter = express.Router();

aiRouter.post("/suggest-summary", optionalProtect, suggestProfessionalSummary);
aiRouter.post("/enchance-pro-sum", optionalProtect, enhanceProfessionalSumary);
aiRouter.post("/enhance-job-desc", optionalProtect, enhanceJobDescription);
aiRouter.post("/rewrite", optionalProtect, rewriteText);
aiRouter.post("/grammar-check", optionalProtect, checkGrammar);
aiRouter.post("/upload-resume", protect, upload.single("resume"), uploadResume);

export default aiRouter;
