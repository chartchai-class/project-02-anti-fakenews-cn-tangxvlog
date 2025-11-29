import { Router } from "express";
import Vote from "../models/Vote.js";
import News from "../models/News.js";
import { requireAuth } from "../middleware/auth.js";
import { recomputeNews } from "../utils/recompute.js";

const router = Router();

router.post("/news/:id/votes", requireAuth, async (req, res) => {
  const { choice } = req.body;
  if (!["Fake", "Real"].includes(choice)) return res.status(400).json({ error: "bad_request" });
  const news = await News.findById(req.params.id);
  if (!news || news.isDeleted) return res.status(404).json({ error: "not_found" });
  try {
    await Vote.create({ news: news._id, user: req.userId, choice });
  } catch (e) {
    return res.status(409).json({ error: "already_voted" });
  }
  await recomputeNews(news._id);
  res.json({ ok: true });
});

router.delete("/votes/:id", requireAuth, async (req, res) => {
  await Vote.findByIdAndUpdate(req.params.id, { isDeleted: true });
  const v = await Vote.findById(req.params.id);
  if (v) await recomputeNews(v.news);
  res.json({ ok: true });
});

export default router;
