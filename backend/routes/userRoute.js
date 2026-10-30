import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getUserResumes
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect, getUserResumes);
userRouter.put("/:id", protect, updateUser);
userRouter.delete("/:id", protect, deleteUser);

export default userRouter;
