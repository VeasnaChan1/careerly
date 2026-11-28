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

export async function updateUser(id, updatedData) {
  try {
    const dataToUpdate = {};
    if (updatedData.name !== undefined) dataToUpdate.name = updatedData.name;
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
    const address = email.trim();
    let user = await prisma.user.findUnique({ where: { email: address } });
    const normalized = address.toLowerCase();
    if (!user && normalized !== address) {
      user = await prisma.user.findUnique({ where: { email: normalized } });
    }

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
