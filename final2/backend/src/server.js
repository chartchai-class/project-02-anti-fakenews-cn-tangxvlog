import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { uploadDir } from "./config/upload.js";
import authRouter from "./routes/auth.js";
import newsRouter from "./routes/news.js";
import adminRouter from "./routes/admin.js";
import votesRouter from "./routes/votes.js";
import commentsRouter from "./routes/comments.js";
import connect from "./config/db.js";
import { seedData } from "./seedData.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(uploadDir));
app.use("/", express.static(path.join(__dirname, "../../frontend")));

app.use("/api/auth", authRouter);
app.use("/api/news", newsRouter);
app.use("/api/admin", adminRouter);
app.use("/api", votesRouter);
app.use("/api", commentsRouter);

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/truthseeker";
const PORT = process.env.PORT || 3000;

await connect(MONGO_URI);
if ((process.env.SEED_ON_BOOT ?? "true") !== "false") {
  await seedData({ newsCount: 72 });
}

app.listen(PORT, () => {
  console.log(`server:${PORT}`);
});
