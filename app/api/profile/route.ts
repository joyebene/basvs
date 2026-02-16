import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { TokenPayload, verifyAccessToken } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const decoded = verifyAccessToken(token) as TokenPayload;

    const user = await User.findById(decoded.id).select("-password");
    return Response.json(user);
}

export async function PUT(req: Request) {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const decoded = verifyAccessToken(token) as TokenPayload;
    const body = await req.json();

    const user = await User.findByIdAndUpdate(decoded.id, body, { new: true });
    return Response.json(user);
}
