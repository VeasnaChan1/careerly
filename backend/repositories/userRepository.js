import prisma from "../db/prisma.js";
import bcrypt from "bcrypt";

export async function getUsers() {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true
      }
    });
  } catch (error) {
    console.error("Repository error fetching users:", error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    return await prisma.user.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error("Repository error fetching user by ID:", error);
    throw error;
  }
}

export async function createUser(newUserData) {
  try {
    const userExist = await prisma.user.findUnique({
      where: { email: newUserData.email }
    });

    if (userExist) {
      const error = new Error("User already exists with this email");
      error.statusCode = 400;
      throw error;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newUserData.password || newUserData.password_hash, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        name: newUserData.name || newUserData.fullName || (newUserData.email ? newUserData.email.split("@")[0] : "User"),
        email: newUserData.email,
        password_hash: passwordHash,
        role: newUserData.role || "user"
      }
    });

    return newUser;
  } catch (error) {
    console.error("Repository error creating user:", error);
    throw error;
  }
}

export async function updateUser(id, updatedData) {
  try {
    const dataToUpdate = {};
    if (updatedData.name !== undefined) dataToUpdate.name = updatedData.name;
    if (updatedData.email !== undefined) dataToUpdate.email = updatedData.email;
    if (updatedData.role !== undefined) dataToUpdate.role = updatedData.role;
    if (updatedData.password) {
      dataToUpdate.password_hash = await bcrypt.hash(updatedData.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: dataToUpdate
    });
    return user;
  } catch (error) {
    console.error("Repository error updating user:", error);
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    const deleted = await prisma.user.delete({
      where: { id }
    });
    return deleted;
  } catch (error) {
    console.error("Repository error deleting user:", error);
    throw error;
  }
}

export async function loginUser({ email, password }) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    return user;
  } catch (error) {
    console.error("Repository error during login:", error);
    throw error;
  }
}
