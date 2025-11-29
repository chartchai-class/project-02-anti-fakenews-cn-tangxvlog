import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    news: { type: mongoose.Schema.Types.ObjectId, ref: "News", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    imageUrl: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
