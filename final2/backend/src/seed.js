import mongoose from "mongoose";
import connect from "./config/db.js";
import { seedData } from "./seedData.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/truthseeker";

async function run() {
  await connect(MONGO_URI);
  await seedData({ newsCount: 72 });
  console.log("seed_done");
  await mongoose.disconnect();
}

run();
