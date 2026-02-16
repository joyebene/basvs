import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDB = async () => {
  dotenv.config();
  if (mongoose.connection.readyState >= 1) return;

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in the environment variables.");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("DB connected successfully!!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};