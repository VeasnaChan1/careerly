import express from "express";
import {
  getInterviewQuestions,
  getInterviewQuestionById,
  getInterviewCategories,
  getInterviewGuide
} from "../controllers/interviewController.js";

export const interviewRouter = express.Router();

// Public Read-Only Interview Practice Endpoints (BE2)
interviewRouter.get("/questions", getInterviewQuestions);
interviewRouter.get("/questions/:id", getInterviewQuestionById);
interviewRouter.get("/categories", getInterviewCategories);
interviewRouter.get("/guide", getInterviewGuide);

export default interviewRouter;
