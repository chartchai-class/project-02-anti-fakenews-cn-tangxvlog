import jwt from "jsonwebtoken";
import User from "../models/User.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    req.userId = payload.id;
    next();
  } catch {
    res.status(401).json({ error: "invalid_token" });
  }
}

export async function requireRole(role) {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(401).json({ error: "unauthorized" });
      if (role === "Member" && !(user.role === "Member" || user.role === "Administrator")) {
        return res.status(403).json({ error: "forbidden" });
      }
      if (role === "Administrator" && user.role !== "Administrator") {
        return res.status(403).json({ error: "forbidden" });
      }
      next();
    } catch {
      res.status(401).json({ error: "unauthorized" });
    }
  };
}
