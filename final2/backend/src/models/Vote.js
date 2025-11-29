import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema(
  {
    news: { type: mongoose.Schema.Types.ObjectId, ref: "News", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    choice: { type: String, enum: ["Fake", "Real"], required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

VoteSchema.index({ news: 1, user: 1 }, { unique: true });

export default mongoose.model("Vote", VoteSchema);
