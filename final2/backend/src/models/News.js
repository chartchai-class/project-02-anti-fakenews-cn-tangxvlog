import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    shortDesc: { type: String, required: true },
    fullDesc: { type: String, required: true },
    imageUrl: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Unknown", "LikelyFake", "LikelyReal"], default: "Unknown" },
    votesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("News", NewsSchema);
