import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const matricNumber = body.matricNumber.toUpperCase().trim();
  const password = body.password;

  const user = await User.findOne({ matricNumber });
  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  // const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) {
  //   return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  // }

  // const isMatch = await bcrypt.compare(password, user.password);
  if (password !== user.password) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }


  const accessToken = signAccessToken({ id: user._id.toString() });
  const refreshToken = signRefreshToken({ id: user._id.toString() });

  const response = NextResponse.json({
    accessToken,
    user: {
      id: user._id,
      role: user.role,
      matricNumber: user.matricNumber,
    },
  });

  /* Store refresh token securely */
  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return response;
}
