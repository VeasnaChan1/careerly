import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "careerly_jwt_super_secret_key_2026");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }
};

export const optionalProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ") ||
    authHeader.split(" ")[1] === "null" ||
    authHeader.split(" ")[1] === "undefined"
  ) {
    req.userId = null;
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "careerly_jwt_super_secret_key_2026");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    req.userId = null;
    next();
  }
};
