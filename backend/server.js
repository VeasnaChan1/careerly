import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import prisma from "./db/prisma.js";
import { ensureJobContactColumn } from "./db/ensureJobContactColumn.js";
import userRouter from "./routes/userRoute.js";
import { resumeRouter } from "./routes/resumeRoute.js";
import { aiRouter } from "./routes/aiRoute.js";
import jobRouter from "./routes/jobRoute.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

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
app.use("/api/jobs", jobRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

async function startServer() {
  try {
    await prisma.$connect();
    await ensureJobContactColumn();
    console.log("✅ PostgreSQL Database connected successfully via Prisma");

    app.listen(PORT, () => {
      console.log(`🚀 CAREERLY Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

startServer();
