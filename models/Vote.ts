import mongoose, { Schema, models } from "mongoose";

const VoteSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        election: { type: Schema.Types.ObjectId, ref: "Election" },
        candidateId: String,
    },
    { timestamps: true }
);

export default models.Vote || mongoose.model("Vote", VoteSchema);
