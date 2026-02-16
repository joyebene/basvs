import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyRefreshToken, signAccessToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  await connectDB();

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({ message: "Invalid refresh token" }, { status: 403 });
    }

    const newAccessToken = signAccessToken({ id: user._id });

    return NextResponse.json({ accessToken: newAccessToken });
  } catch {
    return NextResponse.json({ message: "Refresh token expired" }, { status: 403 });
  }
}
