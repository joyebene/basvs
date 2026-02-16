import { connectDB } from "@/lib/mongodb";
import Election from "@/models/Election";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  await connectDB();

  // Unwrap params if it's a Promise
  const params = await context.params;
  const electionId = params.id;

  if (!electionId) {
    return NextResponse.json(
      { message: "Election ID required" },
      { status: 400 }
    );
  }

  const election = await Election.findById(electionId);
  if (!election) {
    return NextResponse.json(
      { message: "Election not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(election);
}
