import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { upload } from "../config/upload.js";

const router = Router();

router.post("/register", upload.single("avatar"), async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) return res.status(400).json({ error: "bad_request" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "email_exists" });
  const passwordHash = await bcrypt.hash(password, 10);
  const avatarUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const user = await User.create({ firstName, lastName, email, passwordHash, avatarUrl });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });
  res.json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, avatarUrl: user.avatarUrl } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "invalid_credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });
  res.json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, avatarUrl: user.avatarUrl } });
});

router.get("/me", async (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(200).json({ user: null });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    const user = await User.findById(payload.id);
    if (!user) return res.status(200).json({ user: null });
    res.json({ user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, avatarUrl: user.avatarUrl } });
  } catch {
    res.status(200).json({ user: null });
  }
});

export default router;
