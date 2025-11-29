import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import User from "../models/User.js";
import News from "../models/News.js";
import Vote from "../models/Vote.js";
import Comment from "../models/Comment.js";
import { recomputeNews } from "../utils/recompute.js";

const router = Router();

router.post("/users/:id/role", requireAuth, await requireRole("Administrator"), async (req, res) => {
  const { role } = req.body;
  if (!["Reader", "Member", "Administrator"].includes(role)) return res.status(400).json({ error: "bad_request" });
  const u = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  res.json({ id: u._id, role: u.role });
});

router.delete("/news/:id", requireAuth, await requireRole("Administrator"), async (req, res) => {
  await News.findByIdAndUpdate(req.params.id, { isDeleted: true });
  res.json({ ok: true });
});

router.delete("/votes/:id", requireAuth, await requireRole("Administrator"), async (req, res) => {
  const v = await Vote.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (v) await recomputeNews(v.news);
  res.json({ ok: true });
});

router.delete("/comments/:id", requireAuth, await requireRole("Administrator"), async (req, res) => {
  const c = await Comment.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (c) {
    const count = await Comment.countDocuments({ news: c.news, isDeleted: false });
    await News.findByIdAndUpdate(c.news, { commentsCount: count });
  }
  res.json({ ok: true });
});

router.get("/data", requireAuth, await requireRole("Administrator"), async (req, res) => {
  const [users, news, votes, comments] = await Promise.all([
    User.find({}).select("firstName lastName email role createdAt"),
    News.find({}).select("title status author createdAt isDeleted"),
    Vote.find({}).select("news user choice createdAt isDeleted"),
    Comment.find({}).select("news user text createdAt isDeleted"),
  ]);
  res.json({ users, news, votes, comments });
});

export default router;
