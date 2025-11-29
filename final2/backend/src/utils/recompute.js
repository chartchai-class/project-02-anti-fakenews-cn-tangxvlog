import Vote from "../models/Vote.js";
import News from "../models/News.js";
import mongoose from "mongoose";

export async function recomputeNews(newsId) {
  const id = typeof newsId === "string" ? new mongoose.Types.ObjectId(newsId) : newsId;
  const agg = await Vote.aggregate([
    { $match: { news: id, isDeleted: false } },
    { $group: { _id: "$choice", count: { $sum: 1 } } },
  ]);
  let fake = 0;
  let real = 0;
  for (const r of agg) {
    if (r._id === "Fake") fake = r.count;
    if (r._id === "Real") real = r.count;
  }
  const status = fake === 0 && real === 0 ? "Unknown" : fake >= real ? "LikelyFake" : "LikelyReal";
  const votesCount = fake + real;
  await News.findByIdAndUpdate(newsId, { status, votesCount });
}
