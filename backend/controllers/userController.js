import * as userRepository from "../repositories/userRepository.js";
import * as resumeRepository from "../repositories/resumeRepository.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "careerly_jwt_super_secret_key_2026",
    { expiresIn: "7d" }
  );
};

export async function getAllUsers(req, res) {
  try {
    const users = await userRepository.getUsers();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getUserById(req, res) {
  try {
    const id = req.userId;
    const user = await userRepository.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password_hash, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const newUser = await userRepository.createUser(req.body);
    const token = generateToken(newUser.id);
    const { password_hash, ...userData } = newUser;

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: userData
    });
  } catch (error) {
    console.error("Error creating user:", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Server error";
    return res.status(statusCode).json({ message });
  }
}

export async function updateUser(req, res) {
  try {
    const updatedUser = await userRepository.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password_hash, ...userData } = updatedUser;
    res.json(userData);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteUser(req, res) {
  try {
    await userRepository.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userRepository.loginUser({ email, password });
    const token = generateToken(user.id);
    const { password_hash, ...userData } = user;

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userData
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Server error";
    return res.status(statusCode).json({ message });
  }
}

export async function getUserResumes(req, res) {
  try {
    const userId = req.userId;
    const resumes = await resumeRepository.getUserResumes(userId);
    return res.status(200).json({ resumes });
  } catch (error) {
    console.error("Error fetching user resumes:", error);
    return res.status(400).json({ message: error.message });
  }
}
