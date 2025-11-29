import { Router } from "express";
import Comment from "../models/Comment.js";
import News from "../models/News.js";
import { upload } from "../config/upload.js";
import { requireAuth } from "../middleware/auth.js";
import { paginateQuery } from "../utils/paginate.js";

const router = Router();

router.post("/news/:id/comments", requireAuth, upload.single("image"), async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news || news.isDeleted) return res.status(404).json({ error: "not_found" });
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const c = await Comment.create({ news: news._id, user: req.userId, text: req.body.text, imageUrl });
  const count = await Comment.countDocuments({ news: news._id, isDeleted: false });
  await News.findByIdAndUpdate(news._id, { commentsCount: count });
  res.json({ id: c._id });
});

router.get("/news/:id/comments", async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const data = await paginateQuery(Comment, { news: req.params.id, isDeleted: false }, { page, pageSize, sort: { createdAt: -1 }, populate: [{ path: "user", select: "firstName lastName avatarUrl" }] });
  res.json({ items: data.items.map((c) => ({ id: c._id, text: c.text, imageUrl: c.imageUrl, createdAt: c.createdAt, user: { id: c.user._id, name: `${c.user.firstName} ${c.user.lastName}`, avatarUrl: c.user.avatarUrl } })), total: data.total, page: data.page, pageSize: data.pageSize, pages: data.pages });
});

router.delete("/comments/:id", requireAuth, async (req, res) => {
  const c = await Comment.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (c) {
    const count = await Comment.countDocuments({ news: c.news, isDeleted: false });
    await News.findByIdAndUpdate(c.news, { commentsCount: count });
  }
  res.json({ ok: true });
});

export default router;
