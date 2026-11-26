import express from 'express';
import { getJobById } from '../controllers/jobController.js';

const jobRouter = express.Router();

jobRouter.get('/get/:jobId', getJobById);

export default jobRouter;