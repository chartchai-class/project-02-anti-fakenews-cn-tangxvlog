import { Router } from "express";
import News from "../models/News.js";
import User from "../models/User.js";
import { upload } from "../config/upload.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { paginateQuery } from "../utils/paginate.js";
import { recomputeNews } from "../utils/recompute.js";

const router = Router();

router.post("/", requireAuth, await requireRole("Member"), upload.single("image"), async (req, res) => {
  const { title, shortDesc, fullDesc } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const news = await News.create({ title, shortDesc, fullDesc, imageUrl, author: req.userId });
  res.json({ id: news._id });
});

router.get("/", async (req, res) => {
  const { q = "", status, page = 1, pageSize = 9 } = req.query;
  const authorFilter = [];
  const text = String(q).trim();
  let authorIds = [];
  if (text) {
    const users = await User.find({ $or: [{ firstName: new RegExp(text, "i") }, { lastName: new RegExp(text, "i") }] }).select("_id");
    authorIds = users.map((u) => u._id);
  }
  const query = { isDeleted: false };
  if (text) query.$or = [{ title: new RegExp(text, "i") }, { shortDesc: new RegExp(text, "i") }, { author: { $in: authorIds } }];
  if (status && ["LikelyFake", "LikelyReal", "Unknown"].includes(status)) query.status = status;
  const data = await paginateQuery(News, query, { page, pageSize, populate: [{ path: "author", select: "firstName lastName" }], sort: { createdAt: -1 } });
  res.json({ items: data.items.map((n) => ({
    id: n._id,
    title: n.title,
    shortDesc: n.shortDesc,
    status: n.status,
    authorName: `${n.author.firstName} ${n.author.lastName}`,
    createdAt: n.createdAt,
    votesCount: n.votesCount,
    commentsCount: n.commentsCount,
    imageUrl: n.imageUrl,
  })), total: data.total, page: data.page, pageSize: data.pageSize, pages: data.pages });
});

router.get("/:id", async (req, res) => {
  const n = await News.findById(req.params.id).populate({ path: "author", select: "firstName lastName" });
  if (!n || n.isDeleted) return res.status(404).json({ error: "not_found" });
  res.json({
    id: n._id,
    title: n.title,
    shortDesc: n.shortDesc,
    fullDesc: n.fullDesc,
    status: n.status,
    authorName: `${n.author.firstName} ${n.author.lastName}`,
    createdAt: n.createdAt,
    votesCount: n.votesCount,
    commentsCount: n.commentsCount,
    imageUrl: n.imageUrl,
  });
});

router.delete("/:id", requireAuth, await requireRole("Administrator"), async (req, res) => {
  await News.findByIdAndUpdate(req.params.id, { isDeleted: true });
  res.json({ ok: true });
});

export default router;
