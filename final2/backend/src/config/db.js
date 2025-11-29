import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export default async function connect(uri) {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
  } catch {
    const mem = await MongoMemoryServer.create();
    const memUri = mem.getUri("truthseeker");
    await mongoose.connect(memUri);
  }
}
