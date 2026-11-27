import express from "express";
import { getJobs, getJobById } from "../controllers/jobController.js";

const jobRouter = express.Router();

jobRouter.get("/", getJobs);
jobRouter.get("/get/:jobId", getJobById);
jobRouter.get("/:jobId", getJobById);

export default jobRouter;
