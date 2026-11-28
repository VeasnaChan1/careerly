import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getUserResumes
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requestSignup, verifySignup } from "../controllers/signupController.js";
import { requestPasswordReset, resetPassword } from "../controllers/passwordResetController.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.post("/register", requestSignup);
userRouter.post("/verify-email", async (req, res) => {
  try {
    await verifySignup(req, res);
  } catch (error) {
    console.error("Signup completion failed:", error.message);
    res.status(503).json({ message: "We couldn't complete signup. Please try again shortly." });
  }
});
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", requestPasswordReset);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect, getUserResumes);
userRouter.put("/:id", protect, updateUser);
userRouter.delete("/:id", protect, deleteUser);

export default userRouter;
