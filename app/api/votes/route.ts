import { connectDB } from "@/lib/mongodb";
import Election from "@/models/Election";
import { NextResponse } from "next/server";

// Get Votes
export async function GET() {
    await connectDB();
    const now = new Date();


    // End ongoing elections
    await Election.updateMany(
        { status: "ongoing", endDate: { $lt: now } },
        { status: "completed" }
    );

    // Start upcoming elections
    await Election.updateMany(
        { status: "upcoming", startDate: { $lte: now } },
        { status: "ongoing" }
    );

    const elections = await Election.find({ status: "ongoing" }).sort({ createdAt: -1 });

	return NextResponse.json(elections);
}