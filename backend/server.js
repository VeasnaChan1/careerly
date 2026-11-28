import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import prisma from "./db/prisma.js";
import { ensureJobContactColumn } from "./db/ensureJobContactColumn.js";
import { ensureSignupTable } from "./db/ensureSignupTable.js";
import { ensurePasswordResetTable } from "./db/ensurePasswordResetTable.js";
import userRouter from "./routes/userRoute.js";
import { resumeRouter } from "./routes/resumeRoute.js";
import { aiRouter } from "./routes/aiRoute.js";
import { interviewRouter } from "./routes/interviewRoute.js";
import { jobRouter } from "./routes/jobRoute.js";
import { seedInterviewQuestions } from "./prisma/seedInterview.js";
import { seedJobs } from "./prisma/seedJobs.js";
import { swaggerSpec } from "./config/swagger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.join(__dirname, ".env"),
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Serve static uploaded files
app.use("/uploads", express.static(path.resolve("./public/uploads")));

app.get("/", (req, res) => res.send("CAREERLY Backend Server is running"));

app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/jobs", jobRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

let serverInstance = null;

async function startServer() {
  try {
    await prisma.$connect();
    await ensureJobContactColumn();
    await ensureSignupTable().catch((error) => {
      console.error("Signup table setup failed:", error.message);
    });
    await ensurePasswordResetTable().catch((error) => {
      console.error("Password reset table setup failed:", error.message);
    });
    console.log("✅ PostgreSQL Database connected successfully via Prisma");

    serverInstance = app.listen(PORT, () => {
      console.log(`🚀 CAREERLY Server running on http://localhost:${PORT}`);
    });

    // Keep event loop active
    setInterval(() => {}, 1000 * 60 * 60);

    // Run seeding in background after server is listening
    seedInterviewQuestions().catch((error) => {
      console.error("Interview seeding notice:", error.message);
    });
    seedJobs().catch((error) => {
      console.error("Job seeding notice:", error.message);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

startServer();
