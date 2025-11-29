import bcrypt from "bcryptjs";
import User from "./models/User.js";
import News from "./models/News.js";
import Vote from "./models/Vote.js";
import Comment from "./models/Comment.js";
import { recomputeNews } from "./utils/recompute.js";

export async function seedData({ newsCount = 72 } = {}) {
  await Promise.all([User.deleteMany({}), News.deleteMany({}), Vote.deleteMany({}), Comment.deleteMany({})]);
  const admin = await User.create({ firstName: "Admin", lastName: "User", email: "admin@example.com", passwordHash: await bcrypt.hash("admin123", 10), role: "Administrator" });
  const member = await User.create({ firstName: "John", lastName: "Doe", email: "john@example.com", passwordHash: await bcrypt.hash("john123", 10), role: "Member" });
  const readers = [];
  for (let i = 0; i < 40; i++) {
    readers.push(await User.create({ firstName: `Reader${i + 1}`, lastName: "User", email: `reader${i + 1}@example.com`, passwordHash: await bcrypt.hash("reader123", 10), role: "Reader" }));
  }
  const templates = [
    "SpaceX Starship Completes Orbital Test",
    "Apple Announces Brain-Chip Interface",
    "New Battery Tech Promises 1000km Range",
    "AI Predicts Earthquakes With 90% Accuracy",
    "Cure Found For Common Cold",
    "Ancient City Discovered Under Desert",
    "Breakthrough in Fusion Energy",
    "Local Team Wins Championship",
    "Economy Booms Unexpectedly",
    "Secret Underground City Found",
  ];
  const newsDocs = [];
  for (let i = 0; i < newsCount; i++) {
    const title = `${templates[i % templates.length]} (Vol. ${i + 1})`;
    const n = await News.create({
      title,
      shortDesc: `Generated summary #${i + 1}.`,
      fullDesc: `Full generated content for report #${i + 1}.`,
      author: i % 2 === 0 ? admin._id : member._id,
      imageUrl: `https://picsum.photos/seed/gen${i}/800/400`,
    });
    newsDocs.push(n);
  }
  for (const n of newsDocs) {
    const voters = [...readers.slice(0, 20), member, admin];
    for (const u of voters) {
      const choice = Math.random() < 0.5 ? "Fake" : "Real";
      try { await Vote.create({ news: n._id, user: u._id, choice }); } catch {}
    }
    await recomputeNews(n._id);
    const commentsN = Math.floor(Math.random() * 6) + 2;
    for (let k = 0; k < commentsN; k++) {
      const u = voters[Math.floor(Math.random() * voters.length)];
      await Comment.create({ news: n._id, user: u._id, text: "Interesting point.", imageUrl: undefined });
    }
    const count = await Comment.countDocuments({ news: n._id, isDeleted: false });
    await News.findByIdAndUpdate(n._id, { commentsCount: count });
  }
}
