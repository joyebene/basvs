import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    matricNumber: { type: String, unique: true },
    email: String,
    password: String,
    avatar: String,
    role: { type: String, enum: ["student", "admin"], default: "student" },
    votesCast: { type: Number, default: 0 },

    votedElections: [
      {
        type: Schema.Types.ObjectId,
        ref: "Election",
      },
    ],
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
