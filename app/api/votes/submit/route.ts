import { TokenPayload, verifyAccessToken } from "@/lib/auth";
import Election from "@/models/Election";
import Vote from "@/models/Vote";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  if(!token) return NextResponse.json({message: "Unauthorized"}, {status: 401})
  const decoded = verifyAccessToken(token) as TokenPayload;

  const { electionId, candidateId } = await req.json();

  const user = await User.findById(decoded.id);
  if (user.votedElections.includes(electionId)) {
    return new Response("You already voted", { status: 400 });
  }

  await Election.updateOne(
    { _id: electionId, "candidates._id": candidateId },
    { $inc: { "candidates.$.votes": 1, totalVotes: 1 } }
  );

  user.votesCast += 1;
  user.votedElections.push(electionId);
  await user.save();

  await Vote.create({ user: user._id, election: electionId, candidateId });

  return new Response("Vote submitted");
}
