import express from "express";
import { getJobs, getJobById } from "../controllers/jobController.js";

export const jobRouter = express.Router();

// Public Job Board Endpoints (CAR-17, CAR-2)
jobRouter.get("/", getJobs);
jobRouter.get("/get/:id", getJobById);
jobRouter.get("/:id", getJobById);

export default jobRouter;