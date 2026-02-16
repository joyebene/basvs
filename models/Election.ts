import mongoose, { Schema, models } from "mongoose";

const CandidateSchema = new Schema({
  name: String,
  position: String,
  votes: { type: Number, default: 0 },
});

const ElectionSchema = new Schema(
  {
    title: String,
    description: String,
    startDate: Date,
    endDate: Date,

    isPublic: { type: Boolean, default: true },
    passcode: String,

    candidates: [CandidateSchema],

    totalVotes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

export default models.Election || mongoose.model("Election", ElectionSchema);
